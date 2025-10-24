'use client'

import { useEffect, useState } from 'react'
import { useBuildingStore } from '@/lib/store/buildingStore'
import { cn } from '@/lib/utils/cn'

import { X, Settings2, Palette, Wrench, Network, Eye } from 'lucide-react'

import StructurePanel from './StructurePanel'
import VisualizationPanel from './VisualizationPanel'
import PropertiesPanel from './PropertiesPanel'
import MaterialsPanel from './MaterialsPanel'
import ExpertPanel from './ExpertPanel'

type TabId = 'structure' | 'visualization' | 'properties' | 'materials' | 'expert'

export default function PropertiesSidebar() {
  const selectedIds = useBuildingStore((state) => state.selectedElementIds)
  const clearSelection = useBuildingStore((state) => state.clearSelection)
  const [activeTab, setActiveTab] = useState<TabId>('structure')
  const hasSelection = selectedIds.length > 0

  useEffect(() => {
    if (!hasSelection) {
      setActiveTab('structure')
    } else {
      if (activeTab === 'structure') {
        setActiveTab('properties')
      }
    }
  }, [hasSelection, activeTab])

  const tabs: {
    id: TabId
    label: string
    icon: React.ComponentType<{ className?: string }>
    show: 'always' | 'onSelection'
  }[] = [
    { id: 'structure', label: 'Struktur', icon: Network, show: 'always' }, // Corrected icon component
    { id: 'visualization', label: 'Visualisierung', icon: Eye, show: 'always' },
    { id: 'properties', label: 'Eigenschaften', icon: Settings2, show: 'onSelection' },
    { id: 'materials', label: 'Materialien', icon: Palette, show: 'onSelection' },
    { id: 'expert', label: 'Experte', icon: Wrench, show: 'onSelection' },
  ]

  const visibleTabs = tabs.filter((tab) => tab.show === 'always' || (tab.show === 'onSelection' && hasSelection))

  return (
    <div className="flex h-full w-96 flex-col rounded-lg bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-800">
          {hasSelection
            ? selectedIds.length === 1
              ? 'Objekt-Eigenschaften'
              : `${selectedIds.length} Objekte ausgewählt`
            : 'Gebäude-Explorer'}
        </h2>
        {hasSelection && (
          <button
            onClick={clearSelection}
            className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-600 hover:bg-gray-50',
            )}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="no-scrollbar flex-1 overflow-y-auto p-4">
        {activeTab === 'structure' && <StructurePanel />}
        {activeTab === 'visualization' && <VisualizationPanel />}
        {activeTab === 'properties' && hasSelection && <PropertiesPanel />}
        {activeTab === 'materials' && hasSelection && <MaterialsPanel />}
        {activeTab === 'expert' && hasSelection && <ExpertPanel />}
      </div>
    </div>
  )
} 