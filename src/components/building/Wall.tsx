'use client'

import { useRef } from 'react'
import * as THREE from 'three'
import { WallElement, isDoor, isWindow } from '@/lib/types/building'
import { useMaterialTextures } from '@/hooks/useMaterialTextures'
import { useBuildingStore } from '@/lib/store/buildingStore'
import Door from './Door'
import Window from './Window'

const errorMaterial = new THREE.MeshStandardMaterial({ color: 'hotpink' })

interface WallProps {
  wall: WallElement
  isSelected: boolean
}

export default function Wall({ wall, isSelected }: WallProps) {
  const { position, rotation, dimensions, materialId } = wall
  const meshRef = useRef<THREE.Mesh>(null!)
  const getMaterial = useBuildingStore((state) => state.getMaterial)
  const materialVisuals = getMaterial(materialId)?.visual

  if (!materialVisuals) {
    console.error(`Material "${materialId}" not found for wall ${wall.id}.`)
    return (
      <mesh
        position={[position.x, position.y, position.z]}
        rotation={[rotation.x, rotation.y, rotation.z]}
      >
        <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
        <primitive object={errorMaterial} attach="material" />
      </mesh>
    )
  }

  const { textures, status } = useMaterialTextures(materialVisuals)

  const material = (() => {
    if (status !== 'success') {
      return new THREE.MeshStandardMaterial({ color: 'grey' })
    }

    const materialProps: THREE.MeshStandardMaterialParameters = {}
    if (textures.colorMap) materialProps.map = textures.colorMap
    if (textures.normalMap) materialProps.normalMap = textures.normalMap
    if (textures.roughnessMap) materialProps.roughnessMap = textures.roughnessMap
    if (textures.metalnessMap) materialProps.metalnessMap = textures.metalnessMap

    return new THREE.MeshStandardMaterial(materialProps)
  })()

  return (
    <group position={[position.x, position.y, position.z]} rotation={[rotation.x, rotation.y, rotation.z]}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
        <primitive object={material} attach="material" />
        {isSelected && (
          <lineSegments>
            <edgesGeometry
              args={[new THREE.BoxGeometry(dimensions.width, dimensions.height, dimensions.depth)]}
            />
            <lineBasicMaterial color="yellow" />
          </lineSegments>
        )}
      </mesh>
      {wall.openings?.map((opening) => {
        const openingMaterial = getMaterial(opening.materialId)?.visual
        if (!openingMaterial) {
            console.error(`Material "${opening.materialId}" not found for opening ${opening.id}.`)
            return null
        }
        
        if (isDoor(opening)) {
          return (
            <Door
              key={opening.id}
              element={opening}
              isSelected={false}
              material={openingMaterial}
              onClick={() => {}}
            />
          )
        }
        if (isWindow(opening)) {
          return (
            <Window
              key={opening.id}
              element={opening}
              isSelected={false}
              material={openingMaterial}
              onClick={() => {}}
            />
          )
        }
        return null
      })}
    </group>
  )
}
