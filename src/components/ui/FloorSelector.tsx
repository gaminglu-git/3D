'use client'

import { useBuildingStore } from '@/lib/store/buildingStore'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

const FLOOR_NAMES = ['EG', 'OG 1', 'OG 2', 'OG 3', 'DG']

export default function FloorSelector() {
  const viewMode = useBuildingStore((state) => state.viewMode)
  const activeFloorLevel = useBuildingStore((state) => state.activeFloorLevel || 0)
  const setActiveFloorLevel = useBuildingStore((state) => state.setActiveFloorLevel)
  const [isOpen, setIsOpen] = useState(false)

  // Only show in 2D mode
  if (viewMode !== '2d') return null

  const currentFloorName = FLOOR_NAMES[activeFloorLevel] || `Ebene ${activeFloorLevel}`

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-colors hover:bg-gray-50"
      >
        <span>Ebene: {currentFloorName}</span>
        <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="absolute left-0 top-full z-10 mt-2 w-48 rounded-lg bg-white py-1 shadow-xl">
            {FLOOR_NAMES.map((name, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveFloorLevel(index)
                  setIsOpen(false)
                }}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-2 text-sm transition-colors',
                  index === activeFloorLevel
                    ? 'bg-primary-50 font-medium text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <span>{name}</span>
                {index === activeFloorLevel && <span className="text-xs text-primary-600">●</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
