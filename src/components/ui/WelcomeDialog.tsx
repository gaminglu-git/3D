'use client'

import { Home, Plus, FolderOpen, X } from 'lucide-react'
import { useBuildingStore } from '@/lib/store/buildingStore'
import { createDemoBuilding } from '@/lib/utils/demoBuilding'

interface WelcomeDialogProps {
  onStartNew: () => void
}

export default function WelcomeDialog({ onStartNew }: WelcomeDialogProps) {
  const setBuilding = useBuildingStore((state) => state.setBuilding)

  const handleDemo = () => {
    const demo = createDemoBuilding()
    setBuilding(demo)
    // No need to call onStartNew here, as setBuilding will trigger the rerender.
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Willkommen beim 3D Building Viewer
          </h1>
          <p className="text-gray-600">
            Erstellen Sie professionelle 3D-Gebäudemodelle mit physikalisch korrekten Eigenschaften
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <button
            onClick={onStartNew}
            className="group flex flex-col items-center gap-3 rounded-lg border-2 border-gray-200 p-6 transition-all hover:border-primary-500 hover:bg-primary-50"
          >
            <div className="rounded-full bg-primary-100 p-4 transition-colors group-hover:bg-primary-200">
              <Plus className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Neues Projekt</h3>
            <p className="text-center text-sm text-gray-600">
              Starten Sie mit einem leeren Projekt
            </p>
          </button>
          <button
            onClick={handleDemo}
            className="group flex flex-col items-center gap-3 rounded-lg border-2 border-gray-200 p-6 transition-all hover:border-primary-500 hover:bg-primary-50"
          >
            <div className="rounded-full bg-primary-100 p-4 transition-colors group-hover:bg-primary-200">
              <Home className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Demo-Haus</h3>
            <p className="text-center text-sm text-gray-600">
              Erkunden Sie ein vorgefertigtes Beispielgebäude
            </p>
          </button>
          <button
            className="group flex flex-col items-center gap-3 rounded-lg border-2 border-gray-200 p-6 transition-all hover:border-gray-300 hover:bg-gray-50"
            disabled
          >
            <div className="rounded-full bg-gray-100 p-4">
              <FolderOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-400">Projekt öffnen</h3>
            <p className="text-center text-sm text-gray-400">Bald verfügbar</p>
          </button>
        </div>
        <div className="mt-8 rounded-lg bg-gray-50 p-4">
          <h4 className="mb-2 text-sm font-semibold text-gray-700">Tastenkombinationen:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div><kbd className="rounded bg-white px-2 py-1 font-mono text-xs">V</kbd> Auswählen</div>
            <div><kbd className="rounded bg-white px-2 py-1 font-mono text-xs">W</kbd> Wand</div>
            <div><kbd className="rounded bg-white px-2 py-1 font-mono text-xs">F</kbd> Fenster</div>
            <div><kbd className="rounded bg-white px-2 py-1 font-mono text-xs">D</kbd> Tür</div>
            <div><kbd className="rounded bg-white px-2 py-1 font-mono text-xs">Ctrl+Z</kbd> Rückgängig</div>
            <div><kbd className="rounded bg-white px-2 py-1 font-mono text-xs">Entf</kbd> Löschen</div>
          </div>
        </div>
      </div>
    </div>
  )
}
