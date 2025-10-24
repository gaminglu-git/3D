import { MaterialLayer } from './materials'
import { Position3D, Dimensions, Rotation } from './geometry'

export type ElementType = 'wall' | 'floor' | 'roof' | 'door' | 'window'

export interface BuildingElement {
  id: string
  type: ElementType
  position: Position3D
  rotation: Rotation
  dimensions: Dimensions // Added dimensions to the base interface
  floorLevel: number
  visible: boolean
  locked: boolean
  materialId: string
  connections?: string[] // IDs of connected elements
  metadata?: Record<string, unknown>
}

/**
 * Represents a connection between two building elements
 */
export interface ElementConnection {
  elementAId: string
  elementBId: string
  connectionType: 'endpoint' | 'intersection' | 'adjacent'
  position: Position3D
}

/**
 * Snap point for snapping functionality
 */
export interface SnapPoint {
  position: Position3D
  type: 'wall-endpoint' | 'wall-midpoint' | 'grid' | 'angle-guide'
  elementId?: string
  normal?: Position3D
  priority: number
}

export type ConstraintType = 'distance' | 'alignment' | 'length_ratio'

export interface BaseConstraint {
  id: string
  type: ConstraintType
  elementIds: string[]
  enabled: boolean
}

export interface DistanceConstraint extends BaseConstraint {
  type: 'distance'
  distance: number
}

export interface AlignmentConstraint extends BaseConstraint {
  type: 'alignment'
  alignmentType: 'parallel' | 'perpendicular' | 'collinear'
}

export interface LengthRatioConstraint extends BaseConstraint {
  type: 'length_ratio'
  ratio: number // e.g., 1.0 for equal length
}

export type Constraint = DistanceConstraint | AlignmentConstraint | LengthRatioConstraint

export interface WallElement extends BuildingElement {
  type: 'wall'
  openings: Opening[]
}

export interface FloorElement extends BuildingElement {
  type: 'floor'
}

export type RoofType = 'flat' | 'gabled' | 'hipped' | 'shed'

export interface RoofElement extends BuildingElement {
  type: 'roof'
  roofType: RoofType
  pitch: number // degrees for sloped roofs
  overhang?: number // m
}

export type StructuralElement = WallElement | FloorElement | RoofElement;

export type OpeningType = 'window' | 'door'

export interface Opening extends BuildingElement {
  id: string
  type: OpeningType
  wallId: string
  position: Position3D // Relative to wall
  width: number
  height: number
  materialId: string
}

export interface Window extends Opening {
  type: 'window'
  frameThickness: number
  glazingLayers: number
  uValue: number
}

export interface Door extends Opening {
  type: 'door'
  swingDirection: 'left' | 'right' | 'double'
  uValue: number
}

export interface Building {
  id: string
  name: string
  elements: BuildingElement[]
  constraints?: Constraint[]
  metadata: BuildingMetadata
}

export interface BuildingMetadata {
  created: Date
  modified: Date
  totalArea: number // m²
  totalVolume: number // m³
  heatedArea?: number // m²
  averageUValue?: number // W/(m²K)
}

// Helper type guards
export function isWall(element: BuildingElement): element is WallElement {
  return element.type === 'wall'
}

export function isFloorElement(element: BuildingElement): element is FloorElement {
  return element.type === 'floor'
}

export function isRoofElement(element: BuildingElement): element is RoofElement {
  return element.type === 'roof'
}

export function isWindow(
  opening: Opening | BuildingElement,
): opening is Window {
  return opening.type === 'window'
}

export function isDoor(
  opening: Opening | BuildingElement,
): opening is Door {
  return opening.type === 'door'
}
