export type MaterialCategory = 'wall' | 'roof' | 'floor' | 'insulation' | 'window' | 'door'

export interface VisualProperties {
  color: string
  texture?: string
  normalMap?: string
  roughnessMap?: string
  metalnessMap?: string
  roughness: number
  metalness: number
  opacity?: number
}

export interface PhysicalProperties {
  density: number // kg/m³
  lambda: number // W/(m·K) - Thermal conductivity
  heatCapacity: number // J/(kg·K) - Specific heat capacity
  thickness: number // m - Default thickness
}

export interface Material {
  id: string
  name: string
  category: MaterialCategory
  visual: VisualProperties
  physical: PhysicalProperties
  cost?: number // €/m² - for future marketplace
  description?: string
}

export interface MaterialLayer {
  materialId: string
  thickness: number // m
  order: number // Layer order from inside to outside
}

/**
 * Calculate U-value (thermal transmittance) for a single material
 * U = λ / d
 * where λ is thermal conductivity and d is thickness
 */
export function calculateUValue(material: Material): number {
  return material.physical.lambda / material.physical.thickness
}

/**
 * Calculate U-value for multiple layers
 * U = 1 / (Rsi + R1 + R2 + ... + Rn + Rse)
 * where R = d / λ for each layer
 */
export function calculateLayeredUValue(
  layers: MaterialLayer[],
  materials: Map<string, Material>
): number {
  const Rsi = 0.13 // m²K/W - Internal surface resistance
  const Rse = 0.04 // m²K/W - External surface resistance

  let totalR = Rsi + Rse

  layers.forEach((layer) => {
    const material = materials.get(layer.materialId)
    if (material) {
      const R = layer.thickness / material.physical.lambda
      totalR += R
    }
  })

  return 1 / totalR
}
