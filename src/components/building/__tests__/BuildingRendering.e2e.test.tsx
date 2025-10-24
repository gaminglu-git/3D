import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import BuildingRenderer from '../BuildingRenderer'
import { useBuildingStore } from '@/lib/store/buildingStore'
import { Building } from '@/lib/types/building'

// Mock child components to check props
vi.mock('../Wall', () => ({
  default: (props: any) => <div data-testid="wall" {...props} />,
}))
vi.mock('../Floor', () => ({
  default: (props: any) => <div data-testid="floor" {...props} />,
}))
vi.mock('../Roof', () => ({
  default: (props: any) => <div data-testid="roof" {...props} />,
}))
vi.mock('../Door', () => ({
  default: (props: any) => <div data-testid="door" {...props} />,
}))
vi.mock('../Window', () => ({
  default: (props: any) => <div data-testid="window" {...props} />,
}))

// Mock the usePhysics hook as it's not needed for this test
vi.mock('@/hooks/usePhysics', () => ({
  usePhysics: vi.fn(() => ({ isPhysicsReady: true })),
}))

describe('BuildingRenderer', () => {
  beforeEach(() => {
    // Reset Zustand store before each test
    useBuildingStore.setState({
      building: null,
      selectedElementIds: [],
      isExplosionViewActive: false,
      explosionFactor: 1.5,
      getMaterial: vi.fn(),
    } as any)
  })

  it.skip('should render all building elements', () => {
    const testBuilding: Building = {
      elements: [
        { id: 'floor1', type: 'floor', level: 0 },
        { id: 'wall1', type: 'wall', length: 5 },
        { id: 'roof1', type: 'roof', width: 10 },
      ],
      metadata: { version: '1.0', created: '', modified: '' },
    }
    useBuildingStore.setState({ building: testBuilding })

    render(<BuildingRenderer />)

    expect(screen.getByTestId('floor')).toBeInTheDocument()
    expect(screen.getByTestId('wall')).toBeInTheDocument()
    expect(screen.getByTestId('roof')).toBeInTheDocument()
  })

  it.skip('should not render anything if building is null', () => {
    render(<BuildingRenderer />)

    expect(screen.queryByTestId('floor')).not.toBeInTheDocument()
    expect(screen.queryByTestId('wall')).not.toBeInTheDocument()
    expect(screen.queryByTestId('roof')).not.toBeInTheDocument()
  })
})
