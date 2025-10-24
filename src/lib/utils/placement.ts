import { Wall } from '../types/building'
import { Position3D } from '../types/geometry'
import { calculateWallEndpoints, distanceToLine, distance3D } from './geometry'
import * as THREE from 'three'

/**
 * Configuration for placement behavior
 */
export const PLACEMENT_CONFIG = {
  WINDOW_DEFAULT_HEIGHT: 1.0, // m über Boden
  DOOR_HEIGHT: 0, // Boden
  ROOF_OFFSET: 0.1, // m über höchster Wand
  ROOF_DEFAULT_HEIGHT: 3.0, // Fallback ohne Wände
  WALL_SNAP_TOLERANCE: 0.1, // m
  ROOF_SEARCH_RADIUS: 5.0, // m für Wand-Suche
} as const

/**
 * Berechne Dach-Platzierungshöhe über Wänden
 */
export function calculateRoofHeight(
  position: { x: number; z: number },
  walls: Wall[],
  searchRadius: number = PLACEMENT_CONFIG.ROOF_SEARCH_RADIUS
): number {
  let maxHeight = 0

  for (const wall of walls) {
    const endpoints = calculateWallEndpoints(wall)
    const distance = distanceToLine(
      { x: position.x, y: 0, z: position.z },
      endpoints.start,
      endpoints.end
    )

    if (distance <= searchRadius) {
      maxHeight = Math.max(maxHeight, wall.height)
    }
  }

  return maxHeight > 0
    ? maxHeight + PLACEMENT_CONFIG.ROOF_OFFSET
    : PLACEMENT_CONFIG.ROOF_DEFAULT_HEIGHT
}

/**
 * Prüfe ob Position innerhalb Wand-Bounds liegt
 */
export function isPositionOnWall(
  position: THREE.Vector3,
  wall: Wall,
  tolerance: number = PLACEMENT_CONFIG.WALL_SNAP_TOLERANCE
): boolean {
  const endpoints = calculateWallEndpoints(wall)
  const wallLength = distance3D(endpoints.start, endpoints.end)

  // Projiziere Position auf Wand-Linie
  const projection = projectPointOnLine(
    { x: position.x, y: position.y, z: position.z },
    endpoints.start,
    endpoints.end
  )
  const distanceFromLine = distance3D({ x: position.x, y: position.y, z: position.z }, projection)

  const distToStart = distance3D(projection, endpoints.start)
  const distToEnd = distance3D(projection, endpoints.end)

  return (
    distanceFromLine <= wall.thickness / 2 + tolerance &&
    distToStart <= wallLength &&
    distToEnd <= wallLength
  )
}

/**
 * Projiziere einen Punkt auf eine Linie (3D)
 */
function projectPointOnLine(
  point: Position3D,
  lineStart: Position3D,
  lineEnd: Position3D
): Position3D {
  const dx = lineEnd.x - lineStart.x
  const dy = lineEnd.y - lineStart.y
  const dz = lineEnd.z - lineStart.z
  const lengthSquared = dx * dx + dy * dy + dz * dz

  if (lengthSquared === 0) {
    return lineStart
  }

  // Calculate projection parameter
  const t = Math.max(
    0,
    Math.min(
      1,
      ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy + (point.z - lineStart.z) * dz) /
        lengthSquared
    )
  )

  return {
    x: lineStart.x + t * dx,
    y: lineStart.y + t * dy,
    z: lineStart.z + t * dz,
  }
}

/**
 * Finde nächste Wand an gegebener Position
 */
export function findNearestWall(
  position: Position3D,
  walls: Wall[],
  maxDistance: number = 1.0
): Wall | null {
  let nearestWall: Wall | null = null
  let minDistance = maxDistance

  for (const wall of walls) {
    const endpoints = calculateWallEndpoints(wall)
    const distance = distanceToLine(position, endpoints.start, endpoints.end)

    if (distance < minDistance) {
      minDistance = distance
      nearestWall = wall
    }
  }

  return nearestWall
}

/**
 * Berechne Position auf Wandoberfläche mit Offset
 */
export function calculateWallSurfacePosition(
  intersectionPoint: THREE.Vector3,
  normal: THREE.Vector3,
  offset: number = 0.01
): THREE.Vector3 {
  return intersectionPoint.clone().add(normal.clone().multiplyScalar(offset))
}

/**
 * Prüfe ob Fenster/Tür innerhalb Wandgrenzen passt
 */
export function isOpeningWithinBounds(
  position: Position3D,
  openingWidth: number,
  openingHeight: number,
  wall: Wall
): boolean {
  const endpoints = calculateWallEndpoints(wall)
  const wallLength = distance3D(endpoints.start, endpoints.end)

  // Prüfe ob Öffnung in Wandlänge passt
  const projection = projectPointOnLine(position, endpoints.start, endpoints.end)
  const distToStart = distance3D(projection, endpoints.start)
  const distToEnd = distance3D(projection, endpoints.end)

  const fitsInLength = distToStart >= openingWidth / 2 && distToEnd >= openingWidth / 2

  // Prüfe ob Öffnung in Wandhöhe passt
  const fitsInHeight = position.y + openingHeight <= wall.height

  return fitsInLength && fitsInHeight
}

/**
 * Berechne optimale Höhe für Fenster basierend auf Typ
 */
export function calculateWindowHeight(wall: Wall, windowHeight: number): number {
  const defaultHeight = PLACEMENT_CONFIG.WINDOW_DEFAULT_HEIGHT

  // Stelle sicher, dass Fenster in Wand passt
  if (defaultHeight + windowHeight > wall.height) {
    // Zentriere Fenster vertikal in Wand
    return (wall.height - windowHeight) / 2
  }

  return defaultHeight
}
