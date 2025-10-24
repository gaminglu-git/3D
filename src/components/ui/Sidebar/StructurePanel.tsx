'use client'

import { useBuildingStore } from '@/lib/store/buildingStore'
import { BuildingElement, isWall, Wall } from '@/lib/types/building'
import { cn } from '@/lib/utils/cn'
import { useState } from 'react'

import { DoorOpen, Building, Minus, Plus, Square } from 'lucide-react'

const getElementIcon = (type: string) => {
  switch (type) {
    case 'wall':
      return <Minus className='h-4 w-4 rotate-90' />
    case 'door':
      return <DoorOpen className='h-4 w-4' />
    case 'window':
      return <Square className='h-4 w-4' />
    default:
      return <Building className='h-4 w-4' />
  }
}

const ElementNode = ({
  element,
  selectedIds,
  onSelect,
}: {
  element: BuildingElement
  selectedIds: string[]
  onSelect: (id: string) => void
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const isSelected = selectedIds.includes(element.id)

  const hasChildren = isWall(element) && element.openings && element.openings.length > 0

  return (
    <div>
      <div
        onClick={() => onSelect(element.id)}
        className={cn(
          'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
          isSelected ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100',
        )}
      >
        {hasChildren ? (
          <button onClick={() => setIsExpanded(!isExpanded)} className='p-0.5'>
            {isExpanded ? <Minus className='h-3 w-3' /> : <Plus className='h-3 w-3' />}
          </button>
        ) : (
          <div className='w-4' /> // Placeholder for alignment
        )}
        {getElementIcon(element.type)}
        <span>{`${element.type} #${element.id.slice(0, 4)}`}</span>
      </div>
      {hasChildren && isExpanded && (
        <div className="pl-6">
          {(element as Wall).openings.map((opening) => (
            <ElementNode
              key={opening.id}
              element={opening}
              selectedIds={selectedIds}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function StructurePanel() {
  const building = useBuildingStore((state) => state.building)
  const selectedIds = useBuildingStore((state) => state.selectedElementIds)
  const selectElement = useBuildingStore((state) => state.selectElement)

  if (!building) {
    return <div className="p-4 text-sm text-gray-500">Kein Gebäude geladen.</div>
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-800">Gebäudestruktur</h3>
      {building.elements.map((element) => (
        <ElementNode
          key={element.id}
          element={element}
          selectedIds={selectedIds}
          onSelect={selectElement}
        />
      ))}
    </div>
  )
}
