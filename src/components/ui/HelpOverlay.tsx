'use client'

import { X, Keyboard } from 'lucide-react'

interface HelpOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function HelpOverlay({ isOpen, onClose }: HelpOverlayProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-gray-900">Tastenkürzel & Bedienung</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Tools */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Werkzeuge</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Auswählen</span>
                <kbd className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">V</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Wand erstellen</span>
                <kbd className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">W</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Dach erstellen</span>
                <kbd className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">R</kbd>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Aktionen</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rückgängig</span>
                <kbd className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">Ctrl+Z</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Wiederholen</span>
                <kbd className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">Ctrl+Y</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Löschen</span>
                <kbd className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">Delete</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Abwählen</span>
                <kbd className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">Esc</kbd>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Kamera-Navigation</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start justify-between">
                <span className="text-gray-600">Rotieren</span>
                <span className="text-right text-xs text-gray-500">Linke Maustaste + Ziehen</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-gray-600">Verschieben</span>
                <span className="text-right text-xs text-gray-500">Rechte Maustaste + Ziehen</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-gray-600">Zoom</span>
                <span className="text-right text-xs text-gray-500">Mausrad</span>
              </div>
            </div>
          </div>

          {/* View */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Ansicht</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">2D/3D Wechsel</span>
                <kbd className="rounded bg-gray-100 px-2 py-1 font-mono text-xs">Tab</kbd>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-gray-600">Multi-Selektion</span>
                <span className="text-right text-xs text-gray-500">Shift + Klick</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-blue-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-blue-900">💡 Tipps</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Ziehen Sie Elemente aus der Bibliothek in die 3D-Ansicht</li>
            <li>• Wählen Sie Objekte aus und verschieben Sie sie mit den Gizmos</li>
            <li>• Bearbeiten Sie Eigenschaften in der rechten Sidebar</li>
            <li>• Schalten Sie in den Experten-Modus für thermische Daten</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-primary-600 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-700"
        >
          Schließen
        </button>
      </div>
    </div>
  )
}
