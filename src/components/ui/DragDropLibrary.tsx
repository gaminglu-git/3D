'use client'

import { useState, useCallback } from 'react'
import { Square, DoorOpen, Square as WindowIcon, Home, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useDragStateStore } from '@/lib/store/dragStateStore'

type LibraryCategory = 'walls' | 'openings' | 'roofs'

interface LibraryItem {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  category: 'wall' | 'opening' | 'roof' | 'action'
  description: string
  priority: number
}

const libraryItems: LibraryItem[] = [
  {
    id: 'wall-standard',
    name: 'Standard Wand',
    icon: Square,
    category: 'wall',
    description: 'Standardwand 24cm',
    priority: 10,
  },
  {
    id: 'wall-load-bearing',
    name: 'Tragende Wand',
    icon: Square,
    category: 'wall',
    description: 'Tragende Wand 36cm',
    priority: 8,
  },
  {
    id: 'window-standard',
    name: 'Standard Fenster',
    icon: WindowIcon,
    category: 'opening',
    description: '120x140cm',
    priority: 10,
  },
  {
    id: 'door-standard',
    name: 'Standard Tür',
    icon: DoorOpen,
    category: 'opening',
    description: '90x210cm',
    priority: 9,
  },
  {
    id: 'roof-flat',
    name: 'Flachdach',
    icon: Home,
    category: 'roof',
    description: 'Flachdach',
    priority: 6,
  },
  {
    id: 'roof-gabled',
    name: 'Satteldach',
    icon: Home,
    category: 'roof',
    description: '35° Neigung',
    priority: 8,
  },
]

export default function DragDropLibrary() {
  const [expandedCategories, setExpandedCategories] = useState<Set<LibraryCategory>>(
    new Set(['walls', 'openings', 'roofs'])
  )

  const toggleCategory = (category: LibraryCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const categories: { id: LibraryCategory; label: string }[] = [
    { id: 'walls', label: 'Wände' },
    { id: 'openings', label: 'Fenster & Türen' },
    { id: 'roofs', label: 'Dächer' },
  ]

  const startDrag = useDragStateStore((state) => state.startDrag)
  const endDrag = useDragStateStore((state) => state.endDrag)

  const handleMouseDown = useCallback((e: React.MouseEvent, item: LibraryItem) => {
    e.preventDefault()

    // Start drag in store
    startDrag(item)

    // Change cursor
    document.body.style.cursor = 'grabbing'

    // Global mouse up handler to end drag
    const handleMouseUp = () => {
      document.body.style.cursor = ''
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mouseup', handleMouseUp)
  }, [startDrag])

  return (
    <div className="flex h-full w-80 flex-col rounded-lg bg-white shadow-xl">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-800">Bibliothek</h2>
        <p className="text-sm text-gray-500">Objekte per Drag & Drop platzieren</p>
      </div>

      {/* Library Content */}
      <div className="no-scrollbar flex-1 overflow-y-auto">
        {categories.map((category) => {
          const items = libraryItems.filter((item) => {
            if (category.id === 'walls') return item.category === 'wall'
            if (category.id === 'openings') return item.category === 'opening'
            if (category.id === 'roofs') return item.category === 'roof'
            return false
          })
          const isExpanded = expandedCategories.has(category.id)

          return (
            <div key={category.id} className="border-b border-gray-200">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
              >
                <span className="font-medium text-gray-700">{category.label}</span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {/* Category Items */}
              {isExpanded && (
                <div className="space-y-1 px-2 pb-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onMouseDown={(e) => handleMouseDown(e, item)}
                      className="flex cursor-grab items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all hover:border-primary-300 hover:bg-primary-50 active:cursor-grabbing"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white">
                        <item.icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer Tip */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
        <p className="text-xs text-gray-600">
          💡 Tipp: Objekte in die 3D-Ansicht ziehen zum Platzieren
        </p>
      </div>
    </div>
  )
}
