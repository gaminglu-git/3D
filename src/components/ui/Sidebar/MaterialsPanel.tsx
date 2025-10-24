'use client'

import { useBuildingStore } from '@/lib/store/buildingStore'
import { getMaterialsByCategory } from '@/lib/constants/materials'
import { isWall, isFloorElement, isRoofElement } from '@/lib/types/building'
import { cn } from '@/lib/utils/cn'

export default function MaterialsPanel() {
  const selectedIds = useBuildingStore((state) => state.selectedElementIds)
  const building = useBuildingStore((state) => state.building)
  const updateElement = useBuildingStore((state) => state.updateElement)
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

  let category: 'wall' | 'floor' | 'roof' | null = null
  let currentMaterialId: string | null = null

  if (isWall(selectedElement)) {
    category = 'wall'
    currentMaterialId = selectedElement.materialId
  } else if (isFloorElement(selectedElement)) {
    category = 'floor'
    currentMaterialId = selectedElement.materialId
  } else if (isRoofElement(selectedElement)) {
    category = 'roof'
    currentMaterialId = selectedElement.materialId
  }

  if (!category) {
    return (
      <div className="text-center text-gray-500">
        <p>Keine Materialien für diesen Objekttyp</p>
      </div>
    )
  }

  const availableMaterials = getMaterialsByCategory(category)
  const currentMaterial = currentMaterialId ? getMaterial(currentMaterialId) : null

  const handleMaterialSelect = (materialId: string) => {
    updateElement(selectedElement.id, { materialId } as any)
  }

  return (
    <div className="space-y-4">
      {/* Current Material */}
      {currentMaterial && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-2 text-sm font-medium text-gray-700">Aktuelles Material</h3>
          <div className="flex items-center gap-3">
            {currentMaterial.visual.texture ? (
              <div
                className="h-12 w-12 rounded-lg border border-gray-300 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${currentMaterial.visual.texture})`,
                  backgroundColor: currentMaterial.visual.color,
                }}
              />
            ) : (
              <div
                className="h-12 w-12 rounded-lg border border-gray-300"
                style={{ backgroundColor: currentMaterial.visual.color }}
              />
            )}
            <div>
              <p className="font-medium text-gray-800">{currentMaterial.name}</p>
              <p className="text-xs text-gray-500">λ: {currentMaterial.physical.lambda} W/(m·K)</p>
            </div>
          </div>
        </div>
      )}

      {/* Available Materials */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-700">Verfügbare Materialien</h3>
        <div className="space-y-2">
          {availableMaterials.map((material) => (
            <button
              key={material.id}
              onClick={() => handleMaterialSelect(material.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all',
                material.id === currentMaterialId
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              {material.visual.texture ? (
                <div
                  className="h-10 w-10 rounded-lg border border-gray-300 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${material.visual.texture})`,
                    backgroundColor: material.visual.color,
                  }}
                />
              ) : (
                <div
                  className="h-10 w-10 rounded-lg border border-gray-300"
                  style={{ backgroundColor: material.visual.color }}
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{material.name}</p>
                <p className="text-xs text-gray-500">
                  λ: {material.physical.lambda} W/(m·K) · ρ: {material.physical.density} kg/m³
                </p>
              </div>
              {material.cost && (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{material.cost} €/m²</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
