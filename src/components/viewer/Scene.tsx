'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, Environment } from '@react-three/drei'
import { Suspense, useEffect, useRef } from 'react'
import { CAMERA_DEFAULTS, GRID_SIZE, GRID_DIVISIONS } from '@/lib/constants/defaults'
import { useBuildingStore } from '@/lib/store/buildingStore'
import SnapIndicators from './SnapIndicators'
import { useThree } from '@react-three/fiber'
import { useToolStore } from '@/lib/store/toolStore'
import BuildingRenderer from '../building/BuildingRenderer'
import SelectionOutline from './SelectionOutline'
import { PhysicsService } from '../../lib/physics/physicsService'
import { PhysicsDebugger } from './PhysicsDebugger'
import { useUIStore, UIState } from '../../lib/store/uiStore'
import { useDragStateStore } from '../../lib/store/dragStateStore'
import { getBuildingBoundingBox } from '@/lib/utils/geometry'
import * as THREE from 'three'

interface SceneProps {
  children?: React.ReactNode
}

function SceneContent({ children }: { children?: React.ReactNode }) {
  const { camera } = useThree()
  const activeTool = useBuildingStore((state) => state.tool)
  const physicsService = PhysicsService.getInstance()
  const showPhysicsDebugger = useUIStore((state: UIState) => state.showPhysicsDebugger)

  useFrame(() => {
    // if (physicsService.world) {
    //   physicsService.step()
    // }
  })

  // Set initial camera position
  useEffect(() => {
    if (camera && 'fov' in camera) {
      camera.position.set(...CAMERA_DEFAULTS.position)
      camera.fov = CAMERA_DEFAULTS.fov
      camera.near = CAMERA_DEFAULTS.near
      camera.far = CAMERA_DEFAULTS.far
    }
  }, [camera])

  const viewMode = useBuildingStore((state) => state.viewMode)
  const isDragging = useDragStateStore((state) => !!state.activeItem)
  const isDrawing = ['wall', 'floor', 'roof'].includes(activeTool)
  const activeSnap = useBuildingStore((state) => state.activeSnap)
  const controlsRef = useRef<any>(null)
  const building = useBuildingStore((state) => state.building)

  // Auto-focus camera on building center
  useEffect(() => {
    if (controlsRef.current && building && building.elements.length > 0) {
      const box = getBuildingBoundingBox(building)
      const center = new THREE.Vector3()
      box.getCenter(center)
      controlsRef.current.target.copy(center)
      controlsRef.current.update()
    }
  }, [building])

  // Disable OrbitControls during drag
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = !isDragging && !isDrawing;
    }
  }, [isDragging, isDrawing]);

  return (
    <>
      {/* Lighting Setup */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />

      {/* Environment */}
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>

      {/* Grid Helper */}
      {viewMode === '3d' && (
        <Grid
          args={[GRID_DIVISIONS * GRID_SIZE, GRID_DIVISIONS]}
          cellSize={GRID_SIZE}
          cellThickness={0.5}
          cellColor="#6b7280"
          sectionSize={1}
          sectionThickness={1}
          sectionColor="#374151"
          fadeDistance={50}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid
        />
      )}

      {/* Camera Controls - Disabled during drag */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        minDistance={2}
        maxDistance={100}
        maxPolarAngle={Math.PI / 2}
        enableRotate={viewMode === '3d' && !isDragging && !isDrawing}
        enableZoom={!isDragging && !isDrawing}
        enablePan={!isDragging && !isDrawing}
        enableDamping
        dampingFactor={0.05}
      />

      {/* Snap Indicators */}
      {activeSnap?.snapped && (
        <SnapIndicators
          snapPoints={activeSnap.snapPoints}
          activeSnapPoint={activeSnap.snapPoints[0]}
        />
      )}

      {/* Scene Content */}
      <Suspense fallback={null}>
        <SelectionOutline />
        {children}
        {showPhysicsDebugger && <PhysicsDebugger />}
      </Suspense>

      {/* Background click handler to clear selection */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        onClick={() => {
          // This will be handled by the tool manager
        }}
        visible={false}
      >
        <planeGeometry args={[1000, 1000]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  )
}

export default function Scene({ children }: SceneProps) {
  return (
    <Canvas
      camera={{
        position: CAMERA_DEFAULTS.position,
        fov: CAMERA_DEFAULTS.fov,
        near: CAMERA_DEFAULTS.near,
        far: CAMERA_DEFAULTS.far,
      }}
      shadows
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
      frameloop="always"
    >
      <SceneContent>{children}</SceneContent>
    </Canvas>
  )
}