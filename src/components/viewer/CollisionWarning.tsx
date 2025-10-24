'use client'

import { useBuildingStore } from '@/lib/store/buildingStore'
import { useMemo } from 'react'
import * as THREE from 'three'
import { BuildingElement } from '@/lib/types/building'

// 3D collision indicators (rendered inside Canvas)
export default function CollisionWarning() {
  const building = useBuildingStore((state) => state.building)
  const collisions = useBuildingStore((state) => state.collisions)
  const selectedIds = useBuildingStore((state) => state.selectedElementIds)

  // Memoize collision positions for performance
  const collisionPositions = useMemo(() => {
    if (!building || collisions.length === 0) return []

    const positions: THREE.Vector3[] = []
    const relevantCollisions = collisions.filter(
      (c) => selectedIds.includes(c.elementAId) || selectedIds.includes(c.elementBId),
    )

    for (const collision of relevantCollisions) {
      const elementA = building.elements.find((e) => e.id === collision.elementAId)
      if (elementA) {
        positions.push(new THREE.Vector3(elementA.position.x, elementA.position.y, elementA.position.z))
      }
    }
    return positions
  }, [building, collisions, selectedIds])

  if (collisionPositions.length === 0) return null

  return (
    <>
      {/* 3D warning indicators at collision points */}
      {collisionPositions.map((pos, index) => (
        <CollisionIndicator key={`collision-${index}`} position={pos.toArray()} />
      ))}
    </>
  )
}

interface CollisionIndicatorProps {
  position: [number, number, number]
}

function CollisionIndicator({ position }: CollisionIndicatorProps) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="red" transparent opacity={0.5} />
    </mesh>
  )
}
