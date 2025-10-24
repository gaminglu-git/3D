import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { PhysicsService } from '@/lib/physics/physicsService'

export function PhysicsDebugger() {
  const physicsService = PhysicsService.getInstance()
  const linesRef = useRef<THREE.LineSegments>(null!)

  const lineSegments = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      toneMapped: false,
    })
    return new THREE.LineSegments(geometry, material)
  }, [])

  useFrame(() => {
    const buffers = physicsService.getDebugRenderBuffers()
    if (buffers && linesRef.current) {
      const { vertices, colors } = buffers
      linesRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
      linesRef.current.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4))
      linesRef.current.geometry.computeBoundingSphere()
    }
  })

  return <primitive object={lineSegments} ref={linesRef} />
}
