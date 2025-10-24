import { RoofElement } from '@/lib/types/building';
import * as THREE from 'three';

interface RoofProps {
  roof: RoofElement;
  isSelected: boolean;
}

export default function Roof({ roof, isSelected }: RoofProps) {
  const { position, rotation, dimensions } = roof;

  return (
    <mesh position={[position.x, position.y, position.z]}>
      <boxGeometry args={[dimensions.width, dimensions.height, dimensions.depth]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}
