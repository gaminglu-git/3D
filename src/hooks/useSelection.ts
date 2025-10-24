import { useBuildingStore } from '@/lib/store/buildingStore'
import { useCallback, useEffect } from 'react'

/**
 * Hook to manage element selection and keyboard shortcuts
 */
export function useSelection() {
  const selectedIds = useBuildingStore((state) => state.selectedElementIds)
  const selectElement = useBuildingStore((state) => state.selectElement)
  const clearSelection = useBuildingStore((state) => state.clearSelection)
  const deleteElement = useBuildingStore((state) => state.deleteElement)
  const undo = useBuildingStore((state) => state.undo)
  const redo = useBuildingStore((state) => state.redo)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Delete selected elements
      if (e.key === 'Delete' || e.key === 'Backspace') {
        selectedIds.forEach((id) => deleteElement(id))
        e.preventDefault()
      }

      // Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        undo()
        e.preventDefault()
      }

      // Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        redo()
        e.preventDefault()
      }

      // Escape to clear selection
      if (e.key === 'Escape') {
        clearSelection()
        e.preventDefault()
      }
    },
    [selectedIds, deleteElement, undo, redo, clearSelection]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return {
    selectedIds,
    selectElement,
    clearSelection,
    hasSelection: selectedIds.length > 0,
  }
}
