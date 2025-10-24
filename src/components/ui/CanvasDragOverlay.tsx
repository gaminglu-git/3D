'use client'

import { useDragStateStore } from '@/lib/store/dragStateStore'

/**
 * Canvas Drag Overlay
 * Shows visual feedback during drag without blocking pointer events
 */
export default function CanvasDragOverlay() {
  const activeItem = useDragStateStore((state) => state.activeItem)
  const dragPosition = useDragStateStore((state) => state.dragPosition)

  if (!activeItem || !dragPosition) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {/* Instruction overlay */}
      <div className="absolute left-1/2 top-24 -translate-x-1/2 rounded-lg bg-primary-600/90 px-6 py-3 text-white shadow-2xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold">{activeItem.name} platzieren</p>
            <p className="text-sm text-white/80">Klicken zum Platzieren • ESC zum Abbrechen</p>
          </div>
        </div>
      </div>

      {/* Corner hint */}
      <div className="absolute bottom-8 right-8 rounded-lg bg-gray-900/80 px-4 py-2 text-sm text-white backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
          <span>Vorschau aktiv</span>
        </div>
      </div>
    </div>
  )
}
