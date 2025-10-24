'use client'

import { useCallback, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useBuildingStore } from '@/lib/store/buildingStore'
import { isWall } from '@/lib/types/building'
import { nanoid } from 'nanoid'
import { DEFAULT_DOOR } from '@/lib/constants/defaults'
import { globalToLocalWallPosition, snapToWallGrid, validateOpeningSpacing } from '@/lib/utils/wallCoordinates'
import { PLACEMENT_CONFIG } from '@/lib/utils/placement'
import { handleToolError } from '@/lib/utils/errorHandler'
import { raycastAgainstWalls } from '@/lib/utils/raycastLayers'
import OpeningPreview from './OpeningPreview'
import * as THREE from 'three'

export default function DoorTool() {
  const { raycaster, scene, camera, pointer } = useThree()
  const building = useBuildingStore((state) => state.building)
  const updateElement = useBuildingStore((state) => state.updateElement)
  const setHoveredElement = useBuildingStore((state) => state.setHoveredElement)

  const [previewPosition, setPreviewPosition] = useState<THREE.Vector3 | null>(null)
  const [previewNormal, setPreviewNormal] = useState<THREE.Vector3 | null>(null)
  const [hoveredWall, setHoveredWall] = useState<string | null>(null)
  const [isValidPlacement, setIsValidPlacement] = useState(true)

  // Continuous raycasting for preview
  useFrame(() => {
    if (!building) return

    // Update raycaster from pointer
    raycaster.setFromCamera(pointer, camera)

    // Raycast only against walls
    const intersection = raycastAgainstWalls(raycaster, scene)

    if (intersection) {
      const wallId = intersection.object.userData?.elementId
      if (!wallId) return

      const wall = building.elements.find((e) => e.id === wallId && isWall(e))
      if (!wall || !isWall(wall)) return

      // Convert to wall-local coordinates
      const localPosition = globalToLocalWallPosition(intersection.point, wall)

      // Snap to grid along wall
      const snappedX = snapToWallGrid(localPosition.x, wall.length, DEFAULT_DOOR.width)

      // Create preview opening for validation
      const previewOpening = {
        position: {
          x: snappedX,
          y: PLACEMENT_CONFIG.DOOR_HEIGHT,
          z: 0,
        },
        width: DEFAULT_DOOR.width,
        height: DEFAULT_DOOR.height,
      }

      // Validate spacing
      const validation = validateOpeningSpacing(wall, previewOpening)

      // Convert back to global for preview rendering
      const globalPos = intersection.point.clone()
      const normal = intersection.face ? intersection.face.normal.clone() : new THREE.Vector3(0, 0, 1)
      
      // Transform normal to world space
      normal.transformDirection(intersection.object.matrixWorld)

      setPreviewPosition(globalPos)
      setPreviewNormal(normal)
      setHoveredWall(wallId)
      setIsValidPlacement(validation.valid)
      setHoveredElement(wallId)
    } else {
      setPreviewPosition(null)
      setPreviewNormal(null)
      setHoveredWall(null)
      setIsValidPlacement(false)
      setHoveredElement(null)
    }
  })

  const handleClick = useCallback(
    (event: any) => {
      try {
        if (!previewPosition || !hoveredWall || !isValidPlacement || !building) {
          console.warn('Cannot place door: invalid position or wall')
          return
        }

        event.stopPropagation()

        // Find the wall
        const wall = building.elements.find((e) => e.id === hoveredWall && isWall(e))
        if (!wall || !isWall(wall)) return

        // Convert global intersection point to wall-local coordinates
        const localPosition = globalToLocalWallPosition(previewPosition, wall)

        // Snap to grid
        const snappedX = snapToWallGrid(localPosition.x, wall.length, DEFAULT_DOOR.width)

        // Create door opening with local coordinates
        const newDoor = {
          id: nanoid(),
          type: 'door' as const,
          wallId: wall.id,
          position: {
            x: snappedX,
            y: PLACEMENT_CONFIG.DOOR_HEIGHT,
            z: 0,
          },
          width: DEFAULT_DOOR.width,
          height: DEFAULT_DOOR.height,
          materialId: 'wood-door',
          swingDirection: 'left' as const,
          uValue: DEFAULT_DOOR.uValue,
        }

        // Validate one more time before adding
        const validation = validateOpeningSpacing(wall, newDoor)
        if (!validation.valid) {
          console.warn('Cannot place door: overlaps with existing opening')
          return
        }

        // Add door to wall's openings array
        const updatedOpenings = [...wall.openings, newDoor]
        updateElement(wall.id, { openings: updatedOpenings } as any)

        console.log('Door placed successfully:', newDoor.id)
      } catch (error) {
        handleToolError(error as Error, 'door', { action: 'place' })
      }
    },
    [building, previewPosition, hoveredWall, isValidPlacement, updateElement]
  )

  return (
    <>
      {/* Invisible plane for click detection */}
      <mesh
        onClick={handleClick}
        visible={false}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[1000, 1000]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Preview when hovering over wall */}
      {previewPosition && previewNormal && (
        <OpeningPreview
          position={previewPosition}
          normal={previewNormal}
          dimensions={{ width: DEFAULT_DOOR.width, height: DEFAULT_DOOR.height }}
          isValid={isValidPlacement}
          type="door"
        />
      )}
    </>
  )
}
