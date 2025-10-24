import { nanoid } from 'nanoid'
import { Building, WallElement } from '../types/building'
import { DEFAULT_WALL, DEFAULT_WINDOW, DEFAULT_DOOR } from '../constants/defaults'

/**
 * Create a simple demo house for testing and demonstration
 */
export function createDemoBuilding(): Building {
  const buildingId = nanoid()

  const walls: WallElement[] = [
    // Front wall (with door and window)
    {
      id: 'wall-front',
      type: 'wall',
      position: { x: 0, y: 1.25, z: -5 },
      rotation: { x: 0, y: 0, z: 0 },
      dimensions: { width: 10, height: 2.5, depth: 0.2 },
      floorLevel: 0,
      visible: true,
      locked: false,
      materialId: 'brick',
      openings: [
        {
          id: 'door-main',
          type: 'door',
          wallId: 'wall-front',
          position: { x: -1.5, y: -1.25 + (DEFAULT_DOOR.height / 2), z: 0 },
          width: DEFAULT_DOOR.width,
          height: DEFAULT_DOOR.height,
          materialId: 'wood-door',
          swingDirection: 'right',
          uValue: 1.8,
          dimensions: { width: DEFAULT_DOOR.width, height: DEFAULT_DOOR.height, depth: 0.1 },
          floorLevel: 0,
          visible: true,
          locked: false,
          rotation: {x: 0, y: 0, z: 0}
        },
        {
          id: 'window-front',
          type: 'window',
          wallId: 'wall-front',
          position: { x: 2, y: 0, z: 0 },
          width: DEFAULT_WINDOW.width,
          height: DEFAULT_WINDOW.height,
          materialId: 'double-glazing',
          frameThickness: 0.1,
          glazingLayers: 2,
          uValue: 1.3,
          dimensions: { width: DEFAULT_WINDOW.width, height: DEFAULT_WINDOW.height, depth: 0.1 },
          floorLevel: 0,
          visible: true,
          locked: false,
          rotation: {x: 0, y: 0, z: 0}
        },
      ],
    },
    // Back wall (with two windows)
    {
        id: 'wall-back',
        type: 'wall',
        position: { x: 0, y: 1.25, z: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        dimensions: { width: 10, height: 2.5, depth: 0.2 },
        floorLevel: 0,
        visible: true,
        locked: false,
        materialId: 'brick',
        openings: [
          {
            id: 'window-back-1',
            type: 'window',
            wallId: 'wall-back',
            position: { x: -2.5, y: 0, z: 0 },
            width: DEFAULT_WINDOW.width,
            height: DEFAULT_WINDOW.height,
            materialId: 'double-glazing',
            frameThickness: 0.1,
            glazingLayers: 2,
            uValue: 1.3,
            dimensions: { width: DEFAULT_WINDOW.width, height: DEFAULT_WINDOW.height, depth: 0.1 },
            floorLevel: 0,
            visible: true,
            locked: false,
            rotation: {x: 0, y: 0, z: 0}
          },
          {
            id: 'window-back-2',
            type: 'window',
            wallId: 'wall-back',
            position: { x: 2.5, y: 0, z: 0 },
            width: DEFAULT_WINDOW.width,
            height: DEFAULT_WINDOW.height,
            materialId: 'double-glazing',
            frameThickness: 0.1,
            glazingLayers: 2,
            uValue: 1.3,
            dimensions: { width: DEFAULT_WINDOW.width, height: DEFAULT_WINDOW.height, depth: 0.1 },
            floorLevel: 0,
            visible: true,
            locked: false,
            rotation: {x: 0, y: 0, z: 0}
          },
        ],
      },
      // Left wall
    {
        id: 'wall-left',
        type: 'wall',
        position: { x: -5, y: 1.25, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        dimensions: { width: 10, height: 2.5, depth: 0.2 },
        floorLevel: 0,
        visible: true,
        locked: false,
        materialId: 'brick',
        openings: [],
    },
    // Right wall
    {
        id: 'wall-right',
        type: 'wall',
        position: { x: 5, y: 1.25, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        dimensions: { width: 10, height: 2.5, depth: 0.2 },
        floorLevel: 0,
        visible: true,
        locked: false,
        materialId: 'brick',
        openings: [],
    },
    // Interior wall 1
    {
        id: 'wall-interior-1',
        type: 'wall',
        position: { x: 0, y: 1.25, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        dimensions: { width: 4, height: 2.5, depth: 0.15 },
        floorLevel: 0,
        visible: true,
        locked: false,
        materialId: 'concrete',
        openings: [
            {
                id: 'door-interior-1',
                type: 'door',
                wallId: 'wall-interior-1',
                position: { x: 0, y: -1.25 + (DEFAULT_DOOR.height / 2), z: 0 },
                width: DEFAULT_DOOR.width,
                height: DEFAULT_DOOR.height,
                materialId: 'wood-door',
                swingDirection: 'left',
                uValue: 1.8,
                dimensions: { width: DEFAULT_DOOR.width, height: DEFAULT_DOOR.height, depth: 0.1 },
                floorLevel: 0,
                visible: true,
                locked: false,
                rotation: {x: 0, y: 0, z: 0}
            }
        ],
    },
    // Interior wall 2
    {
        id: 'wall-interior-2',
        type: 'wall',
        position: { x: -3, y: 1.25, z: -2.5 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        dimensions: { width: 5, height: 2.5, depth: 0.15 },
        floorLevel: 0,
        visible: true,
        locked: false,
        materialId: 'concrete',
        openings: [],
    }
  ]

  return {
    id: buildingId,
    name: 'Demo Haus',
    floors: [],
    elements: [
      {
        id: 'floor-main',
        type: 'floor',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        dimensions: { width: 10.2, height: 0.2, depth: 10.2 },
        floorLevel: 0,
        visible: true,
        locked: false,
        materialId: 'concrete-slab',
      },
      ...walls,
      {
        id: 'roof-main',
        type: 'roof',
        position: { x: 0, y: 2.5, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        dimensions: { width: 10.5, height: 0.2, depth: 10.5 },
        floorLevel: 0,
        visible: true,
        locked: false,
        roofType: 'gabled',
        pitch: 35,
        materialId: 'roof-tiles',
      },
    ],
    metadata: {
      created: new Date(),
      modified: new Date(),
      totalArea: 100,
      totalVolume: 280,
    },
  }
}

/**
 * Create a multi-story demo building for testing floor-level features
 * 3 floors with walls, windows, and doors on each level
 */
export function createMultiStoryBuilding(): Building {
  const buildingId = nanoid()
  const floorHeight = 2.8
  const buildingWidth = 8
  const buildingDepth = 8

  // Create floors
  const floors = []
  for (let level = 0; level < 3; level++) {
    floors.push({
      id: nanoid(),
      type: 'floor' as const,
      level,
      height: floorHeight,
      position: { x: 0, y: level * floorHeight, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      dimensions: { width: buildingWidth, height: floorHeight, depth: buildingDepth },
      floorLevel: level,
      visible: true,
      locked: false,
      materialId: level === 0 ? 'concrete-slab' : 'wood-floor',
    })
  }

  // Create walls for each floor
  const elements = []
  for (let level = 0; level < 3; level++) {
    const baseY = level * floorHeight
    const wallHeight = floorHeight

    // Front wall (South - with door on ground floor, windows on upper floors)
    const frontWall = {
      id: nanoid(),
      type: 'wall' as const,
      position: { x: 0, y: baseY, z: -buildingDepth / 2 },
      rotation: { x: 0, y: 0, z: 0 },
      dimensions: { width: buildingWidth, height: wallHeight, depth: DEFAULT_WALL.thickness },
      floorLevel: level,
      visible: true,
      locked: false,
      materialId: level === 0 ? 'brick' : 'concrete',
      openings:
        level === 0
          ? [
              // Door on ground floor
              {
                id: nanoid(),
                type: 'door' as const,
                wallId: '',
                position: { x: buildingWidth / 2, y: 0, z: 0 },
                width: DEFAULT_DOOR.width,
                height: DEFAULT_DOOR.height,
                materialId: DEFAULT_DOOR.materialId,
                swingDirection: 'left' as const,
                uValue: DEFAULT_DOOR.uValue,
              },
            ]
          : [
              // Windows on upper floors
              {
                id: nanoid(),
                type: 'window' as const,
                wallId: '',
                position: { x: buildingWidth / 2, y: 1.0, z: 0 },
                width: DEFAULT_WINDOW.width,
                height: DEFAULT_WINDOW.height,
                materialId: DEFAULT_WINDOW.materialId,
                frameThickness: DEFAULT_WINDOW.frameThickness,
                glazingLayers: DEFAULT_WINDOW.glazingLayers,
                uValue: DEFAULT_WINDOW.uValue,
              },
            ],
    }
    // Set wallId for openings
    frontWall.openings.forEach((o) => (o.wallId = frontWall.id))
    elements.push(frontWall)

    // Back wall (North - with windows)
    const backWall = {
      id: nanoid(),
      type: 'wall' as const,
      position: { x: 0, y: baseY, z: buildingDepth / 2 },
      rotation: { x: 0, y: 0, z: 0 },
      dimensions: { width: buildingWidth, height: wallHeight, depth: DEFAULT_WALL.thickness },
      floorLevel: level,
      visible: true,
      locked: false,
      materialId: level === 0 ? 'brick' : 'concrete',
      openings: [
        {
          id: nanoid(),
          type: 'window' as const,
          wallId: '',
          position: { x: buildingWidth / 2 - 2, y: 1.0, z: 0 },
          width: DEFAULT_WINDOW.width,
          height: DEFAULT_WINDOW.height,
          materialId: DEFAULT_WINDOW.materialId,
          frameThickness: DEFAULT_WINDOW.frameThickness,
          glazingLayers: DEFAULT_WINDOW.glazingLayers,
          uValue: DEFAULT_WINDOW.uValue,
        },
        {
          id: nanoid(),
          type: 'window' as const,
          wallId: '',
          position: { x: buildingWidth / 2 + 2, y: 1.0, z: 0 },
          width: DEFAULT_WINDOW.width,
          height: DEFAULT_WINDOW.height,
          materialId: DEFAULT_WINDOW.materialId,
          frameThickness: DEFAULT_WINDOW.frameThickness,
          glazingLayers: DEFAULT_WINDOW.glazingLayers,
          uValue: DEFAULT_WINDOW.uValue,
        },
      ],
    }
    backWall.openings.forEach((o) => (o.wallId = backWall.id))
    elements.push(backWall)

    // Left wall (West)
    const leftWall = {
      id: nanoid(),
      type: 'wall' as const,
      position: { x: -buildingWidth / 2, y: baseY, z: 0 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      dimensions: { width: buildingDepth, height: wallHeight, depth: DEFAULT_WALL.thickness },
      floorLevel: level,
      visible: true,
      locked: false,
      materialId: level === 0 ? 'brick' : 'concrete',
      openings: [
        {
          id: nanoid(),
          type: 'window' as const,
          wallId: '',
          position: { x: buildingDepth / 2, y: 1.0, z: 0 },
          width: DEFAULT_WINDOW.width,
          height: DEFAULT_WINDOW.height,
          materialId: DEFAULT_WINDOW.materialId,
          frameThickness: DEFAULT_WINDOW.frameThickness,
          glazingLayers: DEFAULT_WINDOW.glazingLayers,
          uValue: DEFAULT_WINDOW.uValue,
        },
      ],
    }
    leftWall.openings.forEach((o) => (o.wallId = leftWall.id))
    elements.push(leftWall)

    // Right wall (East)
    const rightWall = {
      id: nanoid(),
      type: 'wall' as const,
      position: { x: buildingWidth / 2, y: baseY, z: 0 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      dimensions: { width: buildingDepth, height: wallHeight, depth: DEFAULT_WALL.thickness },
      floorLevel: level,
      visible: true,
      locked: false,
      materialId: level === 0 ? 'brick' : 'concrete',
      openings: [
        {
          id: nanoid(),
          type: 'window' as const,
          wallId: '',
          position: { x: buildingDepth / 2, y: 1.0, z: 0 },
          width: DEFAULT_WINDOW.width,
          height: DEFAULT_WINDOW.height,
          materialId: DEFAULT_WINDOW.materialId,
          frameThickness: DEFAULT_WINDOW.frameThickness,
          glazingLayers: DEFAULT_WINDOW.glazingLayers,
          uValue: DEFAULT_WINDOW.uValue,
        },
      ],
    }
    rightWall.openings.forEach((o) => (o.wallId = rightWall.id))
    elements.push(rightWall)
  }

  // Add roof
  elements.push({
    id: nanoid(),
    type: 'roof' as const,
    position: { x: 0, y: 3 * floorHeight, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    floorLevel: 2,
    visible: true,
    locked: false,
    roofType: 'gabled' as const,
    dimensions: { width: buildingWidth + 0.5, height: 0.2, depth: buildingDepth + 0.5 },
    pitch: 35,
    materialId: 'roof-tiles',
  })

  return {
    id: buildingId,
    name: 'Multi-Story Demo (3 Etagen)',
    floors,
    elements,
    metadata: {
      created: new Date(),
      modified: new Date(),
      totalArea: buildingWidth * buildingDepth * 3,
      totalVolume: buildingWidth * buildingDepth * floorHeight * 3,
    },
  }
}
