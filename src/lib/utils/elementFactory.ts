import { nanoid } from 'nanoid'
import { BuildingElement } from '../types/building'
import {
  DEFAULT_WALL,
  DEFAULT_ROOF,
  DEFAULT_WINDOW,
  DEFAULT_DOOR,
  ZERO_ROTATION,
} from '../constants/defaults'
import { PLACEMENT_CONFIG } from './placement'
import * as THREE from 'three'

/**
 * Context for element creation with snap information
 */
export interface ElementCreationContext {
  snapType?: 'wall-surface' | 'ground' | 'roof-elevation'
  targetWallId?: string
  normal?: THREE.Vector3
}

/**
 * Creates a building element from a library item
 * @param item Library item containing type and configuration
 * @param position 3D position where the element should be placed
 * @param context Optional context with snap information
 * @returns A properly typed BuildingElement
 */
export function createElementFromLibraryItem(
  item: any,
  position: THREE.Vector3,
  context?: ElementCreationContext
): BuildingElement | null {
  const baseElement = {
    id: nanoid(),
    position,
    rotation: ZERO_ROTATION,
    floorLevel: 0,
    visible: true,
    locked: false,
  }

  // Determine element type from item ID
  if (item.id.startsWith('wall')) {
    return {
      ...baseElement,
      type: 'wall',
      length: item.id.includes('load-bearing') ? DEFAULT_WALL.length : DEFAULT_WALL.length,
      height: DEFAULT_WALL.height,
      thickness: item.id.includes('load-bearing') ? 0.36 : DEFAULT_WALL.thickness,
      materialId: item.id.includes('load-bearing') ? 'concrete-wall' : DEFAULT_WALL.materialId,
      openings: [],
    } as any
  }

  if (item.id.startsWith('roof')) {
    const roofType = item.id.includes('gabled') ? 'gabled' : 'flat'
    const pitch = item.id.includes('gabled') ? 35 : DEFAULT_ROOF.pitch

    // Use provided height from context (already calculated) or fallback
    const finalY =
      context?.snapType === 'roof-elevation' ? position.y : PLACEMENT_CONFIG.ROOF_DEFAULT_HEIGHT

    return {
      ...baseElement,
      type: 'roof',
      position: { ...position, y: finalY },
      roofType,
      dimensions: { width: 5, height: 0.2, depth: 5 },
      pitch,
      materialId: DEFAULT_ROOF.materialId,
    } as any
  }

  if (item.id.startsWith('window')) {
    // Windows snapped to wall surface
    if (context?.snapType === 'wall-surface' && context.targetWallId) {
      return {
        id: nanoid(),
        type: 'window',
        wallId: context.targetWallId,
        position: {
          x: position.x,
          y: PLACEMENT_CONFIG.WINDOW_DEFAULT_HEIGHT,
          z: position.z,
        },
        width: DEFAULT_WINDOW.width,
        height: DEFAULT_WINDOW.height,
        materialId: DEFAULT_WINDOW.materialId,
        frameThickness: DEFAULT_WINDOW.frameThickness,
        glazingLayers: DEFAULT_WINDOW.glazingLayers,
        uValue: DEFAULT_WINDOW.uValue,
      } as any
    }
    // Without wall context, cannot place window
    console.warn('Window requires wall surface snap')
    return null
  }

  if (item.id.startsWith('door')) {
    // Doors snapped to wall surface
    if (context?.snapType === 'wall-surface' && context.targetWallId) {
      return {
        id: nanoid(),
        type: 'door',
        wallId: context.targetWallId,
        position: {
          x: position.x,
          y: PLACEMENT_CONFIG.DOOR_HEIGHT,
          z: position.z,
        },
        width: DEFAULT_DOOR.width,
        height: DEFAULT_DOOR.height,
        materialId: DEFAULT_DOOR.materialId,
        swingDirection: 'left' as const,
        uValue: DEFAULT_DOOR.uValue,
      } as any
    }
    // Without wall context, cannot place door
    console.warn('Door requires wall surface snap')
    return null
  }

  return null
}

/**
 * Get preview dimensions for a library item
 * Used for rendering the drag preview mesh
 */
export function getPreviewDimensions(item: any): { width: number; height: number; depth: number } {
  if (item.id.startsWith('wall')) {
    return {
      width: DEFAULT_WALL.length,
      height: DEFAULT_WALL.height,
      depth: item.id.includes('load-bearing') ? 0.36 : DEFAULT_WALL.thickness,
    }
  }

  if (item.id.startsWith('roof')) {
    return {
      width: 5,
      height: 0.5,
      depth: 5,
    }
  }

  // Default dimensions
  return {
    width: 1,
    height: 1,
    depth: 1,
  }
}
