import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface UIState {
  showSidebar: boolean
  toggleSidebar: () => void
  activeSidebarTab: string
  setActiveSidebarTab: (tab: string) => void
  showWelcomeDialog: boolean
  setShowWelcomeDialog: (show: boolean) => void
  showImportExportDialog: 'import' | 'export' | null
  setShowImportExportDialog: (mode: 'import' | 'export' | null) => void
  showHelp: boolean
  setShowHelp: (show: boolean) => void
  showPhysicsDebugger: boolean
  togglePhysicsDebugger: () => void
  isPhysicsSandboxMode: boolean
  togglePhysicsSandboxMode: () => void
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      showSidebar: true,
      toggleSidebar: () => set((state) => ({ showSidebar: !state.showSidebar })),
      activeSidebarTab: 'tools',
      setActiveSidebarTab: (tab) => set({ activeSidebarTab: tab }),
      showWelcomeDialog: false,
      setShowWelcomeDialog: (show) => set({ showWelcomeDialog: show }),
      showImportExportDialog: null,
      setShowImportExportDialog: (mode) => set({ showImportExportDialog: mode }),
      showHelp: false,
      setShowHelp: (show) => set({ showHelp: show }),
      showPhysicsDebugger: true, // Default to true for now
      togglePhysicsDebugger: () => set((state) => ({ showPhysicsDebugger: !state.showPhysicsDebugger })),
      isPhysicsSandboxMode: false,
      togglePhysicsSandboxMode: () => set((state) => ({ isPhysicsSandboxMode: !state.isPhysicsSandboxMode })),
    }),
    { name: 'UIStore' },
  ),
)
