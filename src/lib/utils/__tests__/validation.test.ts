import { describe, it, expect } from 'vitest'
import {
  getOpeningBounds,
  doOpeningsOverlap,
  checkOpeningOverlap,
  isOpeningWithinWallBounds,
  validateOpeningPlacement,
  findValidOpeningPosition,
} from '../validation'
import { Wall, Window, Door } from '@/lib/types/building'

describe('Validation Utils', () => {
  const createTestWall = (): Wall => ({
    id: 'test-wall',
    type: 'wall',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    floorLevel: 0,
    visible: true,
    locked: false,
    length: 10,
    height: 3,
    thickness: 0.3,
    materialId: 'brick',
    openings: [],
  })

  const createTestWindow = (x: number, y: number): Window => ({
    id: 'test-window',
    type: 'window',
    wallId: 'test-wall',
    position: { x, y, z: 0 },
    width: 1.2,
    height: 1.4,
    materialId: 'triple-glazing',
    frameThickness: 0.05,
    glazingLayers: 3,
    uValue: 0.7,
  })

  const createTestDoor = (x: number, y: number): Door => ({
    id: 'test-door',
    type: 'door',
    wallId: 'test-wall',
    position: { x, y, z: 0 },
    width: 0.9,
    height: 2.1,
    materialId: 'wood-door',
    swingDirection: 'left',
    uValue: 1.8,
  })

  describe('getOpeningBounds', () => {
    it('should calculate correct bounds for window', () => {
      const window = createTestWindow(5, 1)
      const bounds = getOpeningBounds(window)

      expect(bounds.minX).toBe(5 - 1.2 / 2)
      expect(bounds.maxX).toBe(5 + 1.2 / 2)
      expect(bounds.minY).toBe(1)
      expect(bounds.maxY).toBe(1 + 1.4)
    })

    it('should calculate correct bounds for door', () => {
      const door = createTestDoor(3, 0)
      const bounds = getOpeningBounds(door)

      expect(bounds.minX).toBe(3 - 0.9 / 2)
      expect(bounds.maxX).toBe(3 + 0.9 / 2)
      expect(bounds.minY).toBe(0)
      expect(bounds.maxY).toBe(2.1)
    })
  })

  describe('doOpeningsOverlap', () => {
    it('should detect horizontal overlap', () => {
      const window1 = createTestWindow(5, 1)
      const window2 = createTestWindow(5.5, 1) // Overlaps horizontally

      expect(doOpeningsOverlap(window1, window2)).toBe(true)
    })

    it('should detect vertical overlap', () => {
      const window1 = createTestWindow(5, 1)
      const window2 = createTestWindow(5, 1.5) // Overlaps vertically

      expect(doOpeningsOverlap(window1, window2)).toBe(true)
    })

    it('should not detect overlap when sufficiently apart horizontally', () => {
      const window1 = createTestWindow(3, 1)
      const window2 = createTestWindow(7, 1) // No overlap

      expect(doOpeningsOverlap(window1, window2)).toBe(false)
    })

    it('should not detect overlap when sufficiently apart vertically', () => {
      const window1 = createTestWindow(5, 0.5)
      const window2 = createTestWindow(5, 2.5) // No overlap

      expect(doOpeningsOverlap(window1, window2)).toBe(false)
    })

    it('should handle door and window overlap', () => {
      const door = createTestDoor(5, 0)
      const window = createTestWindow(5, 1) // Overlaps with door

      expect(doOpeningsOverlap(door, window)).toBe(true)
    })
  })

  describe('checkOpeningOverlap', () => {
    it('should detect overlap with existing openings', () => {
      const wall = createTestWall()
      wall.openings = [createTestWindow(5, 1)]

      const newWindow = createTestWindow(5.5, 1)

      expect(checkOpeningOverlap(wall, newWindow)).toBe(true)
    })

    it('should not detect overlap when no existing openings', () => {
      const wall = createTestWall()
      const newWindow = createTestWindow(5, 1)

      expect(checkOpeningOverlap(wall, newWindow)).toBe(false)
    })

    it('should exclude opening by ID when checking', () => {
      const wall = createTestWall()
      const existingWindow = createTestWindow(5, 1)
      existingWindow.id = 'existing'
      wall.openings = [existingWindow]

      const updatedWindow = createTestWindow(5.2, 1)
      updatedWindow.id = 'existing'

      // Should not detect overlap with itself
      expect(checkOpeningOverlap(wall, updatedWindow, 'existing')).toBe(false)
    })

    it('should detect overlap with multiple openings', () => {
      const wall = createTestWall()
      wall.openings = [createTestWindow(3, 1), createTestWindow(7, 1)]

      const newWindow = createTestWindow(7.5, 1) // Overlaps with second window

      expect(checkOpeningOverlap(wall, newWindow)).toBe(true)
    })
  })

  describe('isOpeningWithinWallBounds', () => {
    it('should validate opening within bounds', () => {
      const wall = createTestWall() // 10m long, 3m high
      const window = createTestWindow(5, 1) // Center, middle height

      expect(isOpeningWithinWallBounds(window, wall)).toBe(true)
    })

    it('should reject opening too far left', () => {
      const wall = createTestWall()
      const window = createTestWindow(0.5, 1) // Too close to left edge

      expect(isOpeningWithinWallBounds(window, wall)).toBe(false)
    })

    it('should reject opening too far right', () => {
      const wall = createTestWall()
      const window = createTestWindow(9.5, 1) // Too close to right edge

      expect(isOpeningWithinWallBounds(window, wall)).toBe(false)
    })

    it('should reject opening too high', () => {
      const wall = createTestWall()
      const window = createTestWindow(5, 2) // Top would be at 3.4m (wall is 3m)

      expect(isOpeningWithinWallBounds(window, wall)).toBe(false)
    })

    it('should respect custom margin', () => {
      const wall = createTestWall()
      const window = createTestWindow(0.8, 1) // 0.8m from edge

      expect(isOpeningWithinWallBounds(window, wall, 0.1)).toBe(true)
      expect(isOpeningWithinWallBounds(window, wall, 1.0)).toBe(false)
    })
  })

  describe('validateOpeningPlacement', () => {
    it('should return valid for proper placement', () => {
      const wall = createTestWall()
      const window = createTestWindow(5, 1)

      const result = validateOpeningPlacement(wall, window)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect out-of-bounds error', () => {
      const wall = createTestWall()
      const window = createTestWindow(0.3, 1) // Too close to edge

      const result = validateOpeningPlacement(wall, window)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Opening extends beyond wall boundaries')
    })

    it('should detect overlap error', () => {
      const wall = createTestWall()
      wall.openings = [createTestWindow(5, 1)]

      const newWindow = createTestWindow(5.5, 1) // Overlaps

      const result = validateOpeningPlacement(wall, newWindow)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Opening overlaps with existing opening')
    })

    it('should warn about large opening', () => {
      const wall = createTestWall() // 10m x 3m = 30m²
      const largeWindow = createTestWindow(5, 1)
      largeWindow.width = 9 // 9m wide
      largeWindow.height = 2.7 // 2.7m high -> 9 * 2.7 = 24.3m² > 80% of 30m²

      const result = validateOpeningPlacement(wall, largeWindow)

      expect(result.warnings.length).toBeGreaterThan(0)
      expect(result.warnings[0]).toContain('>80%')
    })

    it('should warn about edge proximity', () => {
      const wall = createTestWall()
      const window = createTestWindow(0.7, 1) // Close but within bounds

      const result = validateOpeningPlacement(wall, window)

      expect(result.warnings.length).toBeGreaterThan(0)
    })
  })

  describe('findValidOpeningPosition', () => {
    it('should return preferred position if valid', () => {
      const wall = createTestWall()
      const window = createTestWindow(5, 1)

      const position = findValidOpeningPosition(wall, window, 5)

      expect(position).not.toBeNull()
      expect(position?.x).toBe(5)
    })

    it('should find alternative position if preferred is invalid', () => {
      const wall = createTestWall()
      wall.openings = [createTestWindow(5, 1)]

      const newWindow = createTestWindow(5, 1) // Would overlap

      const position = findValidOpeningPosition(wall, newWindow, 5)

      expect(position).not.toBeNull()
      expect(position?.x).not.toBe(5) // Should be shifted
    })

    it('should return null if no valid position found', () => {
      const wall = createTestWall()
      // Fill wall with windows
      wall.openings = [
        createTestWindow(2, 1),
        createTestWindow(4, 1),
        createTestWindow(6, 1),
        createTestWindow(8, 1),
      ]

      const newWindow = createTestWindow(5, 1)
      newWindow.width = 3 // Very wide

      const position = findValidOpeningPosition(wall, newWindow, 5)

      expect(position).toBeNull()
    })

    it('should try positions to the left first', () => {
      const wall = createTestWall()
      wall.openings = [createTestWindow(6, 1)]

      const newWindow = createTestWindow(6.5, 1) // Overlaps

      const position = findValidOpeningPosition(wall, newWindow, 6.5)

      expect(position).not.toBeNull()
      // Should be shifted left to avoid overlap
      if (position) {
        expect(position.x).toBeLessThan(6)
      }
    })
  })
})
