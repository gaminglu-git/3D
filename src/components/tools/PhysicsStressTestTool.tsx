'use client'

import { useState } from 'react'
import { usePhysics } from '@/hooks/usePhysics'
import { useBuildingStore } from '@/lib/store/buildingStore'
import { BuildingElement, ElementType } from '@/lib/types/building'
import { Button } from '@/components/ui/Button'

const createTestElement = (id: number): BuildingElement => ({
  id: `stress-test-${id}`,
  type: 'wall' as const,
  position: {
    x: Math.random() * 100 - 50,
    y: Math.random() * 10 - 5,
    z: Math.random() * 100 - 50,
  },
  dimensions: {
    width: Math.random() * 2 + 0.5,
    height: 3,
    depth: Math.random() * 0.5 + 0.1,
  },
  rotation: { x: 0, y: Math.random() * Math.PI * 2, z: 0 },
  floorLevel: 0,
  visible: true,
  locked: false,
})

export function PhysicsStressTestTool() {
  const { isPhysicsReady } = usePhysics()
  const addElement = useBuildingStore((state) => state.addElement)
  const deleteElement = useBuildingStore((state) => state.deleteElement)
  const [testElements, setTestElements] = useState<BuildingElement[]>([])
  const [testRunning, setTestRunning] = useState(false)

  const runTest = (count: number) => {
    if (!isPhysicsReady) {
      alert('Physics engine not ready.')
      return
    }
    setTestRunning(true)
    const newElements = Array.from({ length: count }, (_, i) =>
      createTestElement(i),
    )
    setTestElements(newElements)
    // Add elements one by one as the store method expects
    newElements.forEach(addElement)
    console.log(`Added ${count} elements for stress test.`)
  }

  const clearTest = () => {
    // Remove elements one by one
    testElements.forEach(element => deleteElement(element.id))
    setTestElements([])
    setTestRunning(false)
    console.log('Cleared stress test elements.')
  }

  return (
    <div className="absolute bottom-10 right-10 z-50 bg-gray-800 bg-opacity-80 p-4 rounded-lg text-white shadow-lg flex flex-col gap-2">
      <h3 className="text-lg font-bold text-center">Physics Stress Test</h3>
      {!testRunning ? (
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => runTest(100)} disabled={!isPhysicsReady}>
            100 Walls
          </Button>
          <Button onClick={() => runTest(500)} disabled={!isPhysicsReady}>
            500 Walls
          </Button>
          <Button onClick={() => runTest(1000)} disabled={!isPhysicsReady}>
            1k Walls
          </Button>
          <Button onClick={() => runTest(5000)} disabled={!isPhysicsReady}>
            5k Walls
          </Button>
        </div>
      ) : (
        <Button onClick={clearTest} variant="destructive">
          Clear Test Elements
        </Button>
      )}
      {!isPhysicsReady && (
        <p className="text-xs text-center text-yellow-400">
          Waiting for physics engine...
        </p>
      )}
    </div>
  )
}
