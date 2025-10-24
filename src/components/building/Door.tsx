'use client'

import { useRef, memo } from 'react'
import { Mesh } from 'three'
import { Door as DoorType } from '@/lib/types/building'
import { useMaterialTextures } from '@/hooks/useMaterialTextures'
import { BaseElementProps } from '@/lib/types/components'

const DoorComponent = memo(function DoorComponent({
  element: door,
  isSelected,
  material,
  onClick,
}: BaseElementProps<DoorType>) {
  const meshRef = useRef<Mesh>(null)
  const { textures } = useMaterialTextures(material)

  const handleClick = (e: any) => {
    e.stopPropagation()
    if (onClick) {
        onClick(door.id, e.shiftKey)
    }
  }

  return (
    <group position={[door.position.x, door.position.y, door.position.z]} onClick={handleClick}>
      {/* Door frame */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[door.width + 0.1, door.height + 0.1, 0.12]} />
        <meshStandardMaterial color={isSelected ? '#60a5fa' : '#2a2a2a'} roughness={0.7} />
      </mesh>

      {/* Door panel */}
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
        <boxGeometry args={[door.width, door.height, 0.06]} />
        <meshStandardMaterial
          color={isSelected ? '#3b82f6' : material.color}
          map={isSelected ? undefined : textures.colorMap}
          normalMap={isSelected ? undefined : textures.normalMap}
          roughnessMap={isSelected ? undefined : textures.roughnessMap}
          metalnessMap={isSelected ? undefined : textures.metalnessMap}
          roughness={material.roughness}
          metalness={material.metalness}
        />
      </mesh>

      {/* Door handle */}
      <mesh position={[door.width * 0.35, 0, 0.05]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
})

export default DoorComponent
