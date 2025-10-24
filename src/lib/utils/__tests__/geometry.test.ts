import { describe, it, expect } from 'vitest'
import { 
  snapToGrid, 
  distance3D, 
  distance2D, 
  lerp, 
  clamp, 
  calculateWallEndpoints,
  distanceToLine,
  getAngleBetweenVectors,
  getBoundingBox,
  arePointsCollinear,
  normalizeAngle,
  angleBetweenPoints,
  getBuildingBoundingBox
} from '../geometry'
import { Wall } from '@/lib/types/building'
import * as THREE from 'three'

describe('Geometry Utilities', () => {
  describe('snapToGrid', () => {
    it('should snap values to the nearest grid point', () => {
      expect(snapToGrid(0.3, 0.5)).toBe(0.5)
      expect(snapToGrid(0.7, 0.5)).toBe(0.5)
      expect(snapToGrid(1.0, 0.5)).toBe(1.0)
      expect(snapToGrid(1.2, 0.5)).toBe(1.0)
      expect(snapToGrid(1.3, 0.5)).toBe(1.5)
    })

    it('should handle negative values', () => {
      expect(snapToGrid(-0.3, 0.5)).toBe(-0.5)
      expect(snapToGrid(-0.7, 0.5)).toBe(-0.5)
      expect(snapToGrid(-1.2, 0.5)).toBe(-1.0)
    })

    it('should handle zero', () => {
      expect(snapToGrid(0, 0.5)).toBe(0)
    })
  })

  describe('distance3D', () => {
    it('should calculate correct 3D distances', () => {
      const point1 = { x: 0, y: 0, z: 0 }
      const point2 = { x: 3, y: 4, z: 0 }
      
      expect(distance3D(point1, point2)).toBe(5)
    })

    it('should handle identical points', () => {
      const point = { x: 1, y: 2, z: 3 }
      expect(distance3D(point, point)).toBe(0)
    })

    it('should handle negative coordinates', () => {
      const point1 = { x: -1, y: -1, z: -1 }
      const point2 = { x: 1, y: 1, z: 1 }
      
      expect(distance3D(point1, point2)).toBeCloseTo(Math.sqrt(12), 5)
    })
  })

  describe('distance2D', () => {
    it('should calculate correct 2D distances', () => {
      const point1 = { x: 0, z: 0 }
      const point2 = { x: 3, z: 4 }
      
      expect(distance2D(point1, point2)).toBe(5)
    })

    it('should handle identical points', () => {
      const point = { x: 1, z: 2 }
      expect(distance2D(point, point)).toBe(0)
    })
  })

  describe('lerp', () => {
    it('should interpolate between values correctly', () => {
      expect(lerp(0, 10, 0.5)).toBe(5)
      expect(lerp(0, 10, 0)).toBe(0)
      expect(lerp(0, 10, 1)).toBe(10)
      expect(lerp(5, 15, 0.2)).toBe(7)
    })

    it('should handle negative values', () => {
      expect(lerp(-10, 10, 0.5)).toBe(0)
      expect(lerp(-5, 5, 0.8)).toBe(3)
    })
  })

  describe('clamp', () => {
    it('should clamp values within bounds', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(15, 0, 10)).toBe(10)
    })

    it('should handle edge cases', () => {
      expect(clamp(0, 0, 10)).toBe(0)
      expect(clamp(10, 0, 10)).toBe(10)
    })
  })

  describe('calculateWallEndpoints', () => {
    it('should calculate endpoints for wall with zero rotation', () => {
      const wall = {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        length: 10
      }

      const endpoints = calculateWallEndpoints(wall)
      
      // For zero rotation, sin(0) = 0, cos(0) = 1
      // So dx = 0, dz = 5
      expect(endpoints.start.x).toBeCloseTo(0, 5)
      expect(endpoints.start.z).toBeCloseTo(-5, 5)
      expect(endpoints.end.x).toBeCloseTo(0, 5)
      expect(endpoints.end.z).toBeCloseTo(5, 5)
    })

    it('should calculate endpoints for wall with 90-degree rotation', () => {
      const wall = {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        length: 10
      }

      const endpoints = calculateWallEndpoints(wall)
      
      // For 90-degree rotation, sin(π/2) = 1, cos(π/2) = 0
      // So dx = 5, dz = 0
      expect(endpoints.start.x).toBeCloseTo(-5, 5)
      expect(endpoints.start.z).toBeCloseTo(0, 5)
      expect(endpoints.end.x).toBeCloseTo(5, 5)
      expect(endpoints.end.z).toBeCloseTo(0, 5)
    })

    it('should calculate endpoints for wall with arbitrary rotation', () => {
      const wall = {
        position: { x: 1, y: 2, z: 3 },
        rotation: { x: 0, y: Math.PI / 4, z: 0 },
        length: 6
      }

      const endpoints = calculateWallEndpoints(wall)
      
      // For 45-degree rotation, endpoints should be offset by ±3√2/2 in both x and z
      const offset = 3 * Math.sqrt(2) / 2
      
      expect(endpoints.start.x).toBeCloseTo(1 - offset, 5)
      expect(endpoints.start.z).toBeCloseTo(3 - offset, 5)
      expect(endpoints.end.x).toBeCloseTo(1 + offset, 5)
      expect(endpoints.end.z).toBeCloseTo(3 + offset, 5)
    })

    it('should preserve y-coordinate', () => {
      const wall = {
        position: { x: 0, y: 5, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        length: 10
      }

      const endpoints = calculateWallEndpoints(wall)
      
      expect(endpoints.start.y).toBe(5)
      expect(endpoints.end.y).toBe(5)
    })
  })

  describe('distanceToLine', () => {
    it('should calculate distance to line segment', () => {
      const point = { x: 0, y: 0, z: 1 }
      const lineStart = { x: 0, y: 0, z: 0 }
      const lineEnd = { x: 0, y: 0, z: 2 }

      expect(distanceToLine(point, lineStart, lineEnd)).toBeCloseTo(0, 5)
    })

    it('should calculate distance to perpendicular point', () => {
      const point = { x: 1, y: 0, z: 1 }
      const lineStart = { x: 0, y: 0, z: 0 }
      const lineEnd = { x: 0, y: 0, z: 2 }

      expect(distanceToLine(point, lineStart, lineEnd)).toBeCloseTo(1, 5)
    })

    it('should handle line segment as a point', () => {
      const point = { x: 1, y: 0, z: 1 }
      const lineStart = { x: 0, y: 0, z: 0 }
      const lineEnd = { x: 0, y: 0, z: 0 }

      expect(distanceToLine(point, lineStart, lineEnd)).toBeCloseTo(Math.sqrt(2), 5)
    })
  })

  describe('getAngleBetweenVectors', () => {
    it('should calculate angle between vectors', () => {
      const v1 = { x: 1, y: 0, z: 0 }
      const v2 = { x: 0, y: 1, z: 0 }

      expect(getAngleBetweenVectors(v1, v2)).toBeCloseTo(Math.PI / 2, 5)
    })

    it('should handle parallel vectors', () => {
      const v1 = { x: 1, y: 0, z: 0 }
      const v2 = { x: 2, y: 0, z: 0 }

      expect(getAngleBetweenVectors(v1, v2)).toBeCloseTo(0, 5)
    })

    it('should handle opposite vectors', () => {
      const v1 = { x: 1, y: 0, z: 0 }
      const v2 = { x: -1, y: 0, z: 0 }

      expect(getAngleBetweenVectors(v1, v2)).toBeCloseTo(Math.PI, 5)
    })

    it('should handle zero vectors', () => {
      const v1 = { x: 0, y: 0, z: 0 }
      const v2 = { x: 1, y: 0, z: 0 }

      expect(getAngleBetweenVectors(v1, v2)).toBe(0)
    })
  })

  describe('getBoundingBox', () => {
    it('should calculate bounding box for element', () => {
      const element = {
        position: { x: 0, y: 0, z: 0 },
        dimensions: { width: 10, height: 5, depth: 3 }
      }

      const bbox = getBoundingBox(element)

      expect(bbox.min.x).toBe(-5)
      expect(bbox.min.y).toBe(-2.5)
      expect(bbox.min.z).toBe(-1.5)
      expect(bbox.max.x).toBe(5)
      expect(bbox.max.y).toBe(2.5)
      expect(bbox.max.z).toBe(1.5)
    })

    it('should use default dimensions when not provided', () => {
      const element = {
        position: { x: 1, y: 2, z: 3 }
      }

      const bbox = getBoundingBox(element)

      expect(bbox.min.x).toBe(0.5)
      expect(bbox.min.y).toBe(1.5)
      expect(bbox.min.z).toBe(2.5)
      expect(bbox.max.x).toBe(1.5)
      expect(bbox.max.y).toBe(2.5)
      expect(bbox.max.z).toBe(3.5)
    })
  })

  describe('arePointsCollinear', () => {
    it('should detect collinear points', () => {
      const p1 = { x: 0, y: 0, z: 0 }
      const p2 = { x: 1, y: 0, z: 0 }
      const p3 = { x: 2, y: 0, z: 0 }

      expect(arePointsCollinear(p1, p2, p3)).toBe(true)
    })

    it('should detect non-collinear points', () => {
      const p1 = { x: 0, y: 0, z: 0 }
      const p2 = { x: 1, y: 0, z: 0 }
      const p3 = { x: 0, y: 1, z: 0 }

      expect(arePointsCollinear(p1, p2, p3)).toBe(false)
    })

    it('should handle identical points', () => {
      const p1 = { x: 1, y: 1, z: 1 }
      const p2 = { x: 1, y: 1, z: 1 }
      const p3 = { x: 1, y: 1, z: 1 }

      expect(arePointsCollinear(p1, p2, p3)).toBe(true)
    })
  })

  describe('normalizeAngle', () => {
    it('should normalize angles to 0-2π range', () => {
      expect(normalizeAngle(0)).toBe(0)
      expect(normalizeAngle(Math.PI)).toBeCloseTo(Math.PI, 5)
      expect(normalizeAngle(2 * Math.PI)).toBeCloseTo(0, 5)
      expect(normalizeAngle(-Math.PI)).toBeCloseTo(Math.PI, 5)
      expect(normalizeAngle(3 * Math.PI)).toBeCloseTo(Math.PI, 5)
    })
  })

  describe('angleBetweenPoints', () => {
    it('should calculate angle between points', () => {
      const p1 = { x: 0, z: 0 }
      const p2 = { x: 1, z: 0 }

      expect(angleBetweenPoints(p1, p2)).toBeCloseTo(0, 5)
    })

    it('should handle 90-degree angles', () => {
      const p1 = { x: 0, z: 0 }
      const p2 = { x: 0, z: 1 }

      expect(angleBetweenPoints(p1, p2)).toBeCloseTo(Math.PI / 2, 5)
    })

    it('should handle negative angles', () => {
      const p1 = { x: 0, z: 0 }
      const p2 = { x: 0, z: -1 }

      expect(angleBetweenPoints(p1, p2)).toBeCloseTo(-Math.PI / 2, 5)
    })
  })

  describe('getBuildingBoundingBox', () => {
    it('should calculate bounding box for building with walls', () => {
    const wall: Wall = {
      id: 'wall-1',
      type: 'wall',
      position: { x: 0, y: 1, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      dimensions: { width: 10, height: 2.5, depth: 0.2 },
      floorLevel: 0,
      visible: true,
      locked: false,
      length: 10,
      height: 2.5,
      thickness: 0.2,
      materialId: 'brick',
      openings: [],
    }

      const building = {
        id: 'test-building',
        name: 'Test Building',
        elements: [wall],
        floors: [],
        metadata: {
          created: new Date(),
          modified: new Date(),
          totalArea: 0,
          totalVolume: 0,
        },
      }

      const bbox = getBuildingBoundingBox(building)

      expect(bbox.min.x).toBeLessThan(0)
      expect(bbox.max.x).toBeGreaterThan(0)
      expect(bbox.min.y).toBeLessThanOrEqual(1)
      expect(bbox.max.y).toBeGreaterThan(1)
    })

    it('should handle empty building', () => {
      const building = {
        id: 'test-building',
        name: 'Test Building',
        elements: [],
        floors: [],
        metadata: {
          created: new Date(),
          modified: new Date(),
          totalArea: 0,
          totalVolume: 0,
        },
      }

      const bbox = getBuildingBoundingBox(building)

      expect(bbox.min.x).toBe(Infinity)
      expect(bbox.max.x).toBe(-Infinity)
    })
  })
})