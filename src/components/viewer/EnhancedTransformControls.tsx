'use client'

import { useEffect, useRef, useState } from 'react'
import { TransformControls as DreiTransformControls } from '@react-three/drei'
import { useBuildingStore } from '@/lib/store/buildingStore'
import { isWall } from '@/lib/types/building'
import * as THREE from 'three'
import { Position3D } from '@/lib/types/geometry'

interface EnhancedTransformControlsProps {
  recomputeCollisions: () => void
}

export default function EnhancedTransformControls({ recomputeCollisions }: EnhancedTransformControlsProps) {
  const selectedIds = useBuildingStore((state) => state.selectedElementIds)
  const building = useBuildingStore((state) => state.building)
  const updateElement = useBuildingStore((state) => state.updateElement)
  const tool = useBuildingStore((state) => state.tool)

  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate')
  const [isTransforming, setIsTransforming] = useState(false)
  const [startPosition, setStartPosition] = useState<Position3D | null>(null)
  const [currentPosition, setCurrentPosition] = useState<Position3D | null>(null)

  // Only show transform controls in select mode with a single selection
  if (tool !== 'select' || selectedIds.length !== 1 || !building) {
    return null
  }

  const selectedElement = building.elements.find((e) => e.id === selectedIds[0])
  if (!selectedElement) return null

  return (
    <TransformControlsForElement
      element={selectedElement}
      mode={transformMode}
      onTransform={(position, rotation) => {
        updateElement(selectedElement.id, {
          position,
          rotation,
        })
      }}
      onTransformStart={(pos) => {
        setIsTransforming(true)
        setStartPosition(pos)
        setCurrentPosition(pos)
      }}
      onTransformChange={(pos) => {
        setCurrentPosition(pos)
      }}
      onTransformEnd={() => {
        setIsTransforming(false)
        setStartPosition(null)
        setCurrentPosition(null)
        recomputeCollisions()
      }}
    />
  )
}

interface TransformControlsForElementProps {
  element: any
  mode: 'translate' | 'rotate' | 'scale'
  onTransform: (position: any, rotation: any) => void
  onTransformStart?: (position: Position3D) => void
  onTransformChange?: (position: Position3D) => void
  onTransformEnd?: () => void
}

function TransformControlsForElement({
  element,
  mode,
  onTransform,
  onTransformStart,
  onTransformChange,
  onTransformEnd,
}: TransformControlsForElementProps) {
  const controlsRef = useRef<any>(null)
  const meshRef = useRef<THREE.Group | null>(null)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const controls = controlsRef.current
    const mesh = meshRef.current

    if (controls && mesh) {
      controls.attach(mesh)
    }

    return () => {
      if (controls) {
        controls.detach()
      }
    }
  }, [element.id])

  const handleMouseDown = () => {
    setDragging(true)
    if (meshRef.current && onTransformStart) {
      const pos = meshRef.current.position
      onTransformStart({ x: pos.x, y: pos.y, z: pos.z })
    }
  }

  const handleMouseUp = () => {
    setDragging(false)
    if (onTransformEnd) {
      onTransformEnd()
    }
  }

  const handleChange = () => {
    if (meshRef.current) {
      const position = meshRef.current.position
      const rotation = meshRef.current.rotation

      if (onTransformChange) {
        onTransformChange({ x: position.x, y: position.y, z: position.z })
      }

      onTransform(
        { x: position.x, y: position.y, z: position.z },
        { x: rotation.x, y: rotation.y, z: rotation.z }
      )
    }
  }

  return (
    <>
      <group
        ref={meshRef}
        position={[element.position.x, element.position.y, element.position.z]}
        rotation={[element.rotation.x, element.rotation.y, element.rotation.z]}
      >
        {/* Invisible helper box for transform controls */}
        <mesh visible={false}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
        </mesh>
      </group>

      <DreiTransformControls
        ref={controlsRef}
        mode={mode}
        onObjectChange={handleChange}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        translationSnap={0.1}
        rotationSnap={Math.PI / 12}
        scaleSnap={0.1}
        size={1.5} // Larger gizmo for better visibility
        showX={true}
        showY={mode !== 'translate'} // Hide Y axis for translation (keep objects on ground)
        showZ={true}
      />
    </>
  )
}
