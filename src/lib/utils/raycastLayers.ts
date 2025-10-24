import * as THREE from 'three'
import { BuildingElement } from '../types/building'

/**
 * Raycasting Layer System für kontextbasierte Objektauswahl
 * Basiert auf Three.js native Layers für optimale Performance
 */

export const RAYCAST_LAYERS = {
  GROUND: 0,
  WALLS: 1,
  ROOFS: 2,
  OPENINGS: 3,
} as const

/**
 * Gibt die aktiven Raycast-Layers für ein gegebenes Tool zurück
 */
export function getActiveLayersForTool(
  tool: 'select' | 'wall' | 'window' | 'door' | 'roof' | null
): number[] {
  switch (tool) {
    case 'window':
    case 'door':
      // Fenster und Türen benötigen nur Wände
      return [RAYCAST_LAYERS.WALLS]
    case 'roof':
      // Dächer werden auf dem Boden geplant
      return [RAYCAST_LAYERS.GROUND]
    case 'wall':
      // Wände werden auf dem Boden geplant
      return [RAYCAST_LAYERS.GROUND]
    case 'select':
      // Select-Tool kann alles auswählen
      return [RAYCAST_LAYERS.GROUND, RAYCAST_LAYERS.WALLS, RAYCAST_LAYERS.ROOFS]
    default:
      // Fallback: nur Ground
      return [RAYCAST_LAYERS.GROUND]
  }
}

/**
 * Konfiguriert den Raycaster für bestimmte Layers
 */
export function configureRaycasterLayers(
  raycaster: THREE.Raycaster,
  layers: number[]
): void {
  // Erstelle neue Layers-Instanz
  const raycasterLayers = new THREE.Layers()
  raycasterLayers.disableAll()

  // Aktiviere spezifische Layers
  for (const layer of layers) {
    raycasterLayers.enable(layer)
  }

  raycaster.layers = raycasterLayers
}

/**
 * Filtert Intersections basierend auf aktiven Layers
 * Alternative zu raycaster.layers wenn direktes Filtern bevorzugt wird
 */
export function filterIntersectionsByLayer(
  intersections: THREE.Intersection[],
  activeLayers: number[]
): THREE.Intersection[] {
  return intersections.filter((intersection) => {
    const object = intersection.object
    // Prüfe ob Objekt in einem der aktiven Layers ist
    for (const layer of activeLayers) {
      const layerObj = new THREE.Layers()
      layerObj.set(layer)
      if (object.layers.test(layerObj)) {
        return true
      }
    }
    return false
  })
}

/**
 * Raycast mit Layer-Filterung gegen Scene-Objekte
 */
export function raycastWithLayers(
  raycaster: THREE.Raycaster,
  scene: THREE.Scene,
  layers: number[]
): THREE.Intersection[] {
  // Sammle alle relevanten Objekte aus der Scene
  const raycastTargets: THREE.Object3D[] = []

  scene.traverse((obj) => {
    // Prüfe ob Objekt als Raycast-Target markiert ist
    if (obj.userData.isRaycastTarget) {
      // Prüfe ob Objekt in einem der aktiven Layers ist
      for (const layer of layers) {
        const testLayer = new THREE.Layers()
        testLayer.set(layer)
        if (obj.layers.test(testLayer)) {
          raycastTargets.push(obj)
          break
        }
      }
    }
  })

  // Raycast gegen gefilterte Objekte
  return raycaster.intersectObjects(raycastTargets, true)
}

/**
 * Findet das nächste Wall-Mesh unter dem Mauszeiger
 * Optimiert für Window/Door Tools
 */
export function raycastAgainstWalls(
  raycaster: THREE.Raycaster,
  scene: THREE.Scene
): THREE.Intersection | null {
  const intersections = raycastWithLayers(raycaster, scene, [RAYCAST_LAYERS.WALLS])

  if (intersections.length === 0) {
    return null
  }

  // Gebe nächstes Intersection zurück
  return intersections[0]
}

/**
 * Setzt Layer für ein Building Element basierend auf Typ
 */
export function setLayerForElement(mesh: THREE.Mesh, element: BuildingElement): void {
  if (element.type === 'wall') {
    mesh.layers.set(RAYCAST_LAYERS.WALLS)
  } else if (element.type === 'roof') {
    mesh.layers.set(RAYCAST_LAYERS.ROOFS)
  } else {
    // Default: Ground layer
    mesh.layers.set(RAYCAST_LAYERS.GROUND)
  }
}

