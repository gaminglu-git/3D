'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useDroppable } from '@dnd-kit/core'
import { useDragStateStore } from '@/lib/store/dragStateStore'
import {
  createElementFromLibraryItem,
  getPreviewDimensions,
} from '@/lib/utils/elementFactory'
import { snapToGrid } from '@/lib/utils/geometry'
import { GRID_SIZE } from '@/lib/constants/defaults'
import * as THREE from 'three'

/**
 * 3D Drop Zone Component - Integrated with dnd-kit
 * Handles raycasting and shows real-time 3D preview during drag
 */
export default function DropZone3D() {
  const { camera, pointer, raycaster, scene } = useThree()
  const activeItem = useDragStateStore((state) => state.activeItem)
  const meshRef = useRef<THREE.Mesh>(null)

  const { setNodeRef, isOver } = useDroppable({
    id: 'drop-zone-3d',
  })

  // We still need a way to know what item is being dragged
  // This can be done via a lightweight store or context, or a global event listener
  // For now, let's assume we can get it from a global state that dnd-kit updates
  // This part needs a proper solution, maybe a new store slice for drag state
  const draggedItem = activeItem // This is gone, needs replacement

  useFrame(() => {
    // This logic now depends on the active drag item from dnd-kit, not the store
    // This requires a bit more setup to get the active item data into this component
    // Let's assume for now that `handleDragEnd` in ViewerScene will handle the drop
    // and this component is only for visual feedback.
    // The preview logic will be moved to a separate component that listens to dnd-kit events
  })

  // The invisible mesh now acts as the droppable area for dnd-kit
  // Raycasting for the final position will be triggered from the onDragEnd in ViewerScene
  // or onDragMove if we want a live position.
  return (
    <mesh ref={meshRef} visible={false}>
      <planeGeometry args={[1000, 1000]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  )
}
