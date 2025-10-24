import { useEffect } from 'react'
import { useBuildingStore } from '@/lib/store/buildingStore'

/**
 * Hook to handle keyboard shortcuts for tools
 */
export function useKeyboardShortcuts() {
  const setTool = useBuildingStore((state) => state.setTool)
  const setViewMode = useBuildingStore((state) => state.setViewMode)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Tool shortcuts
      switch (e.key.toLowerCase()) {
        case 'v':
          setTool('select')
          break
        case 'w':
          setTool('wall')
          break
        case 'f':
          setTool('window')
          break
        case 'd':
          setTool('door')
          break
        case 'r':
          setTool('roof')
          break
        case 'tab':
          e.preventDefault()
          // Toggle between 2D and 3D
          const currentMode = useBuildingStore.getState().viewMode
          setViewMode(currentMode === '2d' ? '3d' : '2d')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setTool, setViewMode])
}
