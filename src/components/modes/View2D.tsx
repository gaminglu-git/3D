'use client'

import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useBuildingStore } from '@/lib/store/buildingStore'
import { isWall, Wall } from '@/lib/types/building'
import * as THREE from 'three'
import DimensionLine from './DimensionLine'
import { useMemo } from 'react'

export default function View2D() {
  const { camera } = useThree()
  const building = useBuildingStore((state) => state.building)
  const viewMode = useBuildingStore((state) => state.viewMode)
  const activeFloorLevel = useBuildingStore((state) => state.activeFloorLevel)

  const wallData = useMemo(() => {
    if (!building) return []
    return building.elements
      .filter((e): e is Wall => isWall(e) && e.floorLevel === activeFloorLevel)
      .map((wall) => {
        const wallPosition = new THREE.Vector3(wall.position.x, 0.01, wall.position.z)
        const wallQuaternion = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(wall.rotation.x, wall.rotation.y, wall.rotation.z),
        )
        const direction = new THREE.Vector3(1, 0, 0).applyQuaternion(wallQuaternion)
        const halfLength = wall.length / 2
        const startPoint = wallPosition.clone().sub(direction.clone().multiplyScalar(halfLength))
        const endPoint = wallPosition.clone().add(direction.clone().multiplyScalar(halfLength))
        return {
          id: wall.id,
          startPoint,
          endPoint,
          length: wall.length,
        }
      })
  }, [building, activeFloorLevel])

  useEffect(() => {
    if (viewMode === '2d') {
      // Switch to orthographic top-down view
      camera.position.set(0, 50, 0)
      camera.lookAt(0, 0, 0)
      camera.up.set(0, 0, -1)

      // Update camera rotation for top-down view
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.rotation.x = -Math.PI / 2
      }
    } else {
      // Restore 3D view
      camera.position.set(10, 10, 10)
      camera.lookAt(0, 0, 0)
      camera.up.set(0, 1, 0)
      camera.rotation.set(0, 0, 0)
    }
  }, [viewMode, camera])

  if (!building || viewMode !== '2d') return null

  return (
    <group>
      {/* 2D Floor Plan Overlay */}
      {wallData.map(({ id, startPoint, endPoint, length }) => (
        <group key={`2d-${id}`}>
          {/* Wall line */}
          <primitive
            object={
              new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([startPoint, endPoint]),
                new THREE.LineBasicMaterial({ color: '#1e293b', linewidth: 5 }),
              )
            }
          />
          {/* Dimension line */}
          <DimensionLine
            start={startPoint}
            end={endPoint}
            label={`${length.toFixed(2)}m`}
            offset={0.5}
          />
        </group>
      ))}

      {/* Grid lines for measurements */}
      <gridHelper args={[100, 100, '#94a3b8', '#e2e8f0']} position={[0, 0, 0]} />
    </group>
  )
}
