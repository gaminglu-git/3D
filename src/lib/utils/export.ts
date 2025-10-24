import { Building } from '../types/building'

/**
 * Export building to JSON format
 */
export function exportToJSON(building: Building): string {
  return JSON.stringify(building, null, 2)
}

/**
 * Import building from JSON string
 */
export function importFromJSON(json: string): Building {
  const building = JSON.parse(json)
  // Convert date strings back to Date objects
  building.metadata.created = new Date(building.metadata.created)
  building.metadata.modified = new Date(building.metadata.modified)
  return building
}

/**
 * Download file to user's computer
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = 'application/json'
): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export building and trigger download
 */
export function exportBuilding(building: Building): void {
  const json = exportToJSON(building)
  const filename = `${building.name.replace(/\s+/g, '-')}_${new Date().toISOString().split('T')[0]}.json`
  downloadFile(json, filename)
}
