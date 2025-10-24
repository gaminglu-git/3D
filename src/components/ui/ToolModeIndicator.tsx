'use client'

import { useBuildingStore } from '@/lib/store/buildingStore'
import { MousePointer2, Square, Home, Info } from 'lucide-react'

export default function ToolModeIndicator() {
  const tool = useBuildingStore((state) => state.tool)

  if (!tool || tool === 'select') return null

  const toolInfo = {
    wall: {
      icon: Square,
      title: 'Wand-Tool aktiv',
      description: 'Klicken Sie zweimal, um Start- und Endpunkt zu setzen',
      color: 'bg-blue-500',
    },
    roof: {
      icon: Home,
      title: 'Dach-Tool aktiv',
      description: 'Klicken Sie zweimal, um die Dachfläche zu definieren',
      color: 'bg-amber-500',
    },
    window: {
      icon: Square,
      title: 'Fenster-Tool aktiv',
      description: 'Klicken Sie auf eine Wand, um ein Fenster zu platzieren',
      color: 'bg-cyan-500',
    },
    door: {
      icon: Square,
      title: 'Tür-Tool aktiv',
      description: 'Klicken Sie auf eine Wand, um eine Tür zu platzieren',
      color: 'bg-green-500',
    },
  }

  const currentTool = toolInfo[tool as keyof typeof toolInfo]
  if (!currentTool) return null

  const Icon = currentTool.icon

  return (
    <div className="pointer-events-none absolute left-1/2 top-24 z-20 -translate-x-1/2">
      <div className="pointer-events-auto flex items-center gap-3 rounded-lg bg-white/95 px-4 py-3 shadow-xl backdrop-blur-sm">
        <div className={`rounded-lg ${currentTool.color} p-2`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{currentTool.title}</p>
          <p className="text-xs text-gray-600">{currentTool.description}</p>
        </div>
        <button
          onClick={() => useBuildingStore.setState({ tool: 'select' })}
          className="ml-2 rounded-lg px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
        >
          Abbrechen (V)
        </button>
      </div>
    </div>
  )
}
