import { Position3D, Rotation } from '../types/geometry'

/**
 * Default values for building elements
 */

export const DEFAULT_WALL = {
  height: 2.5, // m
  thickness: 0.24, // m
  length: 4.0, // m
  materialId: 'brick',
} as const

export const DEFAULT_FLOOR = {
  height: 2.8, // m - Floor to ceiling height
  materialId: 'concrete-slab',
} as const

export const DEFAULT_ROOF = {
  pitch: 35, // degrees
  overhang: 0.5, // m
  materialId: 'roof-tiles',
} as const

export const DEFAULT_WINDOW = {
  width: 1.2, // m
  height: 1.4, // m
  frameThickness: 0.08, // m
  glazingLayers: 2,
  uValue: 1.1, // W/(m²K)
  materialId: 'double-glazing',
} as const

export const DEFAULT_DOOR = {
  width: 0.9, // m
  height: 2.1, // m
  uValue: 1.8, // W/(m²K)
  materialId: 'wood-door',
} as const

export const GRID_SIZE = 0.1 // m - Snap grid size
export const GRID_DIVISIONS = 100 // Number of grid divisions visible

export const CAMERA_DEFAULTS = {
  position: [3, 3, 3] as [number, number, number],
  fov: 50,
  near: 0.1,
  far: 1000,
} as const

export const ZERO_POSITION: Position3D = { x: 0, y: 0, z: 0 }
export const ZERO_ROTATION: Rotation = { x: 0, y: 0, z: 0 }

export const MIN_WALL_LENGTH = 0.5 // m
export const MAX_WALL_LENGTH = 50 // m
export const MIN_WALL_HEIGHT = 2.0 // m
export const MAX_WALL_HEIGHT = 6.0 // m
export const MIN_WALL_THICKNESS = 0.1 // m
export const MAX_WALL_THICKNESS = 1.0 // m
