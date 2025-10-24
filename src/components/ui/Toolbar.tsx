'use client'

import { useMemo, useCallback, memo } from 'react'
import { useBuildingStore } from '@/lib/store/buildingStore'
import { useUIStore } from '@/lib/store/uiStore'
import {
  MousePointer2,
  Square,
  DoorOpen,
  Square as WindowIcon,
  Home,
  Undo2,
  Redo2,
  Save,
  FolderOpen,
  Settings,
  HelpCircle,
  Beaker,
  Layers,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

function Toolbar() {
  const tool = useBuildingStore((state) => state.tool)
  const setTool = useBuildingStore((state) => state.setTool)
  const viewMode = useBuildingStore((state) => state.viewMode)
  const setViewMode = useBuildingStore((state) => state.setViewMode)
  const undo = useBuildingStore((state) => state.undo)
  const redo = useBuildingStore((state) => state.redo)
  const history = useBuildingStore((state) => state.history)
  const { isPhysicsSandboxMode, togglePhysicsSandboxMode } = useUIStore()

  const canUndo = useMemo(() => history.past.length > 0, [history.past.length])
  const canRedo = useMemo(() => history.future.length > 0, [history.future.length])

  const tools = useMemo(
    () => [
      { id: 'select', icon: MousePointer2, label: 'Auswählen (V)', shortcut: 'V' },
      { id: 'wall', icon: Square, label: 'Wand (W)', shortcut: 'W' },
      { id: 'floor', icon: Layers, label: 'Boden (B)', shortcut: 'B' },
      { id: 'window', icon: WindowIcon, label: 'Fenster (F)', shortcut: 'F' },
      { id: 'door', icon: DoorOpen, label: 'Tür (D)', shortcut: 'D' },
      { id: 'roof', icon: Home, label: 'Dach (R)', shortcut: 'R' },
    ],
    [],
  );

  return (
    <div className="bg-white shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Logo/Title */}
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">3D Building Viewer</h1>
        </div>

        {/* Center: Tools */}
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id as typeof tool)}
              className={cn(
                'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
                tool === t.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              )}
              title={t.label}
            >
              <t.icon className="h-5 w-5" />
              <span className="hidden md:inline">{t.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={cn(
                'rounded p-2 transition-colors',
                canUndo ? 'text-gray-700 hover:bg-gray-200' : 'cursor-not-allowed text-gray-400'
              )}
              title="Rückgängig (Ctrl+Z)"
            >
              <Undo2 className="h-5 w-5" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={cn(
                'rounded p-2 transition-colors',
                canRedo ? 'text-gray-700 hover:bg-gray-200' : 'cursor-not-allowed text-gray-400'
              )}
              title="Wiederholen (Ctrl+Y)"
            >
              <Redo2 className="h-5 w-5" />
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setViewMode('2d')}
              className={cn(
                'rounded px-3 py-2 text-sm font-medium transition-colors',
                viewMode === '2d'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              )}
            >
              2D
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={cn(
                'rounded px-3 py-2 text-sm font-medium transition-colors',
                viewMode === '3d'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-200'
              )}
            >
              3D
            </button>
          </div>

          {/* File Actions */}
          <div className="flex gap-1">
            <button
              onClick={() => {
                const event = new CustomEvent('openImportDialog')
                window.dispatchEvent(event)
              }}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
              title="Öffnen"
            >
              <FolderOpen className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                const event = new CustomEvent('openExportDialog')
                window.dispatchEvent(event)
              }}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
              title="Speichern"
            >
              <Save className="h-5 w-5" />
            </button>
            <button
              onClick={togglePhysicsSandboxMode}
              className={cn(
                'rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100',
                isPhysicsSandboxMode && 'bg-primary-100 text-primary-600',
              )}
              title="Physik-Sandbox"
            >
              <Beaker className="h-5 w-5" />
            </button>
            <button className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100" title="Einstellungen">
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openHelp'))}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
              title="Hilfe & Tastenkürzel"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Toolbar)
