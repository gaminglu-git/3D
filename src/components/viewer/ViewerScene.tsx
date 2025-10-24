'use client'

import { useEffect, useState } from 'react'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import Scene from './Scene'
import { useBuildingStore } from '@/lib/store/buildingStore'
import { useDragStateStore } from '@/lib/store/dragStateStore'
import BuildingRenderer from '../building/BuildingRenderer'
import Toolbar from '../ui/Toolbar'
import PropertiesSidebar from '../ui/Sidebar/PropertiesSidebar'
import SmartLibrary from '../ui/SmartLibrary'
import ToolManager from '../tools/ToolManager'
import WelcomeDialog from '../ui/WelcomeDialog'
import StatusBar from '../ui/StatusBar'
import ToolModeIndicator from '../ui/ToolModeIndicator'
import View2D from '../modes/View2D'
import DropZone3D from '../ui/DropZone3D'
import CanvasDragOverlay from '../ui/CanvasDragOverlay'
import DragDebugOverlay from '../ui/DragDebugOverlay'
import HelpOverlay from '../ui/HelpOverlay'
import FloorSelector from '../ui/FloorSelector'
import ImportExportDialog from '../ui/ImportExportDialog'
import ConnectionPromptDialog from '../ui/ConnectionPromptDialog'
import TransformFeedback from '../ui/TransformFeedback'
import CollisionWarning from './CollisionWarning'
import CollisionOverlay from '../ui/CollisionOverlay'
import DragPreview3D from '../ui/DragPreview3D'
import { createElementFromLibraryItem } from '@/lib/utils/elementFactory'
import { DEFAULT_MATERIALS } from '@/lib/constants/materials'
import * as THREE from 'three'
import { usePhysics } from '@/hooks/usePhysics'
import { LoadingState } from '../ui/LoadingState'
import { PhysicsSandboxController } from './PhysicsSandboxController'
import { isFloorElement, isRoofElement, isWall } from '@/lib/types/building'

export default function ViewerScene() {
  const addElement = useBuildingStore((state) => state.addElement)
  const isInitialized = useBuildingStore((state) => state.isInitialized)
  const loadDefaultBuilding = useBuildingStore((state) => state.loadDefaultBuilding)
  const loadMaterials = useBuildingStore((state) => state.loadMaterials)
  const building = useBuildingStore((state) => state.building)
  const [showWelcome, setShowWelcome] = useState(false)
  const [importExportMode, setImportExportMode] = useState<'import' | 'export' | null>(null)
  const [showHelp, setShowHelp] = useState(false)

  // Initialize physics engine
  const { isPhysicsReady, recomputeCollisions } = usePhysics()

  // Load default materials on component mount
  useEffect(() => {
    const materialsMap = DEFAULT_MATERIALS.reduce((acc, material) => {
      acc[material.id] = material
      return acc
    }, {} as Record<string, any>)
    loadMaterials(materialsMap)
  }, [loadMaterials])

  useEffect(() => {
    // Only show the welcome dialog if the physics is ready and there is no building yet.
    if (isPhysicsReady) {
      const currentBuilding = useBuildingStore.getState().building
      if (!currentBuilding) {
        setShowWelcome(true)
      }
    }
  }, [isPhysicsReady])

  useEffect(() => {
    if (isPhysicsReady && !useBuildingStore.getState().building) {
      loadDefaultBuilding()
    }
  }, [isPhysicsReady, loadDefaultBuilding])

  useEffect(() => {
    const handleOpenImport = () => setImportExportMode('import')
    const handleOpenExport = () => setImportExportMode('export')

    window.addEventListener('openImportDialog', handleOpenImport)
    window.addEventListener('openExportDialog', handleOpenExport)
    window.addEventListener('openHelp', () => setShowHelp(true))

    return () => {
      window.removeEventListener('openImportDialog', handleOpenImport)
      window.removeEventListener('openExportDialog', handleOpenExport)
      window.removeEventListener('openHelp', () => setShowHelp(true))
    }
  }, [])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    const { dragPosition, isValidDrop, reset } = useDragStateStore.getState()

    if (over?.id === 'drop-zone-3d' && isValidDrop && dragPosition) {
      const item = active.data.current
      if (item) {
        const newElement = createElementFromLibraryItem(item, new THREE.Vector3(
          dragPosition.x,
          dragPosition.y,
          dragPosition.z,
        ))
        if (newElement) {
          if (isWall(newElement) || isFloorElement(newElement) || isRoofElement(newElement)) {
            addElement(newElement)
            recomputeCollisions()
            console.log(`Item dropped and created:`, newElement)
          } else {
            console.warn('Attempted to add a non-structural element directly to the building.', newElement)
          }
        }
      }
    } else {
      console.log('Drag ended outside drop zone or without a valid position')
    }

    reset()
  }
  
  const handleStartNew = () => {
    loadDefaultBuilding()
    setShowWelcome(false)
  }

  if (!isInitialized || !building) {
    return <LoadingState />
  }

  if (showWelcome) {
    return <WelcomeDialog onStartNew={handleStartNew} />
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="relative h-screen w-screen overflow-hidden">
        <Toolbar />
        <FloorSelector />
        <ToolModeIndicator />
        <div className="relative h-full w-full">
          <Scene>
            <BuildingRenderer />
            <View2D />
            <ToolManager recomputeCollisions={recomputeCollisions} />
            <DropZone3D />
            <CollisionWarning />
            <DragPreview3D />
            <PhysicsSandboxController />
          </Scene>
        </div>
        <TransformFeedback />
        <CollisionOverlay />
        <SmartLibrary />
        <PropertiesSidebar />
        <StatusBar />
        <HelpOverlay isOpen={showHelp} onClose={() => setShowHelp(false)} />
        <CanvasDragOverlay />
        <DragDebugOverlay />
        {importExportMode && (
          <ImportExportDialog mode={importExportMode} onClose={() => setImportExportMode(null)} />
        )}
        <ConnectionPromptDialog />
      </div>
    </DndContext>
  )
}
