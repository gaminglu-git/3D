import { BuildingElement } from '../types/building'

export enum PhysicsCommandType {
  ADD,
  REMOVE,
  UPDATE_TRANSFORM,
  UPDATE_PROPERTIES,
}

export interface PhysicsCommand {
  type: PhysicsCommandType
  elementId: string
  element?: BuildingElement // Present for ADD, optional for UPDATE
  transform?: { position: { x: number; y: number; z: number }; rotation: { x: number; y: number; z: number } } // for UPDATE_TRANSFORM
  properties?: any // for UPDATE_PROPERTIES
}
