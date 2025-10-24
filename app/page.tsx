'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import ToolModeIndicator from '@/components/ui/ToolModeIndicator'
import TransformFeedback from '@/components/ui/TransformFeedback'
import WelcomeDialog from '@/components/ui/WelcomeDialog'
import { PhysicsStressTestTool } from '@/components/tools/PhysicsStressTestTool' // Import the new tool

// Dynamic import to avoid SSR issues with Three.js
const ViewerScene = dynamic(() => import('@/components/viewer/ViewerScene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        <p className="text-gray-600">Loading 3D Viewer...</p>
      </div>
    </div>
  ),
})

export default function HomePage() {
  return (
    <ErrorBoundary>
      <main className="h-screen w-screen overflow-hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <ViewerScene />
        </Suspense>
      </main>
    </ErrorBoundary>
  )
}
