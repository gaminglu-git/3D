import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Canvas } from '@react-three/fiber'
import WallComponent from '../Wall'
import { useBuildingStore } from '@/lib/store/buildingStore'
import { WallElement, Door, Window as WindowType } from '@/lib/types/building'

// Mock child components
vi.mock('../Door', () => ({
  default: vi.fn(() => <mesh data-testid="door" />),
}))
vi.mock('../Window', () => ({
  default: vi.fn(() => <mesh data-testid="window" />),
}))

vi.mock('@/hooks/useMaterialTextures', () => ({
  useMaterialTextures: vi.fn(() => ({
    textures: {},
    status: 'success',
  })),
}))
vi.mock('@/lib/store/buildingStore')

const mockMaterial = {
  visual: {
    color: '#b85450',
    roughness: 0.9,
    metalness: 0.0,
  },
}

const mockGetMaterial = vi.fn((id: string) => {
  if (id === 'brick' || id === 'wood-door' || id === 'double-glazing') {
    return mockMaterial
  }
  return null
})

describe('Wall Component', () => {
  const mockWindow: WindowType = {
    id: 'window-1',
    type: 'window',
    wallId: 'wall-1',
    position: { x: 1, y: 1, z: 0 },
    width: 1,
    height: 1,
    materialId: 'double-glazing',
    dimensions: { width: 1, height: 1, depth: 0.1 },
    floorLevel: 0,
    visible: true,
    locked: false,
    rotation: {x: 0, y: 0, z: 0},
    frameThickness: 0.1,
    glazingLayers: 2,
    uValue: 1.3,
  }

  const mockDoor: Door = {
    id: 'door-1',
    type: 'door',
    wallId: 'wall-1',
    position: { x: -1, y: 0.5, z: 0 },
    width: 0.9,
    height: 2,
    materialId: 'wood-door',
    dimensions: { width: 0.9, height: 2, depth: 0.1 },
    floorLevel: 0,
    visible: true,
    locked: false,
    rotation: {x: 0, y: 0, z: 0},
    swingDirection: 'left',
    uValue: 1.8,
  }

  const baseWall: WallElement = {
    id: 'wall-1',
    type: 'wall',
    position: { x: 0, y: 1.25, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    dimensions: { width: 5, height: 2.5, depth: 0.2 },
    floorLevel: 0,
    visible: true,
    locked: false,
    materialId: 'brick',
    openings: [],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useBuildingStore).mockReturnValue({
      getMaterial: mockGetMaterial,
    } as any)
  })

  it('renders a wall without openings', () => {
    render(
      <Canvas>
        <WallComponent wall={baseWall} isSelected={false} />
      </Canvas>,
    )
    expect(screen.queryByTestId('door')).toBeNull()
    expect(screen.queryByTestId('window')).toBeNull()
  })

  it('renders a wall with a window', () => {
    const wallWithWindow = { ...baseWall, openings: [mockWindow] }
    render(
      <Canvas>
        <WallComponent wall={wallWithWindow} isSelected={false} />
      </Canvas>,
    )
    expect(screen.getByTestId('window')).toBeInTheDocument()
    expect(screen.queryByTestId('door')).toBeNull()
  })

  it('renders a wall with a door', () => {
    const wallWithDoor = { ...baseWall, openings: [mockDoor] }
    render(
      <Canvas>
        <WallComponent wall={wallWithDoor} isSelected={false} />
      </Canvas>,
    )
    expect(screen.getByTestId('door')).toBeInTheDocument()
    expect(screen.queryByTestId('window')).toBeNull()
  })

  it('renders a wall with multiple openings', () => {
    const wallWithOpenings = { ...baseWall, openings: [mockDoor, mockWindow] }
    render(
      <Canvas>
        <WallComponent wall={wallWithOpenings} isSelected={false} />
      </Canvas>,
    )
    expect(screen.getByTestId('door')).toBeInTheDocument()
    expect(screen.getByTestId('window')).toBeInTheDocument()
  })

  it('handles materials for openings correctly', () => {
    const wallWithOpenings = { ...baseWall, openings: [mockDoor, mockWindow] }
    render(
      <Canvas>
        <WallComponent wall={wallWithOpenings} isSelected={false} />
      </Canvas>,
    )
    expect(mockGetMaterial).toHaveBeenCalledWith('brick')
    expect(mockGetMaterial).toHaveBeenCalledWith('wood-door')
    expect(mockGetMaterial).toHaveBeenCalledWith('double-glazing')
  })
})
