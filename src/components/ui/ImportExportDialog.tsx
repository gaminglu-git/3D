'use client'

import { useState, useRef } from 'react'
import { useBuildingStore } from '@/lib/store/buildingStore'
import { exportBuilding, importFromJSON } from '@/lib/utils/export'
import { X, Download, Upload, FileJson } from 'lucide-react'

interface ImportExportDialogProps {
  mode: 'import' | 'export'
  onClose: () => void
}

export default function ImportExportDialog({ mode, onClose }: ImportExportDialogProps) {
  const building = useBuildingStore((state) => state.building)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExport = () => {
    if (!building) return

    try {
      exportBuilding(building)
      onClose()
    } catch (err) {
      setError('Fehler beim Exportieren: ' + (err as Error).message)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const importedBuilding = importFromJSON(text)

      useBuildingStore.setState({
        building: importedBuilding,
        history: {
          past: [],
          future: [],
        },
      })

      onClose()
    } catch (err) {
      setError('Fehler beim Importieren: ' + (err as Error).message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-full bg-primary-100 p-3">
              {mode === 'export' ? (
                <Download className="h-6 w-6 text-primary-600" />
              ) : (
                <Upload className="h-6 w-6 text-primary-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'export' ? 'Projekt exportieren' : 'Projekt importieren'}
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            {mode === 'export'
              ? 'Speichern Sie Ihr Gebäude als JSON-Datei'
              : 'Laden Sie ein gespeichertes Projekt'}
          </p>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        {mode === 'export' ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <FileJson className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-800">{building?.name || 'Unbenannt'}</p>
                  <p className="text-xs text-gray-500">
                    {building?.elements.length || 0} Elemente · Erstellt am{' '}
                    {building?.metadata.created.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleExport}
              className="w-full rounded-lg bg-primary-600 px-4 py-3 font-medium text-white transition-colors hover:bg-primary-700"
            >
              <Download className="mr-2 inline h-5 w-5" />
              Als JSON herunterladen
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center transition-colors hover:border-primary-500 hover:bg-primary-50"
            >
              <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
              <p className="font-medium text-gray-700">Datei auswählen</p>
              <p className="text-sm text-gray-500">oder hier ablegen</p>
            </button>

            <p className="text-xs text-gray-500">Unterstützte Formate: JSON (.json)</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Abbrechen
        </button>
      </div>
    </div>
  )
}
