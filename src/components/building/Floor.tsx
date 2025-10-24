'use client'

import { FloorElement } from '@/lib/types/building';
import * as THREE from 'three';

interface FloorProps {
  floor: FloorElement;
  isSelected: boolean;
}

export default function Floor({ floor, isSelected }: FloorProps) {
  const { position, rotation, dimensions } = floor;

  return (
    <mesh position={[position.x, position.y, position.z]}>
      <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}
