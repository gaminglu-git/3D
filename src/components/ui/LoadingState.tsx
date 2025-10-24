'use client'

import { useBuildingStore } from '@/lib/store/buildingStore'

interface LoadingStateProps {
  message?: string
}

export function LoadingState() {
  const isInitialized = useBuildingStore((state) => state.isInitialized)
  const building = useBuildingStore((state) => state.building)

  if (!isInitialized) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-xl">Initializing physics...</p>
      </div>
    )
  }

  if (!building) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-xl">Initializing building...</p>
      </div>
    )
  }

  return null
}

export function LoadingOverlay({ message = 'Verarbeite...' }: LoadingStateProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="rounded-xl bg-white p-8 shadow-2xl">
        <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        <p className="text-center font-medium text-gray-700">{message}</p>
      </div>
    </div>
  )
}
