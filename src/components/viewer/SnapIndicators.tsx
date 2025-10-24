'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SnapPoint } from '@/lib/types/building'

interface SnapIndicatorsProps {
  snapPoints: SnapPoint[]
  activeSnapPoint?: SnapPoint | null
}

export default function SnapIndicators({ snapPoints, activeSnapPoint }: SnapIndicatorsProps) {
  return (
    <group>
      {/* Regular snap point indicators */}
      {snapPoints.map((snap, index) => (
        <SnapPointMarker
          key={`${snap.elementId}-${index}`}
          position={snap.position}
          type={snap.type}
          isActive={false}
        />
      ))}

      {/* Active snap point (larger and pulsing) */}
      {activeSnapPoint && (
        <SnapPointMarker
          position={activeSnapPoint.position}
          type={activeSnapPoint.type}
          isActive={true}
        />
      )}
    </group>
  )
}

interface SnapPointMarkerProps {
  position: { x: number; y: number; z: number }
  type: 'wall-endpoint' | 'wall-midpoint' | 'grid' | 'angle-guide'
  isActive: boolean
}

function SnapPointMarker({ position, type, isActive }: SnapPointMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  // Pulsing animation for active snap points
  useFrame((state) => {
    if (isActive && meshRef.current && materialRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.2
      meshRef.current.scale.setScalar(scale)

      // Pulse emissive intensity
      const intensity = 0.8 + Math.sin(state.clock.elapsedTime * 4) * 0.4
      materialRef.current.emissiveIntensity = intensity
    }
  })

  // Color based on type
  let color: string
  let emissive: string
  let size: number

  switch (type) {
    case 'wall-endpoint':
      color = isActive ? '#10b981' : '#3b82f6' // Green if active, blue otherwise
      emissive = isActive ? '#10b981' : '#3b82f6'
      size = isActive ? 0.25 : 0.15
      break
    case 'wall-midpoint':
      color = '#8b5cf6' // Purple
      emissive = '#8b5cf6'
      size = isActive ? 0.2 : 0.12
      break
    case 'angle-guide':
      color = '#22c55e' // Green
      emissive = '#22c55e'
      size = isActive ? 0.15 : 0.1
      break
    case 'grid':
      color = '#6b7280' // Gray
      emissive = '#6b7280'
      size = isActive ? 0.15 : 0.08
      break
  }

  return (
    <mesh ref={meshRef} position={[position.x, 0.1, position.z]}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={emissive}
        emissiveIntensity={isActive ? 1.0 : 0.6}
        transparent
        opacity={isActive ? 0.95 : 0.7}
      />
    </mesh>
  )
}

// Component for angle guide lines
interface AngleGuideLinesProps {
  startPoint: { x: number; y: number; z: number }
  guides: SnapPoint[]
}

export function AngleGuideLines({ startPoint, guides }: AngleGuideLinesProps) {
  return (
    <group>
      {guides.map((guide, index) => {
        if (!guide.normal) return null

        const points = [
          new THREE.Vector3(startPoint.x, 0.02, startPoint.z),
          new THREE.Vector3(
            startPoint.x + guide.normal.x * 10,
            0.02,
            startPoint.z + guide.normal.z * 10
          ),
        ]

        const geometry = new THREE.BufferGeometry().setFromPoints(points)

        return (
          <primitive key={`guide-${index}`} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: "#22c55e", transparent: true, opacity: 0.4 }))} />
        )
      })}
    </group>
  )
}
