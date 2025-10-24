import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { PhysicsService } from '../physicsService'
import { Building, Wall, Floor, Roof } from '../../types/building'

const mockWall: Wall = {
  id: 'wall-1',
  type: 'wall',
  position: { x: 2, y: 1.25, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  dimensions: { width: 4, height: 2.5, depth: 0.2 },
  floorLevel: 0,
  visible: true,
  locked: false,
  materialId: 'brick',
  openings: [],
}

const mockFloor: Floor = {
  id: 'floor-1',
  type: 'floor',
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  dimensions: { width: 10, height: 0.1, depth: 10 },
  floorLevel: 0,
  visible: true,
  locked: false,
  materialId: 'concrete-slab',
}

const mockRoof: Roof = {
  id: 'roof-1',
  type: 'roof',
  position: { x: 0, y: 2.5, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  dimensions: { width: 10, height: 0.2, depth: 10 },
  floorLevel: 0,
  visible: true,
  locked: false,
  roofType: 'flat',
  pitch: 0,
  materialId: 'roof-tiles',
}

describe('PhysicsService Integration', () => {
  let physicsService: PhysicsService

  beforeEach(async () => {
    physicsService = new PhysicsService()
    await physicsService.init()
  })

  afterEach(() => {
    physicsService.destroy()
  })

  it('should initialize correctly', () => {
    expect(physicsService).toBeDefined()
    // @ts-ignore
    expect(physicsService.world).toBeDefined()
  })

  it('should create a wall collider and add it to the world', () => {
    physicsService.syncWithBuilding([mockWall])
    // @ts-ignore
    expect(physicsService.colliderMap.size).toBe(1)
  })

  it('should return snap points from fixed rigid bodies', () => {
    physicsService.syncWithBuilding([mockWall])
    const snapPoints = physicsService.getSnapPoints()
    expect(snapPoints).toHaveLength(8)
  })

  it('should return empty snap points when no colliders exist', async () => {
    const emptyPhysicsService = new PhysicsService()
    await emptyPhysicsService.init()
    const snapPoints = emptyPhysicsService.getSnapPoints()
    expect(snapPoints).toHaveLength(0)
    emptyPhysicsService.destroy()
  })

  it('should create and remove joints correctly', () => {
    const wall1: Wall = { ...mockWall, id: 'wall-1' }
    const wall2: Wall = { ...mockWall, id: 'wall-2', position: { x: 6, y: 1.25, z: 0 } }
    physicsService.syncWithBuilding([wall1, wall2])
    const joint = physicsService.addJoint(wall1.id, wall2.id)
    expect(joint).toBeDefined()
    if (joint) {
      physicsService.removeJoint(joint)
    }
    // No direct way to check if joint is removed without exposing Rapier's internals
  })

  it('should handle multiple collider types (walls, floors, roofs)', () => {
    physicsService.syncWithBuilding([mockWall, mockFloor, mockRoof])
    // @ts-ignore
    expect(physicsService.colliderMap.size).toBe(3)
    expect(physicsService.colliderMap.has('wall-1')).toBe(true)
    expect(physicsService.colliderMap.has('floor-1')).toBe(true)
    expect(physicsService.colliderMap.has('roof-1')).toBe(true)
  })

  it('should synchronize colliderMap with building elements', () => {
    const wall1: Wall = { ...mockWall, id: 'wall-1' }
    physicsService.syncWithBuilding([wall1])
    // @ts-ignore
    expect(physicsService.colliderMap.size).toBe(1)

    const wall2: Wall = { ...mockWall, id: 'wall-2' }
    physicsService.syncWithBuilding([wall1, wall2])
    // @ts-ignore
    expect(physicsService.colliderMap.size).toBe(2)

    physicsService.syncWithBuilding([wall2])
    // @ts-ignore
    expect(physicsService.colliderMap.size).toBe(1)
    expect(physicsService.colliderMap.has('wall-1')).toBe(false)
    expect(physicsService.colliderMap.has('wall-2')).toBe(true)
  })

  it('should clean up physics world on destroy', () => {
    physicsService.syncWithBuilding([mockWall])
    // @ts-ignore
    expect(physicsService.colliderMap.size).toBe(1)
    expect(physicsService.world).not.toBeNull()
    
    physicsService.destroy()

    // @ts-ignore
    expect(physicsService.world).toBeNull()
    // @ts-ignore
    expect(physicsService.colliderMap.size).toBe(0)
  })

  it('should handle gravity settings', () => {
    physicsService.setGravity({ x: 0, y: -9.81, z: 0 })
    // @ts-ignore
    expect(physicsService.world.gravity.y).toBe(-9.81)
  })

  it('should handle body type changes', () => {
    const dynamicWall: Wall = { ...mockWall, locked: false }
    physicsService.syncWithBuilding([dynamicWall])
    const collider = physicsService.colliderMap.get(dynamicWall.id)
    const body = collider?.parent()
    expect(body?.isDynamic()).toBe(true)
  })

  it('should return debug render buffers', () => {
    physicsService.syncWithBuilding([mockWall])
    const { vertices, colors } = physicsService.getDebugRenderBuffers()
    expect(vertices.length).toBeGreaterThan(0)
    expect(colors.length).toBeGreaterThan(0)
  })

  it('should handle step simulation', () => {
    const dynamicWall: Wall = { ...mockWall, locked: false, position: { x: 0, y: 10, z: 0 } }
    physicsService.syncWithBuilding([dynamicWall])
    physicsService.step()
    const collider = physicsService.colliderMap.get(dynamicWall.id)
    const body = collider?.parent()
    expect(body?.translation().y).toBeLessThan(10)
  })
}) 