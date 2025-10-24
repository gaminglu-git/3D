import * as THREE from 'three'
import { nanoid } from 'nanoid'
import { Building, BuildingElement, Wall, Opening, isWall, ElementType } from '../types/building'

/**
 * Handles adding an element to the building model.
 * Differentiates between regular elements and openings (windows/doors).
 * @param building The current building object.
 * @param element The element to add.
 * @returns The updated building object.
 */
export function addElementToBuilding(
  building: Building,
  element: BuildingElement,
): { updatedBuilding: Building; newElementId: string } {
  const newBuilding = {
    ...building,
    elements: [...building.elements],
    metadata: building.metadata ? { ...building.metadata } : { created: new Date(), modified: new Date(), totalArea: 0, totalVolume: 0 },
  }
  const newElementId = element.id || nanoid()
  const elementWithId = { ...element, id: newElementId }

  if ((elementWithId.type === 'window' || elementWithId.type === 'door') && (elementWithId as unknown as Opening).wallId) {
    const opening = elementWithId as unknown as Opening
    const wallIndex = newBuilding.elements.findIndex((e) => e.id === opening.wallId)

    if (wallIndex !== -1 && isWall(newBuilding.elements[wallIndex])) {
      const targetWall = { ...(newBuilding.elements[wallIndex] as Wall) }
      targetWall.openings = [...(targetWall.openings || []), opening]
      newBuilding.elements[wallIndex] = targetWall
      console.log(`Added ${opening.type} to wall ${opening.wallId}`)
    } else {
      console.warn(`Could not find wall ${opening.wallId} for ${opening.type}`)
    }
  } else {
    newBuilding.elements.push(elementWithId)
  }

  newBuilding.metadata.modified = new Date()
  return { updatedBuilding: newBuilding, newElementId }
}

/**
 * Merges two collinear walls into a single wall.
 * If merging is not possible, it connects them.
 * @param building The current building object.
 * @param wallAId The ID of the first wall.
 * @param wallBId The ID of the second wall.
 * @returns The updated building object.
 */
export function mergeOrConnectWalls(
  building: Building,
  wallAId: string,
  wallBId: string,
): Building {
  const newBuilding = { ...building }
  const wallA = newBuilding.elements.find((e) => e.id === wallAId)
  const wallB = newBuilding.elements.find((e) => e.id === wallBId)

  if (!wallA || !wallB || !isWall(wallA) || !isWall(wallB)) {
    return building // Return original if walls are not found
  }

  // Merge logic for collinear walls
  const posA = new THREE.Vector3(wallA.position.x, 0, wallA.position.z)
  const posB = new THREE.Vector3(wallB.position.x, 0, wallB.position.z)
  const dirA = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), -wallA.rotation.y)

  const halfLengthA = wallA.length / 2
  const halfLengthB = wallB.length / 2

  const startA = posA.clone().sub(dirA.clone().multiplyScalar(halfLengthA))
  const endA = posA.clone().add(dirA.clone().multiplyScalar(halfLengthA))
  const startB = posB.clone().sub(dirA.clone().multiplyScalar(halfLengthB))
  const endB = posB.clone().add(dirA.clone().multiplyScalar(halfLengthB))

  // Determine the combined start and end points of the new merged wall
  const newStart = startA.distanceTo(startB) < startA.distanceTo(endB) ? startA : endA
  const newEnd = newStart.equals(startA) ? endB : startB
  const newLength = newStart.distanceTo(newEnd)
  const newCenter = new THREE.Vector3().addVectors(newStart, newEnd).multiplyScalar(0.5)

  const mergedWall: Wall = {
    ...wallA,
    id: nanoid(),
    length: newLength,
    position: { x: newCenter.x, y: wallA.position.y, z: newCenter.z },
    connections: [
      ...(wallA.connections || []).filter((id) => id !== wallB.id),
      ...(wallB.connections || []).filter((id) => id !== wallA.id),
    ],
    openings: [...(wallA.openings || []), ...(wallB.openings || [])],
  }

  // Replace the two old walls with the new merged wall
  newBuilding.elements = [
    ...newBuilding.elements.filter((e) => e.id !== wallAId && e.id !== wallBId),
    mergedWall,
  ]
  newBuilding.metadata.modified = new Date()

  return newBuilding
}

/**
 * Connects two building elements by adding their IDs to each other's connections list.
 * @param building The current building object.
 * @param elementAId The ID of the first element.
 * @param elementBId The ID of the second element.
 * @returns The updated building object.
 */
export function connectBuildingElements(
  building: Building,
  elementAId: string,
  elementBId: string,
): Building {
  const newBuilding = { ...building }
  const elementA = newBuilding.elements.find((e) => e.id === elementAId)
  const elementB = newBuilding.elements.find((e) => e.id === elementBId)

  if (!elementA || !elementB) {
    return building
  }

  if (!elementA.connections) elementA.connections = []
  if (!elementB.connections) elementB.connections = []

  if (!elementA.connections.includes(elementBId)) {
    elementA.connections.push(elementBId)
  }
  if (!elementB.connections.includes(elementAId)) {
    elementB.connections.push(elementAId)
  }

  newBuilding.metadata.modified = new Date()
  return newBuilding
}




