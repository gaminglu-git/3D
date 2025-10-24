'use client'

import { useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { useBuildingStore } from '@/lib/store/buildingStore'
import * as THREE from 'three'

export default function SelectionOutline() {
  const { scene } = useThree()
  const selectedIds = useBuildingStore((state) => state.selectedElementIds)
  const building = useBuildingStore((state) => state.building)

  const selectedObjects = useMemo(() => {
    if (!building || selectedIds.length === 0) return []

    const objects: THREE.Object3D[] = []

    // Find all meshes that belong to selected elements
    scene.traverse((object) => {
      if (object.userData.elementId && selectedIds.includes(object.userData.elementId)) {
        objects.push(object)
      }
    })

    return objects
  }, [selectedIds, building, scene])

  // Outline is disabled for now - causes compatibility issues
  // Will be re-enabled with proper post-processing setup
  return null
}
