import { describe, it, expect, beforeEach } from 'vitest'
import { useBuildingStore } from '../buildingStore'
import { DEFAULT_MATERIALS } from '@/lib/constants/materials'
import { Material } from '@/lib/types/materials'

describe('BuildingStore Material System', () => {
  beforeEach(() => {
    // Reset the store for each test
    useBuildingStore.setState({
      materials: {},
      building: null,
      isInitialized: false,
    })
  })

  it('should load materials correctly', () => {
    const materialsMap = DEFAULT_MATERIALS.reduce((acc, material) => {
      acc[material.id] = material
      return acc
    }, {} as Record<string, Material>)

    useBuildingStore.getState().loadMaterials(materialsMap)

    const state = useBuildingStore.getState()
    expect(Object.keys(state.materials)).toHaveLength(DEFAULT_MATERIALS.length)
    
    // Check specific materials
    expect(state.materials['brick']).toBeDefined()
    expect(state.materials['concrete']).toBeDefined()
    expect(state.materials['wood-frame']).toBeDefined()
  })

  it('should get material by name', () => {
    const materialsMap = DEFAULT_MATERIALS.reduce((acc, material) => {
      acc[material.id] = material
      return acc
    }, {} as Record<string, Material>)

    useBuildingStore.getState().loadMaterials(materialsMap)

    const brickMaterial = useBuildingStore.getState().getMaterial('brick')
    expect(brickMaterial).toBeDefined()
    expect(brickMaterial?.id).toBe('brick')
    expect(brickMaterial?.name).toBe('Ziegel')
    expect(brickMaterial?.category).toBe('wall')
    expect(brickMaterial?.visual.color).toBe('#b85450')
  })

  it('should return undefined for non-existent material', () => {
    const materialsMap = DEFAULT_MATERIALS.reduce((acc, material) => {
      acc[material.id] = material
      return acc
    }, {} as Record<string, Material>)

    useBuildingStore.getState().loadMaterials(materialsMap)

    const nonExistentMaterial = useBuildingStore.getState().getMaterial('non-existent')
    expect(nonExistentMaterial).toBeUndefined()
  })

  it('should have correct material properties', () => {
    const materialsMap = DEFAULT_MATERIALS.reduce((acc, material) => {
      acc[material.id] = material
      return acc
    }, {} as Record<string, Material>)

    useBuildingStore.getState().loadMaterials(materialsMap)

    const concreteMaterial = useBuildingStore.getState().getMaterial('concrete')
    expect(concreteMaterial).toBeDefined()
    
    // Check visual properties
    expect(concreteMaterial?.visual.color).toBe('#808080')
    expect(concreteMaterial?.visual.texture).toBe('/textures/wall/concrete-color.jpg')
    expect(concreteMaterial?.visual.normalMap).toBe('/textures/wall/concrete-normal.jpg')
    expect(concreteMaterial?.visual.roughnessMap).toBe('/textures/wall/concrete-roughness.jpg')
    expect(concreteMaterial?.visual.roughness).toBe(0.8)
    expect(concreteMaterial?.visual.metalness).toBe(0.1)

    // Check physical properties
    expect(concreteMaterial?.physical.density).toBe(2400)
    expect(concreteMaterial?.physical.lambda).toBe(2.1)
    expect(concreteMaterial?.physical.heatCapacity).toBe(1000)
    expect(concreteMaterial?.physical.thickness).toBe(0.24)

    // Check cost
    expect(concreteMaterial?.cost).toBe(150)
  })

  it('should handle material categories correctly', () => {
    const materialsMap = DEFAULT_MATERIALS.reduce((acc, material) => {
      acc[material.id] = material
      return acc
    }, {} as Record<string, Material>)

    useBuildingStore.getState().loadMaterials(materialsMap)

    const state = useBuildingStore.getState()
    const wallMaterials = Object.values(state.materials).filter(m => m.category === 'wall')
    const roofMaterials = Object.values(state.materials).filter(m => m.category === 'roof')
    const floorMaterials = Object.values(state.materials).filter(m => m.category === 'floor')

    expect(wallMaterials.length).toBeGreaterThan(0)
    expect(roofMaterials.length).toBeGreaterThan(0)
    expect(floorMaterials.length).toBeGreaterThan(0)

    // Check specific wall materials
    expect(wallMaterials.some(m => m.id === 'brick')).toBe(true)
    expect(wallMaterials.some(m => m.id === 'concrete')).toBe(true)
    expect(wallMaterials.some(m => m.id === 'wood-frame')).toBe(true)
  })

  it('should maintain material state across operations', () => {
    const materialsMap = DEFAULT_MATERIALS.reduce((acc, material) => {
      acc[material.id] = material
      return acc
    }, {} as Record<string, Material>)

    useBuildingStore.getState().loadMaterials(materialsMap)

    // Perform other operations
    useBuildingStore.getState().initBuilding('Test Building')
    useBuildingStore.getState().setTool('wall')

    // Materials should still be available
    const brickMaterial = useBuildingStore.getState().getMaterial('brick')
    expect(brickMaterial).toBeDefined()
    expect(brickMaterial?.id).toBe('brick')
  })

  it('should handle empty materials map', () => {
    useBuildingStore.getState().loadMaterials({})

    const state = useBuildingStore.getState()
    expect(Object.keys(state.materials)).toHaveLength(0)

    const brickMaterial = useBuildingStore.getState().getMaterial('brick')
    expect(brickMaterial).toBeUndefined()
  })

  it('should validate material structure', () => {
    const materialsMap = DEFAULT_MATERIALS.reduce((acc, material) => {
      acc[material.id] = material
      return acc
    }, {} as Record<string, Material>)

    useBuildingStore.getState().loadMaterials(materialsMap)

    const state = useBuildingStore.getState()
    
    // Validate all materials have required properties
    Object.values(state.materials).forEach(material => {
      expect(material.id).toBeDefined()
      expect(material.name).toBeDefined()
      expect(material.category).toBeDefined()
      expect(material.visual).toBeDefined()
      expect(material.visual.color).toBeDefined()
      expect(material.physical).toBeDefined()
      expect(material.cost).toBeDefined()
    })
  })
})
