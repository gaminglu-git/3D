import { Wall, Opening, Window, Door } from '../types/building'
import { Position3D } from '../types/geometry'

/**
 * 2D Bounds for opening validation
 */
export interface Bounds2D {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

/**
 * Get the 2D bounds of an opening in wall-local coordinates
 *
 * @param opening - Window or Door opening
 * @returns 2D bounds (X = along wall, Y = height)
 */
export function getOpeningBounds(opening: Opening): Bounds2D {
  const halfWidth = opening.width / 2

  return {
    minX: opening.position.x - halfWidth,
    maxX: opening.position.x + halfWidth,
    minY: opening.position.y,
    maxY: opening.position.y + opening.height,
  }
}

/**
 * Check if two openings overlap in 2D space (along wall)
 *
 * @param a - First opening
 * @param b - Second opening
 * @returns True if openings overlap
 */
export function doOpeningsOverlap(a: Opening, b: Opening): boolean {
  const boundsA = getOpeningBounds(a)
  const boundsB = getOpeningBounds(b)

  // Check for overlap in X direction (along wall)
  const xOverlap = boundsA.minX < boundsB.maxX && boundsA.maxX > boundsB.minX

  // Check for overlap in Y direction (height)
  const yOverlap = boundsA.minY < boundsB.maxY && boundsA.maxY > boundsB.minY

  return xOverlap && yOverlap
}

/**
 * Check if a new opening would overlap with existing openings in a wall
 *
 * @param wall - Wall element
 * @param newOpening - Opening to check
 * @param excludeId - Optional ID to exclude from check (for updates)
 * @returns True if there's an overlap
 */
export function checkOpeningOverlap(wall: Wall, newOpening: Opening, excludeId?: string): boolean {
  if (!wall.openings || wall.openings.length === 0) {
    return false
  }

  for (const existing of wall.openings) {
    // Skip if this is the same opening (during updates)
    if (excludeId && existing.id === excludeId) {
      continue
    }

    if (doOpeningsOverlap(newOpening, existing)) {
      return true
    }
  }

  return false
}

/**
 * Check if an opening fits within wall boundaries
 *
 * @param opening - Opening to check
 * @param wall - Wall element
 * @param margin - Safety margin from edges (default: 0.1m)
 * @returns True if opening fits within wall
 */
export function isOpeningWithinWallBounds(
  opening: Opening,
  wall: Wall,
  margin: number = 0.1
): boolean {
  const bounds = getOpeningBounds(opening)

  // Check horizontal bounds (along wall length)
  const fitsHorizontally = bounds.minX >= margin && bounds.maxX <= wall.length - margin

  // Check vertical bounds (wall height)
  const fitsVertically = bounds.minY >= margin && bounds.maxY <= wall.height - margin

  return fitsHorizontally && fitsVertically
}

/**
 * Validate opening placement
 *
 * @param wall - Wall element
 * @param opening - Opening to validate
 * @param excludeId - Optional ID to exclude from overlap check
 * @returns Validation result with details
 */
export interface OpeningValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export function validateOpeningPlacement(
  wall: Wall,
  opening: Opening,
  excludeId?: string
): OpeningValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check if opening fits within wall bounds
  if (!isOpeningWithinWallBounds(opening, wall)) {
    errors.push('Opening extends beyond wall boundaries')
  }

  // Check for overlaps with existing openings
  if (checkOpeningOverlap(wall, opening, excludeId)) {
    errors.push('Opening overlaps with existing opening')
  }

  // Additional validation: Check if opening is too large relative to wall
  const openingArea = opening.width * opening.height
  const wallArea = wall.length * wall.height
  const areaRatio = openingArea / wallArea

  if (areaRatio >= 0.8) {
    warnings.push('Opening is very large relative to wall (>80% of wall area)')
  }

  // Check minimum distances from edges
  const bounds = getOpeningBounds(opening)
  const edgeMargin = 0.2 // 20cm recommended margin

  if (bounds.minX < edgeMargin || bounds.maxX > wall.length - edgeMargin) {
    warnings.push('Opening is very close to wall edge')
  }

  if (bounds.minY < edgeMargin || bounds.maxY > wall.height - edgeMargin) {
    warnings.push('Opening is very close to wall top/bottom')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Find a valid position for an opening along a wall
 * Attempts to place opening at desired position, or finds nearest valid position
 *
 * @param wall - Wall element
 * @param opening - Opening to place
 * @param preferredX - Preferred X position along wall
 * @returns Valid position or null if no position found
 */
export function findValidOpeningPosition(
  wall: Wall,
  opening: Opening,
  preferredX: number
): Position3D | null {
  const margin = 0.1
  const halfWidth = opening.width / 2

  // Try preferred position first
  const testOpening = { ...opening, position: { ...opening.position, x: preferredX } }

  if (
    !checkOpeningOverlap(wall, testOpening) &&
    isOpeningWithinWallBounds(testOpening, wall, margin)
  ) {
    return { ...opening.position, x: preferredX }
  }

  // Try positions along the wall
  const step = 0.1 // 10cm steps
  const minX = halfWidth + margin
  const maxX = wall.length - halfWidth - margin

  // Try left of preferred position
  for (let x = preferredX - step; x >= minX; x -= step) {
    const candidate = { ...opening, position: { ...opening.position, x } }
    if (
      !checkOpeningOverlap(wall, candidate) &&
      isOpeningWithinWallBounds(candidate, wall, margin)
    ) {
      return { ...opening.position, x }
    }
  }

  // Try right of preferred position
  for (let x = preferredX + step; x <= maxX; x += step) {
    const candidate = { ...opening, position: { ...opening.position, x } }
    if (
      !checkOpeningOverlap(wall, candidate) &&
      isOpeningWithinWallBounds(candidate, wall, margin)
    ) {
      return { ...opening.position, x }
    }
  }

  return null // No valid position found
}
