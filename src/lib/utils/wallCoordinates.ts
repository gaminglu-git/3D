import * as THREE from 'three'
import { Wall, Opening } from '../types/building'
import { Position3D } from '../types/geometry'
import { calculateWallEndpoints } from './geometry'

/**
 * Convert global position to wall-relative local coordinates
 *
 * @param globalPosition - Position in world space
 * @param wall - Wall element
 * @returns Local position relative to wall's start point and orientation
 */
export function globalToLocalWallPosition(globalPosition: THREE.Vector3, wall: Wall): Position3D {
  const endpoints = calculateWallEndpoints(wall)

  // Create wall coordinate system
  const wallStart = new THREE.Vector3(endpoints.start.x, endpoints.start.y, endpoints.start.z)
  const wallEnd = new THREE.Vector3(endpoints.end.x, endpoints.end.y, endpoints.end.z)

  // Wall direction (local X axis)
  const wallDirection = new THREE.Vector3().subVectors(wallEnd, wallStart).normalize()

  // Wall normal (local Z axis) - perpendicular to wall
  const wallNormal = new THREE.Vector3(-wallDirection.z, 0, wallDirection.x).normalize()

  // Wall up (local Y axis)
  const wallUp = new THREE.Vector3(0, 1, 0)

  // Create transformation matrix from world to wall-local space
  const worldToLocal = new THREE.Matrix4()
  worldToLocal.makeBasis(wallDirection, wallUp, wallNormal)
  worldToLocal.setPosition(wallStart)
  worldToLocal.invert()

  // Transform global position to local space
  const localPos = globalPosition.clone().applyMatrix4(worldToLocal)

  return {
    x: localPos.x, // Distance along wall from start
    y: localPos.y, // Height above wall base
    z: localPos.z, // Distance from wall surface (should be ~0 for openings)
  }
}

/**
 * Convert wall-relative local coordinates to global position
 *
 * @param localPosition - Position relative to wall
 * @param wall - Wall element
 * @returns Global position in world space
 */
export function localToGlobalWallPosition(localPosition: Position3D, wall: Wall): THREE.Vector3 {
  const endpoints = calculateWallEndpoints(wall)

  // Create wall coordinate system
  const wallStart = new THREE.Vector3(endpoints.start.x, endpoints.start.y, endpoints.start.z)
  const wallEnd = new THREE.Vector3(endpoints.end.x, endpoints.end.y, endpoints.end.z)

  // Wall direction (local X axis)
  const wallDirection = new THREE.Vector3().subVectors(wallEnd, wallStart).normalize()

  // Wall normal (local Z axis) - perpendicular to wall
  const wallNormal = new THREE.Vector3(-wallDirection.z, 0, wallDirection.x).normalize()

  // Wall up (local Y axis)
  const wallUp = new THREE.Vector3(0, 1, 0)

  // Create transformation matrix from wall-local to world space
  const localToWorld = new THREE.Matrix4()
  localToWorld.makeBasis(wallDirection, wallUp, wallNormal)
  localToWorld.setPosition(wallStart)

  // Transform local position to world space
  const localVec = new THREE.Vector3(localPosition.x, localPosition.y, localPosition.z)
  const globalPos = localVec.applyMatrix4(localToWorld)

  return globalPos
}

/**
 * Calculate wall surface normal at a given position
 *
 * @param wall - Wall element
 * @param outward - If true, return outward normal; if false, return inward normal
 * @returns Normal vector
 */
export function getWallNormal(wall: Wall, outward: boolean = true): THREE.Vector3 {
  const endpoints = calculateWallEndpoints(wall)
  const wallDirection = new THREE.Vector3(
    endpoints.end.x - endpoints.start.x,
    0,
    endpoints.end.z - endpoints.start.z
  ).normalize()

  // Normal is perpendicular to wall direction
  const normal = new THREE.Vector3(-wallDirection.z, 0, wallDirection.x).normalize()

  return outward ? normal : normal.negate()
}

/**
 * Get the local bounds of a wall (for validating opening placement)
 *
 * @param wall - Wall element
 * @returns Bounds in local coordinates
 */
export function getWallLocalBounds(wall: Wall): {
  minX: number
  maxX: number
  minY: number
  maxY: number
  minZ: number
  maxZ: number
} {
  return {
    minX: 0,
    maxX: wall.length,
    minY: 0,
    maxY: wall.height,
    minZ: -wall.thickness / 2,
    maxZ: wall.thickness / 2,
  }
}

/**
 * Snap a wall-local X coordinate to a grid along the wall
 * Respects minimum margins from wall ends
 *
 * @param wallLocalX - X position along wall (0 = start, wall.length = end)
 * @param wallLength - Total length of the wall
 * @param openingWidth - Width of the opening to place
 * @param gridSize - Grid spacing (default 0.5m)
 * @returns Snapped X coordinate that respects margins
 */
export function snapToWallGrid(
  wallLocalX: number,
  wallLength: number,
  openingWidth: number,
  gridSize: number = 0.5
): number {
  // Minimum margin from wall ends (for structural integrity)
  const minMargin = 0.2
  const halfWidth = openingWidth / 2

  // Calculate valid range (accounting for opening width)
  const minX = minMargin + halfWidth
  const maxX = wallLength - minMargin - halfWidth

  // Snap to grid
  const snapped = Math.round(wallLocalX / gridSize) * gridSize

  // Clamp to valid range
  return Math.max(minX, Math.min(maxX, snapped))
}

/**
 * Check if an opening would overlap with other openings on the wall
 *
 * @param wall - Wall element
 * @param newOpening - Opening to check
 * @param minSpacing - Minimum spacing between openings (default 0.3m)
 * @returns true if valid (no overlap), false if invalid (overlaps)
 */
export function validateOpeningSpacing(
  wall: Wall,
  newOpening: { position: Position3D; width: number; height: number },
  minSpacing: number = 0.3
): { valid: boolean; conflictingOpenings: Opening[] } {
  const conflictingOpenings: Opening[] = []

  for (const existingOpening of wall.openings || []) {
    // Check horizontal overlap (along wall)
    const newLeft = newOpening.position.x - newOpening.width / 2
    const newRight = newOpening.position.x + newOpening.width / 2
    const existingLeft = existingOpening.position.x - existingOpening.width / 2
    const existingRight = existingOpening.position.x + existingOpening.width / 2

    const horizontalOverlap =
      (newLeft >= existingLeft - minSpacing && newLeft <= existingRight + minSpacing) ||
      (newRight >= existingLeft - minSpacing && newRight <= existingRight + minSpacing) ||
      (existingLeft >= newLeft - minSpacing && existingLeft <= newRight + minSpacing)

    if (!horizontalOverlap) continue

    // Check vertical overlap (height)
    const newBottom = newOpening.position.y
    const newTop = newOpening.position.y + newOpening.height
    const existingBottom = existingOpening.position.y
    const existingTop = existingOpening.position.y + existingOpening.height

    const verticalOverlap =
      (newBottom >= existingBottom - minSpacing && newBottom <= existingTop + minSpacing) ||
      (newTop >= existingBottom - minSpacing && newTop <= existingTop + minSpacing) ||
      (existingBottom >= newBottom - minSpacing && existingBottom <= newTop + minSpacing)

    if (verticalOverlap) {
      conflictingOpenings.push(existingOpening)
    }
  }

  return {
    valid: conflictingOpenings.length === 0,
    conflictingOpenings,
  }
}
