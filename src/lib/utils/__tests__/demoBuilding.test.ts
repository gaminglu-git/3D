import { describe, it, expect } from 'vitest'
import { createDemoBuilding } from '../demoBuilding'
import { isWall, isDoor, isWindow } from '../../types/building'

describe('createDemoBuilding', () => {
  const building = createDemoBuilding()

  it('should create a building with a valid ID and name', () => {
    expect(building.id).toBeTypeOf('string')
    expect(building.name).toBe('Demo Haus')
  })

  it('should create a building with elements', () => {
    expect(building.elements).toBeInstanceOf(Array)
    expect(building.elements.length).toBeGreaterThan(0)
  })

  it('should include at least one floor and one roof', () => {
    const floors = building.elements.filter((e) => e.type === 'floor')
    const roofs = building.elements.filter((e) => e.type === 'roof')
    expect(floors.length).toBeGreaterThan(0)
    expect(roofs.length).toBeGreaterThan(0)
  })

  it('should include walls with openings', () => {
    const walls = building.elements.filter(isWall)
    expect(walls.length).toBeGreaterThan(0)

    const wallsWithOpenings = walls.filter((w) => w.openings.length > 0)
    expect(wallsWithOpenings.length).toBeGreaterThan(0)
  })

  it('should have doors and windows inside wall openings', () => {
    const walls = building.elements.filter(isWall)
    const openings = walls.flatMap((w) => w.openings)

    const doors = openings.filter(isDoor)
    const windows = openings.filter(isWindow)

    expect(doors.length).toBeGreaterThan(0)
    expect(windows.length).toBeGreaterThan(0)
  })

  it('should ensure all openings have a valid wallId', () => {
    const walls = building.elements.filter(isWall)
    const wallIds = new Set(walls.map((w) => w.id))

    const openings = walls.flatMap((w) => w.openings)
    openings.forEach((opening) => {
      expect(wallIds.has(opening.wallId)).toBe(true)
    })
  })

  it('should have valid positions and dimensions for all elements', () => {
    building.elements.forEach((element) => {
      expect(element.position).toBeDefined()
      expect(element.dimensions).toBeDefined()
      expect(element.dimensions.width).toBeGreaterThan(0)
      expect(element.dimensions.height).toBeGreaterThan(0)
      expect(element.dimensions.depth).toBeGreaterThan(0)
    })
  })
})





