import { Position3D } from '../types/geometry'
import * as THREE from 'three'
import { Building, BuildingElement } from '../types/building'

/**
 * Snap a value to the nearest grid point
 */
export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize
}

/**
 * Calculate distance between two 3D points
 */
export function distance3D(a: Position3D, b: Position3D): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const dz = b.z - a.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

/**
 * Calculate distance between two 2D points (XZ plane)
 */
export function distance2D(a: { x: number; z: number }, b: { x: number; z: number }): number {
  const dx = b.x - a.x
  const dz = b.z - a.z
  return Math.sqrt(dx * dx + dz * dz)
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Calculate start and end points of a wall considering its rotation
 */
export function calculateWallEndpoints(wall: {
  position: Position3D
  rotation: { x: number; y: number; z: number }
  length: number
}): { start: Position3D; end: Position3D } {
  const halfLength = wall.length / 2
  const angle = wall.rotation.y

  // Calculate endpoints relative to center position
  const dx = halfLength * Math.sin(angle)
  const dz = halfLength * Math.cos(angle)

  return {
    start: {
      x: wall.position.x - dx,
      y: wall.position.y,
      z: wall.position.z - dz,
    },
    end: {
      x: wall.position.x + dx,
      y: wall.position.y,
      z: wall.position.z + dz,
    },
  }
}

/**
 * Calculate distance from a point to a line segment
 */
export function distanceToLine(
  point: Position3D,
  lineStart: Position3D,
  lineEnd: Position3D
): number {
  const dx = lineEnd.x - lineStart.x
  const dz = lineEnd.z - lineStart.z
  const lengthSquared = dx * dx + dz * dz

  if (lengthSquared === 0) {
    // Line segment is a point
    return distance3D(point, lineStart)
  }

  // Calculate projection parameter
  const t = Math.max(
    0,
    Math.min(1, ((point.x - lineStart.x) * dx + (point.z - lineStart.z) * dz) / lengthSquared)
  )

  // Calculate closest point on line segment
  const closest: Position3D = {
    x: lineStart.x + t * dx,
    y: lineStart.y,
    z: lineStart.z + t * dz,
  }

  return distance3D(point, closest)
}

/**
 * Calculate angle between two vectors in radians
 */
export function getAngleBetweenVectors(v1: Position3D, v2: Position3D): number {
  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z)
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z)

  if (mag1 === 0 || mag2 === 0) return 0

  const cosAngle = dot / (mag1 * mag2)
  return Math.acos(Math.max(-1, Math.min(1, cosAngle)))
}

/**
 * Get axis-aligned bounding box for a building element
 */
export function getBoundingBox(element: {
  position: Position3D
  dimensions?: { width: number; height: number; depth: number }
}): {
  min: Position3D
  max: Position3D
} {
  const size = element.dimensions || { width: 1, height: 1, depth: 1 }

  return {
    min: {
      x: element.position.x - size.width / 2,
      y: element.position.y - size.height / 2,
      z: element.position.z - size.depth / 2,
    },
    max: {
      x: element.position.x + size.width / 2,
      y: element.position.y + size.height / 2,
      z: element.position.z + size.depth / 2,
    },
  }
}

/**
 * Check if three points are collinear (lie on the same line)
 */
export function arePointsCollinear(
  p1: Position3D,
  p2: Position3D,
  p3: Position3D,
  tolerance: number = 0.01
): boolean {
  // Use cross product to check collinearity
  const v1 = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z }
  const v2 = { x: p3.x - p1.x, y: p3.y - p1.y, z: p3.z - p1.z }

  // Cross product
  const cross = {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x,
  }

  const crossMagnitude = Math.sqrt(cross.x * cross.x + cross.y * cross.y + cross.z * cross.z)
  return crossMagnitude <= tolerance
}

/**
 * Normalize an angle to 0-2π range
 */
export function normalizeAngle(angle: number): number {
  const twoPi = 2 * Math.PI
  let normalized = angle % twoPi
  if (normalized < 0) {
    normalized += twoPi
  }
  return normalized
}

/**
 * Calculate angle between two points in 2D (XZ plane)
 * Returns angle in radians from -π to π
 */
export function angleBetweenPoints(
  p1: { x: number; z: number },
  p2: { x: number; z: number }
): number {
  return Math.atan2(p2.z - p1.z, p2.x - p1.x)
}

/**
 * Calculates the axis-aligned bounding box (AABB) of the entire building.
 * @param building The building object.
 * @returns A THREE.Box3 representing the bounding box.
 */
export function getBuildingBoundingBox(building: Building): THREE.Box3 {
  const boundingBox = new THREE.Box3()

  if (!building || !building.elements) {
    return boundingBox
  }

  building.elements.forEach((element) => {
    // Create a temporary mesh to calculate the bounding box for each element
    const geometry = new THREE.BoxGeometry(
      (element as any).length || 1,
      (element as any).height || 1,
      (element as any).thickness || 1,
    )
    const mesh = new THREE.Mesh(geometry)
    mesh.position.set(element.position.x, element.position.y + (element as any).height / 2, element.position.z)
    mesh.rotation.set(element.rotation.x, element.rotation.y, element.rotation.z)
    mesh.updateMatrixWorld()

    const elementBox = new THREE.Box3().setFromObject(mesh)
    boundingBox.union(elementBox)
  })

  return boundingBox
}
