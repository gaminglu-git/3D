'use client'

import { useBuildingStore } from '@/lib/store/buildingStore'
import { useThree } from '@react-three/fiber'
import { useState, useEffect } from 'react'
import { Move, RotateCw } from 'lucide-react'
import * as THREE from 'three'

interface TransformInfo {
  position: { x: number; y: number; z: number }
  deltaDistance?: number
  angle?: number
}

export default function TransformFeedback() {
  const selectedIds = useBuildingStore((state) => state.selectedElementIds)
  const building = useBuildingStore((state) => state.building)
  const tool = useBuildingStore((state) => state.tool)
  const [transformInfo, setTransformInfo] = useState<TransformInfo | null>(null)

  // Listen for transform events from the store
  // In a real implementation, we'd need to track transform state
  // For now, we'll show info when an element is selected and being moved

  if (tool !== 'select' || selectedIds.length !== 1 || !building) {
    return null
  }

  const selectedElement = building.elements.find((e) => e.id === selectedIds[0])
  if (!selectedElement || !transformInfo) return null

  return (
    <div className="pointer-events-none fixed left-1/2 top-20 z-40 -translate-x-1/2">
      <div className="rounded-lg bg-gray-900/90 px-4 py-3 text-white shadow-2xl backdrop-blur-sm">
        <div className="flex items-center gap-4">
          {/* Position */}
          <div className="flex items-center gap-2">
            <Move className="h-4 w-4 text-blue-400" />
            <div className="text-sm">
              <span className="font-mono">X: {transformInfo.position.x.toFixed(2)}m</span>
              <span className="mx-2 text-gray-500">|</span>
              <span className="font-mono">Z: {transformInfo.position.z.toFixed(2)}m</span>
            </div>
          </div>

          {/* Delta Distance */}
          {transformInfo.deltaDistance !== undefined && (
            <>
              <div className="h-4 w-px bg-gray-600" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-green-400">Δ</span>
                <span className="font-mono text-sm">{transformInfo.deltaDistance.toFixed(2)}m</span>
              </div>
            </>
          )}

          {/* Angle */}
          {transformInfo.angle !== undefined && (
            <>
              <div className="h-4 w-px bg-gray-600" />
              <div className="flex items-center gap-2">
                <RotateCw className="h-4 w-4 text-purple-400" />
                <span className="font-mono text-sm">{transformInfo.angle.toFixed(1)}°</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Hook to track transform state (to be integrated with EnhancedTransformControls)
export function useTransformTracking() {
  const [isTransforming, setIsTransforming] = useState(false)
  const [startPosition, setStartPosition] = useState<THREE.Vector3 | null>(null)
  const [currentPosition, setCurrentPosition] = useState<THREE.Vector3 | null>(null)
  const [deltaDistance, setDeltaDistance] = useState<number>(0)

  useEffect(() => {
    if (startPosition && currentPosition) {
      const distance = startPosition.distanceTo(currentPosition)
      setDeltaDistance(distance)
    }
  }, [startPosition, currentPosition])

  return {
    isTransforming,
    startPosition,
    currentPosition,
    deltaDistance,
    startTransform: (pos: THREE.Vector3) => {
      setIsTransforming(true)
      setStartPosition(pos.clone())
      setCurrentPosition(pos.clone())
    },
    updateTransform: (pos: THREE.Vector3) => {
      setCurrentPosition(pos.clone())
    },
    endTransform: () => {
      setIsTransforming(false)
      setStartPosition(null)
      setCurrentPosition(null)
      setDeltaDistance(0)
    },
  }
}
