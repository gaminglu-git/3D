'use client'

import { useBuildingStore } from '@/lib/store/buildingStore'
import { Link2, X, Layers } from 'lucide-react'
import { isWall, Wall } from '@/lib/types/building'
import * as THREE from 'three'

// Helper function moved from deleted connections.ts
function canMergeWalls(wallA: Wall, wallB: Wall): boolean {
  // 1. Check for collinearity (must be almost parallel)
  const angleA = wallA.rotation.y
  const angleB = wallB.rotation.y
  const angleDiff = Math.abs(angleA - angleB) % Math.PI
  const areParallel = angleDiff < 0.01 || Math.abs(angleDiff - Math.PI) < 0.01

  if (!areParallel) return false

  // 2. Check for overlap or adjacency
  const posA = new THREE.Vector3(wallA.position.x, 0, wallA.position.z)
  const posB = new THREE.Vector3(wallB.position.x, 0, wallB.position.z)
  const dirA = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), -wallA.rotation.y)

  const halfLengthA = wallA.length / 2
  const halfLengthB = wallB.length / 2

  const startA = posA.clone().sub(dirA.clone().multiplyScalar(halfLengthA))
  const endA = posA.clone().add(dirA.clone().multiplyScalar(halfLengthA))
  const startB = posB.clone().sub(dirA.clone().multiplyScalar(halfLengthB))
  const endB = posB.clone().add(dirA.clone().multiplyScalar(halfLengthB))

  // Check if endpoints are very close
  const touchDistance = 0.01
  return (
    startA.distanceTo(endB) < touchDistance ||
    endA.distanceTo(startB) < touchDistance
  )
}

export default function ConnectionPromptDialog() {
  const connectionPrompt = useBuildingStore((state) => state.connectionPrompt)
  const hideConnectionPrompt = useBuildingStore((state) => state.hideConnectionPrompt)
  const mergeElements = useBuildingStore((state) => state.mergeElements)
  const connectElements = useBuildingStore((state) => state.connectElements)

  if (!connectionPrompt) return null

  const { elementA, elementB } = connectionPrompt

  // Check if elements can be merged
  const canMerge = isWall(elementA) && isWall(elementB) && canMergeWalls(elementA, elementB)

  const handleMerge = () => {
    mergeElements(elementA.id, elementB.id)
  }

  const handleConnect = () => {
    connectElements(elementA.id, elementB.id)
  }

  const handleSeparate = () => {
    hideConnectionPrompt()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <button
          onClick={handleSeparate}
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <Link2 className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Objekte verbinden?</h2>
          </div>
          <p className="text-sm text-gray-600">
            Die platzierten Objekte befinden sich in der Nähe. Möchten Sie sie verbinden?
          </p>
        </div>

        {/* Element Info */}
        <div className="mb-6 space-y-2 rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Typ:</span>
            <span className="text-gray-900">
              {elementA.type === 'wall' && 'Wand'}
              {elementA.type === 'floor' && 'Boden'}
              {elementA.type === 'roof' && 'Dach'}
            </span>
          </div>
          {canMerge && (
            <div className="mt-2 flex items-center gap-2 rounded-md bg-green-50 p-2 text-xs text-green-700">
              <Layers className="h-4 w-4" />
              <span>Diese Wände können zu einer Wand zusammengeführt werden</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {canMerge && (
            <button
              onClick={handleMerge}
              className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-700"
            >
              <Layers className="h-5 w-5" />
              Zusammenführen
            </button>
          )}
          <button
            onClick={handleConnect}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Link2 className="h-5 w-5" />
            Verbinden
          </button>
          <button
            onClick={handleSeparate}
            className="rounded-lg border-2 border-gray-300 px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Getrennt lassen
          </button>
        </div>

        {/* Info Text */}
        <div className="mt-4 text-xs text-gray-500">
          <p>
            <strong>Zusammenführen:</strong> Kombiniert kollineare Wände zu einer Wand
          </p>
          <p className="mt-1">
            <strong>Verbinden:</strong> Markiert Wände als verbunden (für T-Verbindungen oder Ecken)
          </p>
        </div>
      </div>
    </div>
  )
}
