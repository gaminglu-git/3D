'use client'

import * as THREE from 'three'
import { Text } from '@react-three/drei'

interface DimensionLineProps {
  start: THREE.Vector3
  end: THREE.Vector3
  label: string
  offset: number
}

export default function DimensionLine({ start, end, label, offset }: DimensionLineProps) {
  const lineVec = new THREE.Vector3().subVectors(end, start)
  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
  const perpendicular = new THREE.Vector3(-lineVec.z, 0, lineVec.x).normalize()
  const textPosition = midpoint.clone().add(perpendicular.multiplyScalar(offset))

  return (
    <group>
      {/* Main dimension line */}
      <primitive
        object={
          new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([start, end]),
            new THREE.LineBasicMaterial({ color: '#475569', linewidth: 1 }),
          )
        }
      />

      {/* Ticks at the end */}
      <primitive
        object={
          new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
              start,
              start.clone().add(perpendicular.clone().multiplyScalar(0.2)),
            ]),
            new THREE.LineBasicMaterial({ color: '#475569' }),
          )
        }
      />
      <primitive
        object={
          new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
              end,
              end.clone().add(perpendicular.clone().multiplyScalar(0.2)),
            ]),
            new THREE.LineBasicMaterial({ color: '#475569' }),
          )
        }
      />

      {/* Label */}
      <Text
        position={textPosition}
        color="#475569"
        fontSize={0.25}
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {label}
      </Text>
    </group>
  )
}
