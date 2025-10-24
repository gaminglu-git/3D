'use client'

import { useEffect, useCallback, useRef } from 'react'
import { physicsService } from '@/lib/physics/physicsService'
import { useBuildingStore } from '@/lib/store/buildingStore'

export function usePhysics() {
  const isInitialized = useBuildingStore((state) => state.isInitialized)
  const building = useBuildingStore((state) => state.building)
  const setCollisions = useBuildingStore((state) => state.setCollisions)
  const setIsInitialized = useBuildingStore((state) => state.setInitialized)
  const initPromiseRef = useRef<Promise<void> | null>(null)

  useEffect(() => {
    // Only initialize physics in the browser
    if (typeof window === 'undefined') return
    
    if (!isInitialized && !initPromiseRef.current) {
      console.log('Starting physics initialization...')
      initPromiseRef.current = physicsService.init().then(() => {
        console.log('Physics initialization completed successfully')
        setIsInitialized(true)
        initPromiseRef.current = null
      }).catch((error) => {
        console.error('Failed to initialize physics service:', error)
        initPromiseRef.current = null
        // Don't set isInitialized to true on error
      })
    }
  }, [isInitialized, setIsInitialized])

  const recomputeCollisions = useCallback(async () => {
    // Only run in the browser
    if (typeof window === 'undefined') return
    
    if (isInitialized && building) {
      try {
        await physicsService.syncWithBuilding(building.elements || [])
        const newCollisions = physicsService.getCollisions()
        setCollisions(newCollisions)
      } catch (error) {
        console.error('Failed to recompute collisions:', error)
      }
    }
  }, [isInitialized, building, setCollisions])

  /* This useEffect hook is the primary cause of the performance issues.
   * It was triggering a full collision recomputation on EVERY change to the building model,
   * leading to significant lag, especially with complex models.
   * By removing it, we shift to a more controlled, manual recomputation strategy,
   * where collision checks are only triggered when necessary (e.g., after a user action is complete).
  useEffect(() => {
    recomputeCollisions();
  }, [building, recomputeCollisions])
  */

  return { isPhysicsReady: isInitialized, recomputeCollisions }
}
