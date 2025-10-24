'use client'

import { useEffect, useRef } from 'react'
import { TransformControls as DreiTransformControls } from '@react-three/drei'
import { useBuildingStore } from '@/lib/store/buildingStore'
import { isWall, isFloor, isRoof } from '@/lib/types/building'
import * as THREE from 'three'

export default function TransformControlsWrapper() {
  const selectedIds = useBuildingStore((state) => state.selectedElementIds)
  const building = useBuildingStore((state) => state.building)
  const updateElement = useBuildingStore((state) => state.updateElement)
  const tool = useBuildingStore((state) => state.tool)

  // Only show transform controls in select mode with a single selection
  if (tool !== 'select' || selectedIds.length !== 1 || !building) {
    return null
  }

  const selectedElement = building.elements.find((e) => e.id === selectedIds[0])
  if (!selectedElement) return null

  return (
    <TransformControlsForElement
      element={selectedElement}
      onTransform={(position, rotation) => {
        updateElement(selectedElement.id, {
          position,
          rotation,
        })
      }}
    />
  )
}

interface TransformControlsForElementProps {
  element: any
  onTransform: (position: any, rotation: any) => void
}

function TransformControlsForElement({ element, onTransform }: TransformControlsForElementProps) {
  const controlsRef = useRef<any>(null)
  const meshRef = useRef<THREE.Group | null>(null)

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

  const handleChange = () => {
    if (meshRef.current) {
      const position = meshRef.current.position
      const rotation = meshRef.current.rotation

      onTransform(
        { x: position.x, y: position.y, z: position.z },
        { x: rotation.x, y: rotation.y, z: rotation.z }
      )
    }
  }

  // Calculate initial position based on element type
  let initialY = element.position.y
  if (isWall(element)) {
    initialY = element.position.y + element.height / 2
  }

  return (
    <>
      <group
        ref={meshRef}
        position={[element.position.x, initialY, element.position.z]}
        rotation={[element.rotation.x, element.rotation.y, element.rotation.z]}
      >
        {/* Invisible helper box for transform controls */}
        <mesh visible={false}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
        </mesh>
      </group>

      <DreiTransformControls
        ref={controlsRef}
        mode="translate"
        onObjectChange={handleChange}
        translationSnap={0.1}
        rotationSnap={Math.PI / 12}
        scaleSnap={0.1}
      />
    </>
  )
}
