'use client'

import { useThree, useFrame } from '@react-three/fiber'
import { useDndMonitor, DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import { useDragStateStore } from '@/lib/store/dragStateStore'
import { getPreviewDimensions } from '@/lib/utils/elementFactory'
import { snapToGrid } from '@/lib/utils/geometry'
import { GRID_SIZE } from '@/lib/constants/defaults'
import * as THREE from 'three'
import { SuggestionItem } from '@/hooks/useContextualSuggestions'

export default function DragPreview3D() {
  const { camera, pointer, raycaster, scene } = useThree()
  const {
    activeItem,
    dragPosition,
    isValidDrop,
    setActiveItem,
    setDragPosition,
    setIsValidDrop,
    reset,
  } = useDragStateStore()

  useDndMonitor({
    onDragStart(event: DragStartEvent) {
      setActiveItem(event.active.data.current as SuggestionItem)
    },
    onDragEnd(event: DragEndEvent) {
      reset()
    },
  })

  useFrame(() => {
    if (!activeItem) return

    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObjects(scene.children, true)
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const intersection = new THREE.Vector3()

    let hit = intersects.find(
      (i) =>
        i.object.userData.isRaycastTarget ||
        (i.object.parent && i.object.parent.userData.isRaycastTarget),
    )

    if (hit) {
      const snappedX = snapToGrid(hit.point.x, GRID_SIZE)
      const snappedZ = snapToGrid(hit.point.z, GRID_SIZE)
      setDragPosition(new THREE.Vector3(snappedX, 0, snappedZ))
      setIsValidDrop(true)
    } else if (raycaster.ray.intersectPlane(groundPlane, intersection)) {
      const snappedX = snapToGrid(intersection.x, GRID_SIZE)
      const snappedZ = snapToGrid(intersection.z, GRID_SIZE)
      setDragPosition(new THREE.Vector3(snappedX, 0, snappedZ))
      setIsValidDrop(true)
    } else {
      setDragPosition(null)
      setIsValidDrop(false)
    }
  })

  if (!activeItem || !dragPosition) {
    return null
  }

  const dimensions = getPreviewDimensions(activeItem)
  const previewColor = isValidDrop ? '#3b82f6' : '#ef4444'

  return (
    <group position={dragPosition}>
      <mesh position={[0, dimensions.height / 2, 0]}>
        <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
        <meshStandardMaterial
          color={previewColor}
          transparent
          opacity={0.6}
          emissive={previewColor}
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
        <meshBasicMaterial
          color={previewColor}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}
