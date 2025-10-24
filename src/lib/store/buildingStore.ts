import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Building, BuildingElement, StructuralElement } from '../types/building'
import { Material } from '../types/materials'
import { physicsService } from '../physics/physicsService'
import { PhysicsCommandType } from '../physics/types'

interface BuildingState {
  building: Building | null
  isInitialized: boolean
  selectedElementIds: string[]
  hoveredElementId: string | null
  activeSnap: any | null
  collisions: any[]
  viewMode: '3d' | '2d'
  tool: string
  activeFloorLevel: number
  isExplosionViewActive: boolean
  explosionFactor: number
  materials: Record<string, Material>
  connectionPrompt: { elementA: BuildingElement; elementB: BuildingElement } | null
  isExpertMode: boolean
  history: {
    past: Partial<BuildingState>[]
    future: Partial<BuildingState>[]
  }
  setBuilding: (building: Building) => void
  initBuilding: (name: string) => void
  setInitialized: (isInitialized: boolean) => void
  addElement: (element: StructuralElement) => void
  updateElement: (elementId: string, updates: Partial<BuildingElement>) => void
  deleteElement: (elementId: string) => void
  selectElement: (elementId: string, multiSelect?: boolean) => void
  clearSelection: () => void
  setHoveredElement: (elementId: string | null) => void
  setActiveSnap: (snap: any | null) => void
  setCollisions: (collisions: any[]) => void
  setViewMode: (mode: '3d' | '2d') => void
  setTool: (tool: string) => void
  setActiveFloorLevel: (level: number) => void
  toggleExplosionView: () => void
  setExplosionFactor: (factor: number) => void
  loadMaterials: (materials: Record<string, Material>) => void
  getMaterial: (materialName: string) => Material | undefined
  undo: () => void
  redo: () => void
  loadDefaultBuilding: () => void
  hideConnectionPrompt: () => void
  mergeElements: (elementIdA: string, elementIdB: string) => void
  connectElements: (elementIdA: string, elementIdB: string) => void
  setExpertMode: (isExpertMode: boolean) => void
  setExplosionViewActive: (isActive: boolean) => void
}

const createHistoryState = (state: BuildingState) => {
    const historyState = { ...state }
    delete (historyState as any).history
    return historyState
}

export const useBuildingStore = create<BuildingState>()(
  devtools(
    (set, get) => ({
        building: null,
        isInitialized: false,
        selectedElementIds: [],
        hoveredElementId: null,
        activeSnap: null,
        collisions: [],
        viewMode: '3d' as '3d' | '2d',
        tool: 'select',
        activeFloorLevel: 0,
        isExplosionViewActive: false,
        explosionFactor: 1.5,
        materials: {},
        connectionPrompt: null,
        isExpertMode: false,
        history: {
            past: [],
            future: [],
        },
      setBuilding: (building) => {
        set((state) => {
            const historyState = createHistoryState(state)
            return {
                building,
                isInitialized: true,
                selectedElementIds: [],
                history: {
                    past: [...state.history.past, historyState],
                    future: [],
                }
            }
        })
      },
      initBuilding: (name: string) => {
        set((state: BuildingState) => {
            const historyState = createHistoryState(state)
            return {
                building: {
                    id: `building-${Date.now()}`,
                    name,
                    floors: [],
                    elements: [],
                    metadata: {
                        created: new Date(),
                        modified: new Date(),
                        totalArea: 0,
                        totalVolume: 0,
                    },
                },
                isInitialized: true,
                history: {
                    past: [...state.history.past, historyState],
                    future: [],
                }
            }
        })
      },
      setInitialized: (isInitialized) => set({ isInitialized }),
      addElement: (element) => {
        set((state: BuildingState) => {
            if (!state.building) return {}
            const historyState = createHistoryState(state)
            const updatedBuilding = {
                ...state.building,
                elements: [...state.building.elements, element],
                metadata: {
                    ...state.building.metadata,
                    modified: new Date(),
                },
            }

            physicsService.addCommand({
              type: PhysicsCommandType.ADD,
              elementId: element.id,
              element,
            })
            
            return {
                building: updatedBuilding,
                history: {
                    past: [...state.history.past, historyState],
                    future: [],
                }
            }
        })
      },
      updateElement: (elementId, updates) => {
        set((state: BuildingState) => {
            if (!state.building) return {}
            const historyState = createHistoryState(state)
            return {
                building: {
                    ...state.building,
                    elements: state.building.elements.map((e) => e.id === elementId ? { ...e, ...updates } : e),
                    metadata: {
                        ...state.building.metadata,
                        modified: new Date(),
                    },
                },
                history: {
                    past: [...state.history.past, historyState],
                    future: [],
                }
            }
        })
      },
      deleteElement: (elementId) => {
        set((state: BuildingState) => {
            if (!state.building) return {}
            const historyState = createHistoryState(state)
            
            physicsService.addCommand({
              type: PhysicsCommandType.REMOVE,
              elementId,
            })

            return {
                building: {
                    ...state.building,
                    elements: state.building.elements.filter((e) => e.id !== elementId),
                    metadata: {
                        ...state.building.metadata,
                        modified: new Date(),
                    },
                },
                selectedElementIds: state.selectedElementIds.filter((id) => id !== elementId),
                history: {
                    past: [...state.history.past, historyState],
                    future: [],
                }
            }
        })
      },
      selectElement: (elementId, multiSelect = false) => {
        set((state) => {
            const historyState = createHistoryState(state)
            return {
                selectedElementIds: multiSelect
                    ? state.selectedElementIds.includes(elementId)
                        ? state.selectedElementIds.filter((id) => id !== elementId)
                        : [...state.selectedElementIds, elementId]
                    : [elementId],
                history: {
                    past: [...state.history.past, historyState],
                    future: [],
                }
            }
        })
      },
      clearSelection: () => {
        set((state) => {
            const historyState = createHistoryState(state)
            return {
                selectedElementIds: [],
                history: {
                    past: [...state.history.past, historyState],
                    future: [],
                }
            }
        })
      },
      setHoveredElement: (elementId) => set({ hoveredElementId: elementId }),
      setActiveSnap: (snap) => set({ activeSnap: snap }),
      setCollisions: (collisions) => set({ collisions }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setTool: (tool) => set({ tool }),
      setActiveFloorLevel: (level) => set({ activeFloorLevel: level }),
      toggleExplosionView: () => {
        set((state) => {
            const historyState = createHistoryState(state)
            return {
                isExplosionViewActive: !state.isExplosionViewActive,
                history: {
                    past: [...state.history.past, historyState],
                    future: [],
                }
            }
        })
      },
      setExplosionFactor: (factor) => set({ explosionFactor: factor }),
      loadMaterials: (materials) => {
        set((state) => {
            const historyState = createHistoryState(state)
            return {
                materials,
                history: {
                    past: [...state.history.past, historyState],
                    future: [],
                }
            }
        })
      },
      getMaterial: (materialName) => get().materials[materialName],
      undo: () => {
        set((state) => {
            const { past, future } = state.history
            if (past.length === 0) return {}

            const previousState = past[past.length - 1]
            const newPast = past.slice(0, past.length - 1)
            const currentState = createHistoryState(state)

            return {
                ...previousState,
                history: {
                    past: newPast,
                    future: [currentState, ...future],
                },
            }
        })
      },
      redo: () => {
        set((state) => {
            const { past, future } = state.history
            if (future.length === 0) return {}

            const nextState = future[0]
            const newFuture = future.slice(1)
            const currentState = createHistoryState(state)
            
            return {
                ...nextState,
                history: {
                    past: [...past, currentState],
                    future: newFuture,
                },
            }
        })
      },
      loadDefaultBuilding: () => {
        get().initBuilding('New Building')
      },
      hideConnectionPrompt: () => set({ connectionPrompt: null }),
      mergeElements: (elementIdA, elementIdB) => {
        set((state: BuildingState) => {
          if (!state.building) return {}
          const historyState = createHistoryState(state)
          
          // Simple merge implementation - remove elementB and extend elementA
          const elementA = state.building.elements.find(e => e.id === elementIdA)
          const elementB = state.building.elements.find(e => e.id === elementIdB)
          
          if (!elementA || !elementB) return {}
          
          // For now, just remove elementB (in a real implementation, you'd merge their geometries)
          const updatedElements = state.building.elements.filter(e => e.id !== elementIdB)
          
          return {
            building: {
              ...state.building,
              elements: updatedElements,
              metadata: {
                ...state.building.metadata,
                modified: new Date(),
              },
            },
            connectionPrompt: null,
            history: {
              past: [...state.history.past, historyState],
              future: [],
            }
          }
        })
      },
      connectElements: (elementIdA, elementIdB) => {
        set((state: BuildingState) => {
          if (!state.building) return {}
          const historyState = createHistoryState(state)
          
          // Simple connection implementation - just mark them as connected
          // In a real implementation, you'd add connection metadata
          return {
            connectionPrompt: null,
            history: {
              past: [...state.history.past, historyState],
              future: [],
            }
          }
        })
      },
      setExpertMode: (isExpertMode) => set({ isExpertMode }),
      setExplosionViewActive: (isActive) => set({ isExplosionViewActive: isActive }),
    }),
    { name: 'BuildingStore' },
  ),
)
