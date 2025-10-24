'use client'

import { useBuildingStore } from '@/lib/store/buildingStore'
import { Slider } from '@/components/ui/Slider'
import { Switch } from '@/components/ui/Switch'
import { Label } from '@/components/ui/Label'

export default function VisualizationPanel() {
  const isExplosionViewActive = useBuildingStore((state) => state.isExplosionViewActive)
  const setExplosionViewActive = useBuildingStore((state) => state.setExplosionViewActive)
  const explosionFactor = useBuildingStore((state) => state.explosionFactor)
  const setExplosionFactor = useBuildingStore((state) => state.setExplosionFactor)

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Visualisierung</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="explosion-toggle">Explosionsansicht</Label>
          <Switch
            id="explosion-toggle"
            checked={isExplosionViewActive}
            onCheckedChange={setExplosionViewActive}
          />
        </div>

        {isExplosionViewActive && (
          <div className="space-y-2">
            <Label htmlFor="explosion-slider">Stärke</Label>
            <Slider
              id="explosion-slider"
              min={0}
              max={1}
              step={0.01}
              value={[explosionFactor]}
              onValueChange={(value) => setExplosionFactor(value[0])}
            />
          </div>
        )}
      </div>
    </div>
  )
}
