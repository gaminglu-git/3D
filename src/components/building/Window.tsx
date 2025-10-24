'use client'

import { useRef, memo } from 'react'
import { Mesh } from 'three'
import { Window as WindowType } from '@/lib/types/building'
import { useMaterialTextures } from '@/hooks/useMaterialTextures'
import { BaseElementProps } from '@/lib/types/components'

const WindowComponent = memo(function WindowComponent({
  element: windowElement,
  isSelected,
  material,
  onClick,
}: BaseElementProps<WindowType>) {
  const meshRef = useRef<Mesh>(null)
  const { textures } = useMaterialTextures(material) // Although glass won't use textures, this keeps it consistent

  const handleClick = (e: any) => {
    e.stopPropagation()
    if (onClick) {
        onClick(windowElement.id, e.shiftKey)
    }
  }

  return (
    <group
      position={[
        windowElement.position.x,
        windowElement.position.y,
        windowElement.position.z,
      ]}
      onClick={handleClick}
    >
      {/* Window frame */}
      <mesh castShadow>
        <boxGeometry args={[windowElement.width, windowElement.height, 0.08]} />
        <meshStandardMaterial
          color={isSelected ? '#60a5fa' : '#4a4a4a'}
          roughness={0.6}
        />
      </mesh>

      {/* Glass */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry
          args={[windowElement.width - 0.1, windowElement.height - 0.1, 0.02]}
        />
        <meshStandardMaterial
          color={isSelected ? '#3b82f6' : material.color}
          transparent
          opacity={material.opacity || 0.7}
          roughness={material.roughness}
          metalness={material.metalness}
        />
      </mesh>
    </group>
  )
})

export default WindowComponent
