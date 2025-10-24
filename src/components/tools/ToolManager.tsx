'use client'

import { useBuildingStore } from '@/lib/store/buildingStore'
import WallTool from './WallTool'
import { FloorTool } from './FloorTool'
import RoofTool from './RoofTool'
import WindowTool from './WindowTool'
import DoorTool from './DoorTool'
import EnhancedTransformControls from '../viewer/EnhancedTransformControls'
import { useSelection } from '@/hooks/useSelection'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

interface ToolManagerProps {
  recomputeCollisions: () => void
}

export default function ToolManager({ recomputeCollisions }: ToolManagerProps) {
  const tool = useBuildingStore((state) => state.tool)

  // Enable keyboard shortcuts
  useSelection()
  useKeyboardShortcuts()

  return (
    <>
      {tool === 'wall' && <WallTool />}
      {tool === 'floor' && <FloorTool />}
      {tool === 'roof' && <RoofTool />}
      {tool === 'window' && <WindowTool />}
      {tool === 'door' && <DoorTool />}
      {tool === 'select' && <EnhancedTransformControls recomputeCollisions={recomputeCollisions} />}
    </>
  )
}
