import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useBuildingStore } from '../buildingStore'
import { BuildingElement, Wall } from '../../types/building'

vi.mock('../buildingStore', async () => {
  const actual = await vi.importActual('../buildingStore')
  return {
    ...actual,
    useBuildingStore: vi.fn(actual.useBuildingStore),
  }
})

describe('Building Store', () => {
  beforeEach(() => {
    const state = useBuildingStore.getState()
    useBuildingStore.setState({
      ...state,
      building: null,
      history: { past: [], future: [] },
    })
  })

  describe('initBuilding', () => {
    it('should initialize new building with correct structure', () => {
      useBuildingStore.getState().initBuilding('New Building')
      const building = useBuildingStore.getState().building
      expect(building).toBeDefined()
      expect(building?.id).toBeDefined()
      expect(building?.name).toBe('New Building')
    })

    it('should add building to history', () => {
      useBuildingStore.getState().initBuilding('New Building')
      const history = useBuildingStore.getState().history
      expect(history.past).toHaveLength(1)
    })
  })

  describe('addElement', () => {
    it('should add an element', () => {
      useBuildingStore.getState().initBuilding()
      const wall: Wall = {
        id: 'test-wall',
        type: 'wall',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        dimensions: { width: 5, height: 2.5, depth: 0.2 },
        floorLevel: 0,
        visible: true,
        locked: false,
        materialId: 'brick',
        openings: [],
      }
      useBuildingStore.getState().addElement(wall)
      const building = useBuildingStore.getState().building
      expect(building?.elements).toHaveLength(1)
    })
  })

  describe('undo/redo', () => {
    it('should undo and redo an action', () => {
      useBuildingStore.getState().initBuilding('New Building')
      const wall: Wall = {
        id: 'test-wall',
        type: 'wall',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        dimensions: { width: 5, height: 2.5, depth: 0.2 },
        floorLevel: 0,
        visible: true,
        locked: false,
        materialId: 'brick',
        openings: [],
      }
      useBuildingStore.getState().addElement(wall)
      expect(useBuildingStore.getState().building?.elements).toHaveLength(1)
      useBuildingStore.getState().undo()
      expect(useBuildingStore.getState().building?.elements).toHaveLength(0)
      useBuildingStore.getState().redo()
      expect(useBuildingStore.getState().building?.elements).toHaveLength(1)
    })
  })
})
