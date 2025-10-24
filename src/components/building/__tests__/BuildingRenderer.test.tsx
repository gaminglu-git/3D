import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Canvas } from '@react-three/fiber'
import BuildingRenderer from '../BuildingRenderer'
import { useBuildingStore } from '@/lib/store/buildingStore'
import { Building, Wall, Floor, Roof } from '@/lib/types/building'
import WallComponent from '../Wall'

vi.mock('../Wall', () => ({
  default: vi.fn(() => <mesh data-testid="wall-component" />),
}))

vi.mock('../Floor', () => ({
  default: vi.fn(() => <mesh data-testid="floor-component" />),
}))

vi.mock('../Roof', () => ({
  default: vi.fn(() => <mesh data-testid="roof-component" />),
}))

vi.mock('@/lib/store/buildingStore')

const mockWall: Wall = {
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

const mockFloor: Floor = {
  id: 'floor-1',
  type: 'floor',
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  dimensions: { width: 10, height: 0.2, depth: 10 },
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

const mockBuilding: Building = {
  id: 'test-building',
  name: 'Test Building',
  elements: [],
  floors: [],
  metadata: {
    created: new Date(),
    modified: new Date(),
  },
}

describe('BuildingRenderer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useBuildingStore).mockReturnValue({
      building: mockBuilding,
      selectedElementIds: [],
    } as any)
  })

  it('should render nothing for an empty building', () => {
    vi.mocked(useBuildingStore).mockReturnValue({
      building: { ...mockBuilding, elements: [] },
    } as any)
    const { container } = render(
      <Canvas>
        <BuildingRenderer />
      </Canvas>,
    )
    expect(container.querySelector('[data-testid="wall-component"]')).toBeNull()
  })

  it('should render a wall', () => {
    vi.mocked(useBuildingStore).mockReturnValue({
      building: { ...mockBuilding, elements: [mockWall] },
    } as any)
    render(
      <Canvas>
        <BuildingRenderer />
      </Canvas>,
    )
    expect(screen.getByTestId('wall-component')).toBeInTheDocument()
  })

  it('should render a floor', () => {
    vi.mocked(useBuildingStore).mockReturnValue({
      building: { ...mockBuilding, elements: [mockFloor] },
    } as any)
    render(
      <Canvas>
        <BuildingRenderer />
      </Canvas>,
    )
    expect(screen.getByTestId('floor-component')).toBeInTheDocument()
  })

  it('should render a roof', () => {
    vi.mocked(useBuildingStore).mockReturnValue({
      building: { ...mockBuilding, elements: [mockRoof] },
    } as any)
    render(
      <Canvas>
        <BuildingRenderer />
      </Canvas>,
    )
    expect(screen.getByTestId('roof-component')).toBeInTheDocument()
  })

  it('should render multiple elements', () => {
    vi.mocked(useBuildingStore).mockReturnValue({
      building: { ...mockBuilding, elements: [mockWall, mockFloor, mockRoof] },
    } as any)
    render(
      <Canvas>
        <BuildingRenderer />
      </Canvas>,
    )
    expect(screen.getByTestId('wall-component')).toBeInTheDocument()
    expect(screen.getByTestId('floor-component')).toBeInTheDocument()
    expect(screen.getByTestId('roof-component')).toBeInTheDocument()
  })

  it('should not render invisible elements', () => {
    const invisibleWall = { ...mockWall, visible: false }
    vi.mocked(useBuildingStore).mockReturnValue({
      building: { ...mockBuilding, elements: [invisibleWall] },
    } as any)
    const { container } = render(
      <Canvas>
        <BuildingRenderer />
      </Canvas>,
    )
    expect(
      container.querySelector('[data-testid="wall-component"]'),
    ).toBeNull()
  })

  it('should pass isSelected prop to components', () => {
    vi.mocked(useBuildingStore).mockReturnValue({
      building: { ...mockBuilding, elements: [mockWall] },
      selectedElementIds: [mockWall.id],
    } as any)
    render(
      <Canvas>
        <BuildingRenderer />
      </Canvas>,
    )
    expect(vi.mocked(WallComponent)).toHaveBeenCalledWith(
      expect.objectContaining({ isSelected: true }),
      expect.anything(),
    )
  })
})
