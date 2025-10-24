import { Material } from '../types/materials'

/**
 * Default material library with common building materials
 * Values based on DIN 4108 and typical construction standards
 */
export const DEFAULT_MATERIALS: Material[] = [
  // Wall Materials
  {
    id: 'concrete',
    name: 'Beton',
    category: 'wall',
    visual: {
      color: '#808080',
      texture: '/textures/wall/concrete-color.jpg',
      normalMap: '/textures/wall/concrete-normal.jpg',
      roughnessMap: '/textures/wall/concrete-roughness.jpg',
      roughness: 0.8,
      metalness: 0.1,
    },
    physical: {
      density: 2400, // kg/m³
      lambda: 2.1, // W/(m·K)
      heatCapacity: 1000, // J/(kg·K)
      thickness: 0.24, // m
    },
    cost: 150,
  },
  {
    id: 'brick',
    name: 'Ziegel',
    category: 'wall',
    visual: {
      color: '#b85450',
      texture: '/textures/wall/brick-color.jpg',
      normalMap: '/textures/wall/brick-normal.jpg',
      roughnessMap: '/textures/wall/brick-roughness.jpg',
      roughness: 0.9,
      metalness: 0.0,
    },
    physical: {
      density: 1800,
      lambda: 0.81,
      heatCapacity: 1000,
      thickness: 0.365,
    },
    cost: 120,
  },
  {
    id: 'wood-frame',
    name: 'Holzständerwand',
    category: 'wall',
    visual: {
      color: '#d4a574',
      texture: '/textures/wall/wood-planks-color.jpg',
      normalMap: '/textures/wall/wood-planks-normal.jpg',
      roughnessMap: '/textures/wall/wood-planks-roughness.jpg',
      roughness: 0.7,
      metalness: 0.0,
    },
    physical: {
      density: 500,
      lambda: 0.13,
      heatCapacity: 1600,
      thickness: 0.2,
    },
    cost: 100,
  },
  {
    id: 'aerated-concrete',
    name: 'Porenbeton',
    category: 'wall',
    visual: {
      color: '#e0e0e0',
      texture: '/textures/wall/aerated-concrete-color.jpg',
      normalMap: '/textures/wall/aerated-concrete-normal.jpg',
      roughnessMap: '/textures/wall/aerated-concrete-roughness.jpg',
      roughness: 0.8,
      metalness: 0.0,
    },
    physical: {
      density: 500,
      lambda: 0.16,
      heatCapacity: 1000,
      thickness: 0.3,
    },
    cost: 110,
  },

  // Insulation Materials
  {
    id: 'eps-insulation',
    name: 'EPS Dämmung',
    category: 'insulation',
    visual: {
      color: '#ffffff',
      roughness: 0.9,
      metalness: 0.0,
    },
    physical: {
      density: 20,
      lambda: 0.035,
      heatCapacity: 1500,
      thickness: 0.16,
    },
    cost: 40,
  },
  {
    id: 'mineral-wool',
    name: 'Mineralwolle',
    category: 'insulation',
    visual: {
      color: '#ffeb99',
      roughness: 1.0,
      metalness: 0.0,
    },
    physical: {
      density: 50,
      lambda: 0.04,
      heatCapacity: 840,
      thickness: 0.16,
    },
    cost: 35,
  },

  // Roof Materials
  {
    id: 'roof-tiles',
    name: 'Dachziegel',
    category: 'roof',
    visual: {
      color: '#8b4513',
      texture: '/textures/roof/roof-tiles-color.jpg',
      normalMap: '/textures/roof/roof-tiles-normal.jpg',
      roughnessMap: '/textures/roof/roof-tiles-roughness.jpg',
      roughness: 0.8,
      metalness: 0.0,
    },
    physical: {
      density: 2000,
      lambda: 1.0,
      heatCapacity: 800,
      thickness: 0.02,
    },
    cost: 80,
  },
  {
    id: 'metal-roof',
    name: 'Metalldach',
    category: 'roof',
    visual: {
      color: '#708090',
      texture: '/textures/roof/metal-roof-color.jpg',
      normalMap: '/textures/roof/metal-roof-normal.jpg',
      roughnessMap: '/textures/roof/metal-roof-roughness.jpg',
      metalnessMap: '/textures/roof/metal-roof-metalness.jpg',
      roughness: 0.3,
      metalness: 0.9,
    },
    physical: {
      density: 7850,
      lambda: 50,
      heatCapacity: 450,
      thickness: 0.005,
    },
    cost: 70,
  },

  // Floor Materials
  {
    id: 'concrete-slab',
    name: 'Betondecke',
    category: 'floor',
    visual: {
      color: '#a0a0a0',
      texture: '/textures/floor/concrete-floor-color.jpg',
      normalMap: '/textures/floor/concrete-floor-normal.jpg',
      roughnessMap: '/textures/floor/concrete-floor-roughness.jpg',
      roughness: 0.7,
      metalness: 0.1,
    },
    physical: {
      density: 2400,
      lambda: 2.1,
      heatCapacity: 1000,
      thickness: 0.2,
    },
    cost: 100,
  },
  {
    id: 'wood-floor',
    name: 'Holzbalkendecke',
    category: 'floor',
    visual: {
      color: '#8b6f47',
      texture: '/textures/floor/wood-floor-color.jpg',
      normalMap: '/textures/floor/wood-floor-normal.jpg',
      roughnessMap: '/textures/floor/wood-floor-roughness.jpg',
      roughness: 0.6,
      metalness: 0.0,
    },
    physical: {
      density: 500,
      lambda: 0.13,
      heatCapacity: 1600,
      thickness: 0.25,
    },
    cost: 90,
  },

  // Window Materials
  {
    id: 'double-glazing',
    name: 'Doppelverglasung',
    category: 'window',
    visual: {
      color: '#87ceeb',
      texture: '/textures/window/glass-color.jpg',
      normalMap: '/textures/window/glass-normal.jpg',
      roughnessMap: '/textures/window/glass-roughness.jpg',
      roughness: 0.1,
      metalness: 0.5,
      opacity: 0.7,
    },
    physical: {
      density: 2500,
      lambda: 0.8,
      heatCapacity: 750,
      thickness: 0.024,
    },
    cost: 250,
  },
  {
    id: 'triple-glazing',
    name: 'Dreifachverglasung',
    category: 'window',
    visual: {
      color: '#87ceeb',
      texture: '/textures/window/glass-color.jpg',
      normalMap: '/textures/window/glass-normal.jpg',
      roughnessMap: '/textures/window/glass-roughness.jpg',
      roughness: 0.1,
      metalness: 0.5,
      opacity: 0.7,
    },
    physical: {
      density: 2500,
      lambda: 0.5,
      heatCapacity: 750,
      thickness: 0.036,
    },
    cost: 350,
  },

  // Door Materials
  {
    id: 'wood-door',
    name: 'Holztür',
    category: 'door',
    visual: {
      color: '#654321',
      texture: '/textures/door/wood-door-color.jpg',
      normalMap: '/textures/door/wood-door-normal.jpg',
      roughnessMap: '/textures/door/wood-door-roughness.jpg',
      roughness: 0.5,
      metalness: 0.0,
    },
    physical: {
      density: 600,
      lambda: 0.18,
      heatCapacity: 1600,
      thickness: 0.04,
    },
    cost: 200,
  },
  {
    id: 'insulated-door',
    name: 'Gedämmte Tür',
    category: 'door',
    visual: {
      color: '#4a4a4a',
      roughness: 0.4,
      metalness: 0.3,
    },
    physical: {
      density: 800,
      lambda: 0.1,
      heatCapacity: 1000,
      thickness: 0.06,
    },
    cost: 400,
  },
]

export function getMaterialById(id: string): Material | undefined {
  return DEFAULT_MATERIALS.find((m) => m.id === id)
}

export function getMaterialsByCategory(category: Material['category']): Material[] {
  return DEFAULT_MATERIALS.filter((m) => m.category === category)
}
