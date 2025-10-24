'use client'

import { useBuildingStore } from '@/lib/store/buildingStore'
import { isWall } from '@/lib/types/building'
import { calculateUValue } from '@/lib/types/materials'
import { Thermometer, Weight, Layers } from 'lucide-react'

export default function ExpertPanel() {
  const selectedIds = useBuildingStore((state) => state.selectedElementIds)
  const building = useBuildingStore((state) => state.building)
  const isExpertMode = useBuildingStore((state) => state.isExpertMode)
  const setExpertMode = useBuildingStore((state) => state.setExpertMode)
  const getMaterial = useBuildingStore((state) => state.getMaterial)

  if (selectedIds.length === 0 || !building) {
    return (
      <div className="text-center text-gray-500">
        <p>Kein Objekt ausgewählt</p>
      </div>
    )
  }

  const selectedElement = building.elements.find((e) => e.id === selectedIds[0])

  if (!selectedElement) {
    return null
  }

  let material = null

  if (isWall(selectedElement)) {
    material = getMaterial(selectedElement.materialId)
  }

  if (!material) {
    return (
      <div className="text-center text-gray-500">
        <p>Keine Expertendaten verfügbar</p>
      </div>
    )
  }

  const uValue = calculateUValue(material)

  return (
    <div className="space-y-4">
      {/* Expert Mode Toggle */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <label className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Expertenmodus</span>
          <input
            type="checkbox"
            checked={isExpertMode}
            onChange={(e) => setExpertMode(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        </label>
        <p className="mt-1 text-xs text-gray-500">
          Zeigt erweiterte physikalische Eigenschaften an
        </p>
      </div>

      {/* Physical Properties */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Physikalische Eigenschaften</h3>

        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Thermometer className="h-4 w-4" />
            <span className="text-sm font-medium">Wärmeleitfähigkeit (λ)</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-gray-800">
            {material.physical.lambda} W/(m·K)
          </p>
          <p className="text-xs text-gray-500">Je niedriger, desto besser die Dämmung</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Weight className="h-4 w-4" />
            <span className="text-sm font-medium">Dichte (ρ)</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-gray-800">
            {material.physical.density} kg/m³
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Thermometer className="h-4 w-4" />
            <span className="text-sm font-medium">Spez. Wärmekapazität (c)</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-gray-800">
            {material.physical.heatCapacity} J/(kg·K)
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Layers className="h-4 w-4" />
            <span className="text-sm font-medium">Dicke</span>
          </div>
          <p className="mt-1 text-lg font-semibold text-gray-800">
            {material.physical.thickness} m
          </p>
        </div>
      </div>

      {/* Calculated Values */}
      <div className="rounded-lg border-2 border-primary-200 bg-primary-50 p-4">
        <h3 className="mb-2 text-sm font-medium text-primary-900">Berechneter U-Wert</h3>
        <p className="text-2xl font-bold text-primary-700">{uValue.toFixed(3)} W/(m²·K)</p>
        <p className="mt-1 text-xs text-primary-600">
          {uValue < 0.2
            ? 'Exzellente Dämmung'
            : uValue < 0.4
              ? 'Gute Dämmung'
              : uValue < 1.0
                ? 'Durchschnittliche Dämmung'
                : 'Verbesserungsbedarf'}
        </p>
      </div>

      {isExpertMode && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs text-amber-800">
            ℹ️ Im Expertenmodus können Sie zukünftig mehrschichtige Konstruktionen definieren und
            Custom Materials erstellen.
          </p>
        </div>
      )}
    </div>
  )
}
