import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/react'
import { WallTool } from '../WallTool'
import { useBuildingStore } from '@/lib/store/buildingStore'
import { PhysicsService } from '@/lib/physics/physicsService'

vi.mock('@/lib/store/buildingStore')
vi.mock('@/lib/physics/physicsService')

describe('WallTool', () => {
  let mockAddElement: any
  let mockSetActiveSnap: any
  let mockPhysicsService: any

  beforeEach(() => {
    mockAddElement = vi.fn()
    mockSetActiveSnap = vi.fn()

    vi.mocked(useBuildingStore).mockReturnValue({
      addElement: mockAddElement,
      setActiveSnap: mockSetActiveSnap,
    } as any)

    mockPhysicsService = {
      addTemporaryBody: vi.fn(),
      removeTemporaryBody: vi.fn(),
      getSnapPoints: vi.fn().mockReturnValue([]),
      addJoint: vi.fn(),
      removeJoint: vi.fn(),
    }
    vi.mocked(PhysicsService).mockImplementation(() => mockPhysicsService)
  })

  it('should render without crashing', () => {
    render(<WallTool isEnabled={true} />)
  })

  it('should create a wall with two clicks', () => {
    render(<WallTool isEnabled={true} />)
    const wallToolDiv = screen.getByTestId('wall-tool-overlay') // Assuming you add a test-id

    fireEvent.pointerDown(wallToolDiv, {
      clientX: 100,
      clientY: 100,
      pointerId: 1,
    })
    fireEvent.pointerMove(wallToolDiv, {
      clientX: 200,
      clientY: 100,
      pointerId: 1,
    })
    fireEvent.pointerUp(wallToolDiv, {
      clientX: 200,
      clientY: 100,
      pointerId: 1,
    })
    fireEvent.pointerDown(wallToolDiv, {
      clientX: 200,
      clientY: 100,
      pointerId: 1,
    })
    expect(mockAddElement).toHaveBeenCalledOnce()
  })

  it('should not create walls shorter than 0.5m', () => {
    render(<WallTool isEnabled={true} />)
    const wallToolDiv = screen.getByTestId('wall-tool-overlay')

    fireEvent.pointerDown(wallToolDiv, {
      clientX: 100,
      clientY: 100,
      pointerId: 1,
    })
    fireEvent.pointerMove(wallToolDiv, {
      clientX: 100.1,
      clientY: 100,
      pointerId: 1,
    })
    fireEvent.pointerUp(wallToolDiv, {
      clientX: 100.1,
      clientY: 100,
      pointerId: 1,
    })
    fireEvent.pointerDown(wallToolDiv, {
      clientX: 100.1,
      clientY: 100,
      pointerId: 1,
    })

    expect(mockAddElement).not.toHaveBeenCalled()
  })
})
