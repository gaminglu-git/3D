import { useState, useCallback } from 'react'
import { useBuildingStore } from '@/lib/store/buildingStore'
import { nanoid } from 'nanoid'
import { Wall } from '@/lib/types/building'
import {
  DEFAULT_WALL,
  DEFAULT_WINDOW,
  DEFAULT_DOOR,
  DEFAULT_ROOF,
  ZERO_POSITION,
  ZERO_ROTATION,
} from '@/lib/constants/defaults'

/**
 * Hook to handle drag and drop functionality
 */
export function useDragDrop() {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedItem, setDraggedItem] = useState<any>(null)
  const addElement = useBuildingStore((state) => state.addElement)

  const handleDragStart = useCallback((item: any) => {
    setIsDragging(true)
    setDraggedItem(item)
  }, [])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    setDraggedItem(null)
  }, [])

  const handleDrop = useCallback(
    (position: { x: number; y: number; z: number }) => {
      if (!draggedItem) return

      // Create element based on dragged item type
      if (draggedItem.id.startsWith('wall')) {
        const wall: Wall = {
          id: nanoid(),
          type: 'wall',
          position,
          rotation: ZERO_ROTATION,
          dimensions: {
            width: DEFAULT_WALL.length,
            height: DEFAULT_WALL.height,
            depth: DEFAULT_WALL.thickness,
          },
          floorLevel: 0,
          visible: true,
          locked: false,
          length: DEFAULT_WALL.length,
          height: DEFAULT_WALL.height,
          thickness: DEFAULT_WALL.thickness,
          materialId: DEFAULT_WALL.materialId,
          openings: [],
        }
        addElement(wall)
      }

      handleDragEnd()
    },
    [draggedItem, addElement, handleDragEnd]
  )

  return {
    isDragging,
    draggedItem,
    handleDragStart,
    handleDragEnd,
    handleDrop,
  }
}
