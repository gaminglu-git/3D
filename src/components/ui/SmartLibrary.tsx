'use client'

import { useState, useCallback } from 'react'
import {
  Square,
  DoorOpen,
  Home,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Copy,
  Minimize2,
  Maximize2,
} from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import { cn } from '@/lib/utils/cn'
import { useContextualSuggestions, SuggestionItem } from '@/hooks/useContextualSuggestions'
import { useDragStateStore } from '@/lib/store/dragStateStore'
import { useBuildingStore } from '@/lib/store/buildingStore'

interface DraggableItemProps {
  item: SuggestionItem
  children: React.ReactNode
}

function DraggableItem({ item, children }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    data: item, // Pass the whole item data
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={cn(
        'flex items-center gap-3 rounded-lg border p-3 transition-all',
        'cursor-grab border-gray-200 bg-gray-50 hover:border-primary-300 hover:bg-primary-50 active:cursor-grabbing',
      )}
    >
      {children}
    </div>
  )
}

export default function SmartLibrary() {
  const suggestions = useContextualSuggestions()
  const selectedIds = useBuildingStore((state) => state.selectedElementIds)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Get icon for suggestion
  const getIcon = (category: string) => {
    switch (category) {
      case 'wall':
        return Square
      case 'opening':
        return DoorOpen
      case 'roof':
        return Home
      case 'action':
        return Copy
      default:
        return Square
    }
  }

  const startDrag = useDragStateStore((state) => state.startDrag)
  const endDrag = useDragStateStore((state) => state.endDrag)

  const handleMouseDown = useCallback((e: React.MouseEvent, item: any) => {
    e.preventDefault()

    // Start drag in store
    startDrag(item)

    // Change cursor
    document.body.style.cursor = 'grabbing'

    // Global mouse up handler to end drag
    const handleMouseUp = () => {
      document.body.style.cursor = ''
      window.removeEventListener('mouseup', handleMouseUp)
      // endDrag will be called by DropZone3D on successful drop
      // or by ESC key handler
    }

    window.addEventListener('mouseup', handleMouseUp)
  }, [startDrag])

  // Sort by priority
  const sortedSuggestions = [...suggestions].sort((a, b) => b.priority - a.priority)

  if (isMinimized) {
    return (
      <div className="rounded-lg bg-white shadow-xl">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-3 transition-colors hover:bg-gray-50"
        >
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <span className="text-sm font-semibold text-gray-800">Bibliothek</span>
          <Maximize2 className="ml-auto h-4 w-4 text-gray-500" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full w-80 flex-col rounded-lg bg-white shadow-xl">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800">Smart Bibliothek</h2>
            <p className="text-xs text-gray-500">
              {selectedIds.length === 0
                ? 'Basis-Elemente'
                : selectedIds.length === 1
                  ? 'Vorschläge für Auswahl'
                  : `${selectedIds.length} Elemente - Aktionen`}
            </p>
          </div>
          <button
            onClick={() => setIsMinimized(true)}
            className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100"
            title="Minimieren"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Hot Picks Section */}
      <div className="no-scrollbar flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">🔥 Hot Picks</h3>
            {selectedIds.length > 0 && (
              <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                Kontextuell
              </span>
            )}
          </div>

          <div className="space-y-2">
            {sortedSuggestions.slice(0, 6).map((item) => {
              const Icon = getIcon(item.category)
              const isAction = item.category === 'action'

              const content = (
                <>
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-md',
                      isAction ? 'bg-amber-200' : 'bg-white',
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-6 w-6',
                        isAction ? 'text-amber-700' : 'text-primary-600',
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  {!isAction && <div className="text-xs text-gray-400">Ziehen</div>}
                </>
              )

              if (isAction) {
                return (
                  <div
                    key={item.id}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border p-3 transition-all',
                      'cursor-pointer border-amber-200 bg-amber-50 hover:bg-amber-100',
                    )}
                  >
                    {content}
                  </div>
                )
              }

              return (
                <DraggableItem key={item.id} item={item}>
                  {content}
                </DraggableItem>
              )
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Show All Toggle */}
        <button
          onClick={() => setShowAllCategories(!showAllCategories)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          <span>Alle Kategorien</span>
          {showAllCategories ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {showAllCategories && (
          <div className="border-t border-gray-200 p-4">
            <p className="text-sm text-gray-500">Alle Kategorien anzeigen (coming soon)</p>
          </div>
        )}
      </div>

      {/* Footer Tip */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
        <p className="text-xs text-gray-600">💡 Tipp: Die Bibliothek passt sich Ihrer Auswahl an</p>
      </div>
    </div>
  )
}
