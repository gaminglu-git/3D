'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { Vector3, Raycaster } from 'three'
import * as THREE from 'three'
import { useBuildingStore } from '@/lib/store/buildingStore'
import { nanoid } from 'nanoid'
import { DEFAULT_WALL } from '@/lib/constants/defaults'
import { physicsService } from '@/lib/physics/physicsService'
import type { SnapPoint } from '@/lib/types/building'
import { useMemo } from 'react'
import type { Collider } from '@dimforge/rapier3d-compat'
import { Line } from '@react-three/drei'
import { calculateWallEndpoints } from '@/lib/utils/geometry'
import { isWall } from '@/lib/types/building'

export default function WallTool() {
  const { camera } = useThree()
  const addElement = useBuildingStore((state) => state.addElement)
  const setActiveSnap = useBuildingStore((state) => state.setActiveSnap)
  const building = useBuildingStore((state) => state.building)
  const [startPoint, setStartPoint] = useState<Vector3 | null>(null)
  const [previewEndPoint, setPreviewEndPoint] = useState<Vector3 | null>(null)
  const cursorBodyRef = useRef<any>(null)
  const startPointBodyRef = useRef<any>(null)
  const activeJointRef = useRef<number | null>(null)

  useEffect(() => {
    const RAPIER = physicsService.Rapier()
    if (!RAPIER || !physicsService.world) return

    const bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()
    const body = physicsService.world.createRigidBody(bodyDesc)

    const colliderDesc = RAPIER.ColliderDesc.ball(0.1).setSensor(true)
    physicsService.world.createCollider(colliderDesc, body)

    cursorBodyRef.current = body

    return () => {
      if (cursorBodyRef.current) {
        physicsService.world?.removeRigidBody(cursorBodyRef.current)
      }
    }
  }, [])

  const getIntersectionPoint = useCallback(
    (event: any) => {
      const pointer = new THREE.Vector2(event.pointer.x, event.pointer.y)
      const raycaster = new Raycaster()
      raycaster.setFromCamera(pointer, camera)
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
      const point = new THREE.Vector3()
      raycaster.ray.intersectPlane(plane, point)
      return point
    },
    [camera],
  )

  const handleClick = useCallback(
    (event: any) => {
      const point = getIntersectionPoint(event)
      if (!point) return

      const finalPoint = previewEndPoint || point
      const RAPIER = physicsService.Rapier()
      if (!RAPIER) return

      if (!startPoint) {
        setStartPoint(finalPoint)
        const bodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(finalPoint.x, finalPoint.y, finalPoint.z)
        const body = physicsService.world?.createRigidBody(bodyDesc)
        startPointBodyRef.current = body
      } else {
        const length = startPoint.distanceTo(finalPoint)

        if (length < 0.5) {
          setStartPoint(null)
          setPreviewEndPoint(null)
          if (startPointBodyRef.current) {
            physicsService.world?.removeRigidBody(startPointBodyRef.current)
            startPointBodyRef.current = null
          }
          return
        }

        const center = new Vector3().addVectors(startPoint, finalPoint).multiplyScalar(0.5)
        const direction = new Vector3().subVectors(finalPoint, startPoint).normalize()
        // Correct angle calculation for Y rotation in Three.js (atan2 gives angle from X-axis, we need from Z-axis)
        const angle = Math.atan2(direction.x, direction.z) + Math.PI / 2

        console.log('--- Creating New Wall ---', {
          startPoint: { x: startPoint.x, y: startPoint.y, z: startPoint.z },
          finalPoint: { x: finalPoint.x, y: finalPoint.y, z: finalPoint.z },
          calculatedCenter: { x: center.x, y: center.y, z: center.z },
          calculatedLength: length,
          calculatedAngle: angle,
        })

        const newWall = {
          id: nanoid(),
          type: 'wall',
          position: { x: center.x, y: DEFAULT_WALL.height / 2, z: center.z },
          rotation: { x: 0, y: angle, z: 0 },
          dimensions: {
            width: length,
            height: DEFAULT_WALL.height,
            depth: DEFAULT_WALL.thickness,
          },
          floorLevel: 0,
          visible: true,
          locked: false,
          length: length,
          height: DEFAULT_WALL.height,
          thickness: DEFAULT_WALL.thickness,
          materialId: 'brick',
          openings: [],
        } as any

        addElement(newWall)
        setStartPoint(null)
        setPreviewEndPoint(null)
        setActiveSnap(null)
        if (startPointBodyRef.current) {
          physicsService.world?.removeRigidBody(startPointBodyRef.current)
          startPointBodyRef.current = null
        }
      }
    },
    [startPoint, addElement, getIntersectionPoint, setActiveSnap, previewEndPoint],
  )

  const handlePointerMove = useCallback(
    (event: any) => {
      const point = getIntersectionPoint(event)
      if (!point || !cursorBodyRef.current || !physicsService.world) return

      cursorBodyRef.current.setTranslation(point, true)

      if (activeJointRef.current !== null) {
        physicsService.removeJoint(activeJointRef.current)
        activeJointRef.current = null
      }

      let closestIntersection: Vector3 | null = null
      let minDistance = Infinity
      
      // Simple distance-based snapping using building elements
      if (building?.elements) {
        const walls = building.elements.filter(isWall)
        
        for (const wall of walls) {
          const endpoints = calculateWallEndpoints(wall)
          
          // Check both endpoints
          const startPoint3D = new Vector3(endpoints.start.x, endpoints.start.y, endpoints.start.z)
          const endPoint3D = new Vector3(endpoints.end.x, endpoints.end.y, endpoints.end.z)
          
          const startDistance = point.distanceTo(startPoint3D)
          const endDistance = point.distanceTo(endPoint3D)
          
          if (startDistance < 1.0 && startDistance < minDistance) {
            minDistance = startDistance
            closestIntersection = startPoint3D
          }
          
          if (endDistance < 1.0 && endDistance < minDistance) {
            minDistance = endDistance
            closestIntersection = endPoint3D
          }
        }
      }

      const snapPoint = closestIntersection || point
      setPreviewEndPoint(snapPoint)

      if (startPointBodyRef.current && cursorBodyRef.current) {
        if (closestIntersection) {
          const body1Handle = startPointBodyRef.current.handle
          const body2Handle = cursorBodyRef.current.handle

          const anchor1 = startPointBodyRef.current.translation()
          const anchor2 = cursorBodyRef.current.translation()

          const jointHandle = physicsService.addJoint(body1Handle, body2Handle, anchor1, anchor2)
          if (jointHandle) {
            activeJointRef.current = jointHandle
          }
        }
      }
    },
    [getIntersectionPoint, building],
  )

  return (
    <>
      {/* Invisible plane for click detection */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onClick={handleClick}
        onPointerMove={handlePointerMove}
        visible={false}
      >
        <planeGeometry args={[1000, 1000]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Preview wall */}
      {startPoint && previewEndPoint && (
        <group>
          {/* Line from start to preview end */}
          <Line points={[startPoint, previewEndPoint]} color="#3b82f6" lineWidth={2} />

          {/* Preview end point */}
          <mesh position={[previewEndPoint.x, 0.1, previewEndPoint.z]}>
            <cylinderGeometry args={[0.1, 0.1, 0.2, 16]} />
            <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}
    </>
  )
}
