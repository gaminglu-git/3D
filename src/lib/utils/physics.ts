import { Material } from '../types/materials'

/**
 * Calculate thermal resistance (R-value) for a material
 * R = d / λ
 * where d is thickness and λ is thermal conductivity
 */
export function calculateThermalResistance(thickness: number, lambda: number): number {
  return thickness / lambda
}

/**
 * Calculate heat transfer through a material
 * Q = U * A * ΔT
 * where U is U-value, A is area, ΔT is temperature difference
 */
export function calculateHeatTransfer(
  uValue: number,
  area: number,
  temperatureDifference: number
): number {
  return uValue * area * temperatureDifference
}

/**
 * Calculate mass of a material volume
 * m = ρ * V
 * where ρ is density and V is volume
 */
export function calculateMass(density: number, volume: number): number {
  return density * volume
}

/**
 * Calculate thermal mass
 * C = m * c
 * where m is mass and c is specific heat capacity
 */
export function calculateThermalMass(mass: number, heatCapacity: number): number {
  return mass * heatCapacity
}
