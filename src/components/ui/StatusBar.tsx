'use client'

import { useBuildingStore } from '@/lib/store/buildingStore'
import { Eye, Layers, Box, Info } from 'lucide-react'
import { useState } from 'react'
import HelpOverlay from './HelpOverlay'

export default function StatusBar() {
  const building = useBuildingStore((state) => state.building)
  const selectedIds = useBuildingStore((state) => state.selectedElementIds)
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  if (!building) return null

  const wallCount = building.elements.filter((e) => e.type === 'wall').length

  return (
    <>
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
        <div className="pointer-events-auto flex items-center gap-4 rounded-lg bg-white/90 px-4 py-2 text-sm shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700">
              <span className="font-medium">{wallCount}</span> Wände
            </span>
          </div>

          <div className="h-4 w-px bg-gray-300" />

          <div className="flex items-center gap-2">
            <Box className="h-4 w-4 text-gray-600" />
            <span className="text-gray-700">
              <span className="font-medium">{building.elements.length}</span> Elemente
            </span>
          </div>

          {selectedIds.length > 0 && (
            <>
              <div className="h-4 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary-600" />
                <span className="text-primary-700">
                  <span className="font-medium">{selectedIds.length}</span> ausgewählt
                </span>
              </div>
            </>
          )}

          <div className="h-4 w-px bg-gray-300" />

          <button
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-2 rounded-md p-1 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800"
            title="Hilfe und Tastenkürzel anzeigen"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>
      <HelpOverlay isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  )
}
