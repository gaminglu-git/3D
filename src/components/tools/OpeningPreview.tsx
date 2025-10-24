'use client'

import * as THREE from 'three'
import { useMemo } from 'react'

interface OpeningPreviewProps {
  position: THREE.Vector3
  normal: THREE.Vector3
  dimensions: { width: number; height: number }
  isValid: boolean
  type: 'window' | 'door'
}

/**
 * Visual Preview for Window/Door placement on walls
 * Shows halbtransparent mesh with outline
 * Color indicates valid (green) or invalid (red) placement
 */
export default function OpeningPreview({
  position,
  normal,
  dimensions,
  isValid,
  type,
}: OpeningPreviewProps) {
  // Calculate rotation to face along wall normal
  const rotation = useMemo(() => {
    const angle = Math.atan2(normal.x, normal.z)
    return [0, angle, 0] as [number, number, number]
  }, [normal])

  // Offset position slightly from wall surface for visibility
  const offsetPosition = useMemo(() => {
    const offset = normal.clone().multiplyScalar(0.05)
    return position.clone().add(offset)
  }, [position, normal])

  const color = isValid ? '#22c55e' : '#ef4444' // green : red
  const emissiveIntensity = isValid ? 0.5 : 0.8

  return (
    <group position={offsetPosition} rotation={rotation}>
      {/* Main preview mesh */}
      <mesh>
        <boxGeometry args={[dimensions.width, dimensions.height, 0.1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Outline/Edge */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(dimensions.width, dimensions.height, 0.1)]} />
        <lineBasicMaterial color={color} linewidth={2} />
      </lineSegments>

      {/* Indicator ring at base (for doors) or center (for windows) */}
      <mesh
        position={[0, type === 'door' ? -dimensions.height / 2 : 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.1, 0.15, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Type indicator (small sphere) */}
      <mesh position={[0, 0, 0.1]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.0}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  )
}

