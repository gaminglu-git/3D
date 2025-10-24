'use client'

import { useState, useEffect } from 'react'
import { useDragStateStore } from '@/lib/store/dragStateStore'

/**
 * Debug Overlay for Drag & Drop System
 * Toggle with 'D' key
 */
export default function DragDebugOverlay() {
  const [visible, setVisible] = useState(false)
  const activeItem = useDragStateStore((state) => state.activeItem)
  const dragPosition = useDragStateStore((state) => state.dragPosition)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' && e.shiftKey) {
        setVisible((v) => !v)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  if (!visible) return null

  const isDragging = activeItem && dragPosition

  return (
    <div className="pointer-events-none absolute left-4 top-24 z-50 w-80 rounded-lg bg-black/90 p-4 font-mono text-xs text-green-400 shadow-2xl">
      <div className="mb-2 flex items-center justify-between border-b border-green-400/30 pb-2">
        <span className="font-bold">DRAG DEBUG</span>
        <span className="text-green-400/60">Shift+D to toggle</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-green-400/60">Dragging:</span>
          <span className={isDragging ? 'text-green-400' : 'text-red-400'}>
            {isDragging ? 'YES' : 'NO'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-green-400/60">Item:</span>
          <span className="max-w-[150px] truncate">
            {activeItem ? activeItem.name || activeItem.id : 'null'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-green-400/60">Mouse X:</span>
          <span>{mousePos.x}px</span>
        </div>

        <div className="flex justify-between">
          <span className="text-green-400/60">Mouse Y:</span>
          <span>{mousePos.y}px</span>
        </div>

        <div className="mt-3 border-t border-green-400/30 pt-2">
          <div className="text-green-400/60">Item Data:</div>
          <pre className="mt-1 max-h-32 overflow-auto text-[10px]">
            {activeItem ? JSON.stringify(activeItem, null, 2) : 'null'}
          </pre>
        </div>
      </div>
    </div>
  )
}
