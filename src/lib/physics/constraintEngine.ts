import * as THREE from 'three'
import { Building, BuildingElement, SnapPoint, Constraint } from '../types/building'

/**
 * Result of a snapping operation
 */
export interface SnapResult {
  position: THREE.Vector3
  rotation: THREE.Euler
  snapped: boolean
  snapPoints: SnapPoint[]
}

/**
 * A powerful engine for managing snapping and construction constraints.
 * This engine will be responsible for:
 * - Generating potential snap points based on building geometry.
 * - Evaluating constraints to ensure architectural validity.
 * - Providing snapping results for tools to use during element placement.
 */
export class ConstraintEngine {
  private building: Building

  constructor(building: Building) {
    this.building = building
  }

  /**
   * Updates the building state for the engine.
   * @param building The current building structure.
   */
  public updateBuilding(building: Building) {
    this.building = building
  }

  /**
   * Finds the best snap point for a given position and element.
   * @param cursorPosition The current world position of the cursor.
   * @param elementToPlace The element being placed (optional).
   * @returns A SnapResult with the new position and snapping details.
   */
  public findSnap(
    cursorPosition: THREE.Vector3,
    elementToPlace?: BuildingElement,
  ): SnapResult {
    const snapPoints = this.generateSnapPoints()
    let closestSnap: SnapPoint | null = null
    let minDistance = 0.5 // Max snap distance

    for (const point of snapPoints) {
      const pointVec = new THREE.Vector3(point.position.x, point.position.y, point.position.z)
      const distance = cursorPosition.distanceTo(pointVec)

      if (distance < minDistance) {
        minDistance = distance
        closestSnap = point
      }
    }

    if (closestSnap) {
      return {
        position: new THREE.Vector3(
          closestSnap.position.x,
          closestSnap.position.y,
          closestSnap.position.z,
        ),
        rotation: new THREE.Euler(0, 0, 0), // Placeholder for alignment logic
        snapped: true,
        snapPoints: [closestSnap],
      }
    }

    return {
      position: cursorPosition,
      rotation: new THREE.Euler(0, 0, 0),
      snapped: false,
      snapPoints: [],
    }
  }

  /**
   * Checks if placing an element at a certain position violates any constraints.
   * @param element The element to check.
   * @returns True if the placement is valid, false otherwise.
   */
  public validatePlacement(element: BuildingElement): boolean {
    // Placeholder: Logic to verify against building codes and defined constraints
    return true
  }

  /**
   * Generates a list of all potential snap points in the scene.
   * @returns An array of SnapPoint objects.
   */
  private generateSnapPoints(): SnapPoint[] {
    const points: SnapPoint[] = []
    const walls = this.building.elements.filter((e) => e.type === 'wall')

    for (const element of walls) {
      const wall = element as import('../types/building').Wall
      const wallPosition = new THREE.Vector3(wall.position.x, wall.position.y, wall.position.z)
      const wallQuaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(wall.rotation.x, wall.rotation.y, wall.rotation.z),
      )

      // Get wall direction vector
      const direction = new THREE.Vector3(1, 0, 0).applyQuaternion(wallQuaternion)
      const halfLength = wall.length / 2

      // Start and end points
      const startPoint = wallPosition.clone().sub(direction.clone().multiplyScalar(halfLength))
      const endPoint = wallPosition.clone().add(direction.clone().multiplyScalar(halfLength))
      const midPoint = wallPosition.clone()

      points.push({
        position: { x: startPoint.x, y: startPoint.y, z: startPoint.z },
        type: 'wall-endpoint',
        elementId: wall.id,
        priority: 1,
      })
      points.push({
        position: { x: endPoint.x, y: endPoint.y, z: endPoint.z },
        type: 'wall-endpoint',
        elementId: wall.id,
        priority: 1,
      })
      points.push({
        position: { x: midPoint.x, y: midPoint.y, z: midPoint.z },
        type: 'wall-midpoint',
        elementId: wall.id,
        priority: 2,
      })
    }

    return points
  }
}
