'use client'

import { useBuildingStore } from '@/lib/store/buildingStore'
import { isWall, isFloor, isRoof } from '@/lib/types/building'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'

const wallSchema = z.object({
  length: z.number().min(0.5).max(50),
  height: z.number().min(2).max(6),
  thickness: z.number().min(0.1).max(1),
})

export default function PropertiesPanel() {
  const selectedIds = useBuildingStore((state) => state.selectedElementIds)
  const building = useBuildingStore((state) => state.building)
  const updateElement = useBuildingStore((state) => state.updateElement)

  if (selectedIds.length === 0 || !building) {
    return (
      <div className="text-center text-gray-500">
        <p>Kein Objekt ausgewählt</p>
      </div>
    )
  }

  const selectedElement = building.elements.find((e) => e.id === selectedIds[0])

  if (!selectedElement) {
    return (
      <div className="text-center text-gray-500">
        <p>Objekt nicht gefunden</p>
      </div>
    )
  }

  if (isWall(selectedElement)) {
    return <WallProperties wall={selectedElement} onUpdate={updateElement} />
  }

  return (
    <div className="text-center text-gray-500">
      <p>Eigenschaften für diesen Objekttyp noch nicht verfügbar</p>
    </div>
  )
}

function WallProperties({ wall, onUpdate }: { wall: any; onUpdate: any }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(wallSchema),
    defaultValues: {
      length: wall.length,
      height: wall.height,
      thickness: wall.thickness,
    },
  })

  useEffect(() => {
    reset({
      length: wall.length,
      height: wall.height,
      thickness: wall.thickness,
    })
  }, [wall, reset])

  const onSubmit = (data: z.infer<typeof wallSchema>) => {
    onUpdate(wall.id, data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Länge (m)</label>
        <input
          type="number"
          step="0.1"
          {...register('length', { valueAsNumber: true })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        {errors.length && (
          <p className="mt-1 text-xs text-red-500">{String(errors.length.message)}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Höhe (m)</label>
        <input
          type="number"
          step="0.1"
          {...register('height', { valueAsNumber: true })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        {errors.height && (
          <p className="mt-1 text-xs text-red-500">{String(errors.height.message)}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Dicke (m)</label>
        <input
          type="number"
          step="0.01"
          {...register('thickness', { valueAsNumber: true })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        {errors.thickness && (
          <p className="mt-1 text-xs text-red-500">{String(errors.thickness.message)}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
      >
        Übernehmen
      </button>
    </form>
  )
}
