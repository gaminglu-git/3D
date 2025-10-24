import { create } from 'zustand'
import * as THREE from 'three'
import { SuggestionItem } from '@/hooks/useContextualSuggestions'

interface DragState {
  activeItem: SuggestionItem | null
  dragPosition: THREE.Vector3 | null
  isValidDrop: boolean
  setActiveItem: (item: SuggestionItem | null) => void
  setDragPosition: (position: THREE.Vector3 | null) => void
  setIsValidDrop: (isValid: boolean) => void
  startDrag: (item: SuggestionItem) => void
  endDrag: () => void
  reset: () => void
}

export const useDragStateStore = create<DragState>((set) => ({
  activeItem: null,
  dragPosition: null,
  isValidDrop: false,
  setActiveItem: (item) => set({ activeItem: item }),
  setDragPosition: (position) => set({ dragPosition: position }),
  setIsValidDrop: (isValid) => set({ isValidDrop: isValid }),
  startDrag: (item) => set({ activeItem: item }),
  endDrag: () => set({ activeItem: null, dragPosition: null, isValidDrop: false }),
  reset: () => set({ activeItem: null, dragPosition: null, isValidDrop: false }),
}))




