import { Vector3 } from 'three'

export interface Position3D {
  x: number
  y: number
  z: number
}

export interface Dimensions {
  width: number
  height: number
  depth: number
}

export interface Rotation {
  x: number
  y: number
  z: number
}

export type Point3D = [number, number, number]

export interface BoundingBox {
  min: Position3D
  max: Position3D
}

export function toVector3(pos: Position3D): Vector3 {
  return new Vector3(pos.x, pos.y, pos.z)
}

export function fromVector3(vec: Vector3): Position3D {
  return { x: vec.x, y: vec.y, z: vec.z }
}
