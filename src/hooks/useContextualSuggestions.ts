import { useMemo } from 'react'
import { useBuildingStore } from '@/lib/store/buildingStore'
import { isWall, isFloorElement, isRoofElement } from '@/lib/types/building'

export interface SuggestionItem {
  id: string
  name: string
  description: string
  category: 'wall' | 'opening' | 'roof' | 'action'
  priority: number
}

/**
 * Hook that provides contextual suggestions based on current selection
 */
export function useContextualSuggestions(): SuggestionItem[] {
  const selectedIds = useBuildingStore((state) => state.selectedElementIds)
  const building = useBuildingStore((state) => state.building)

  return useMemo(() => {
    if (!building) return getBaseSuggestions()

    // No selection - show base building blocks
    if (selectedIds.length === 0) {
      return getBaseSuggestions()
    }

    // Multi-selection - show batch actions
    if (selectedIds.length > 1) {
      return getMultiSelectActions()
    }

    // Single selection - show contextual suggestions
    const selectedElement = building.elements.find((e) => e.id === selectedIds[0])
    if (!selectedElement) return getBaseSuggestions()

    if (isWall(selectedElement)) {
      return getWallSuggestions()
    }

    if (isRoofElement(selectedElement)) {
      return getRoofSuggestions()
    }

    if (isFloorElement(selectedElement)) {
      return getFloorSuggestions()
    }

    return getBaseSuggestions()
  }, [selectedIds, building])
}

function getBaseSuggestions(): SuggestionItem[] {
  return [
    {
      id: 'wall-standard',
      name: 'Standard Wand',
      description: 'Wand hinzufügen',
      category: 'wall',
      priority: 10,
    },
    {
      id: 'wall-load-bearing',
      name: 'Tragende Wand',
      description: '36cm Dicke',
      category: 'wall',
      priority: 8,
    },
    {
      id: 'roof-flat',
      name: 'Flachdach',
      description: 'Dach hinzufügen',
      category: 'roof',
      priority: 6,
    },
  ]
}

function getWallSuggestions(): SuggestionItem[] {
  return [
    {
      id: 'window-standard',
      name: 'Standard Fenster',
      description: 'Fenster in Wand',
      category: 'opening',
      priority: 10,
    },
    {
      id: 'door-standard',
      name: 'Standard Tür',
      description: 'Tür in Wand',
      category: 'opening',
      priority: 9,
    },
    {
      id: 'window-large',
      name: 'Großes Fenster',
      description: '180x140cm',
      category: 'opening',
      priority: 7,
    },
    {
      id: 'action-duplicate',
      name: 'Wand duplizieren',
      description: 'Kopie erstellen',
      category: 'action',
      priority: 8,
    },
  ]
}

function getRoofSuggestions(): SuggestionItem[] {
  return [
    {
      id: 'window-roof',
      name: 'Dachfenster',
      description: 'Fenster im Dach',
      category: 'opening',
      priority: 10,
    },
    {
      id: 'roof-gabled',
      name: 'Satteldach',
      description: 'Dachform ändern',
      category: 'roof',
      priority: 8,
    },
    {
      id: 'action-duplicate',
      name: 'Dach duplizieren',
      description: 'Kopie erstellen',
      category: 'action',
      priority: 6,
    },
  ]
}

function getFloorSuggestions(): SuggestionItem[] {
  return [
    {
      id: 'wall-standard',
      name: 'Wand hinzufügen',
      description: 'Auf dieser Ebene',
      category: 'wall',
      priority: 10,
    },
  ]
}

function getMultiSelectActions(): SuggestionItem[] {
  return [
    {
      id: 'action-align',
      name: 'Ausrichten',
      description: 'Elemente ausrichten',
      category: 'action',
      priority: 10,
    },
    {
      id: 'action-distribute',
      name: 'Verteilen',
      description: 'Gleichmäßig verteilen',
      category: 'action',
      priority: 9,
    },
    {
      id: 'action-group',
      name: 'Gruppieren',
      description: 'Als Gruppe',
      category: 'action',
      priority: 8,
    },
  ]
}
