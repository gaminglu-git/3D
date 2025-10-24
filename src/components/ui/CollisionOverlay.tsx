'use client'

import { useBuildingStore } from '@/lib/store/buildingStore'
import { useMemo } from 'react'
import { AlertTriangle } from 'lucide-react'

// 2D collision warning overlay (rendered outside Canvas)
export default function CollisionOverlay() {
  const collisions = useBuildingStore((state) => state.collisions)
  const selectedIds = useBuildingStore((state) => state.selectedElementIds)

  // Memoize collision count for performance
  const collisionCount = useMemo(() => {
    if (selectedIds.length === 0) return 0
    return collisions.filter(
      (c) => selectedIds.includes(c.elementAId) || selectedIds.includes(c.elementBId),
    ).length
  }, [collisions, selectedIds])

  if (collisionCount === 0) return null

  return (
    <div className="pointer-events-none fixed bottom-20 left-1/2 z-40 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-lg bg-red-500/90 px-4 py-2 text-white shadow-lg backdrop-blur-sm">
        <AlertTriangle className="h-5 w-5" />
        <span className="text-sm font-medium">
          Ungültige Überschneidung: {collisionCount} {collisionCount === 1 ? 'Objekt' : 'Objekte'}
        </span>
      </div>
    </div>
  )
}
