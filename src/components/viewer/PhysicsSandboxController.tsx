'use client'

import { useEffect } from 'react'
import { useUIStore } from '@/lib/store/uiStore'
import { useBuildingStore } from '@/lib/store/buildingStore'
import { physicsService } from '@/lib/physics/physicsService'

export function PhysicsSandboxController() {
  const isPhysicsSandboxMode = useUIStore((state) => state.isPhysicsSandboxMode)
  const building = useBuildingStore((state) => state.building)

  useEffect(() => {
    if (!physicsService.world) return

    physicsService.setGravity(isPhysicsSandboxMode)
    if (building) {
      building.elements.forEach((element) => {
        physicsService.setBodyType(element.id, isPhysicsSandboxMode)
      })
    }
  }, [isPhysicsSandboxMode, building])

  return null
}
