import { useState, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useBuildingStore } from '@/lib/store/buildingStore';
import { FloorElement } from '@/lib/types/building';

const DEFAULT_FLOOR_THICKNESS = 0.2;

export const FloorTool = () => {
  const { camera } = useThree();
  const addElement = useBuildingStore((state) => state.addElement);
  const activeFloorLevel = useBuildingStore((state) => state.activeFloorLevel);

  const [startPoint, setStartPoint] = useState<THREE.Vector3 | null>(null);
  const [endPoint, setEndPoint] = useState<THREE.Vector3 | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const getIntersection = useCallback((event: any): THREE.Vector3 | null => {
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -activeFloorLevel);
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(event.pointer, camera);
    const point = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, point);
    return point;
  }, [camera, activeFloorLevel]);

  const handlePointerDown = useCallback((event: any) => {
    event.stopPropagation();
    const intersection = getIntersection(event);
    if (!intersection) return;

    setIsDrawing(true);
    setStartPoint(intersection);
    setEndPoint(intersection);
  }, [getIntersection]);

  const handlePointerMove = useCallback((event: any) => {
    if (!isDrawing || !startPoint) return;
    event.stopPropagation();
    const intersection = getIntersection(event);
    if (intersection) {
      setEndPoint(intersection);
    }
  }, [isDrawing, startPoint, getIntersection]);

  const createFloor = useCallback((start: THREE.Vector3, end: THREE.Vector3) => {
    if (!start || !end) return;

    const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const dimensions = {
      width: Math.abs(start.x - end.x),
      height: DEFAULT_FLOOR_THICKNESS,
      depth: Math.abs(start.z - end.z),
    };

    const newFloor: FloorElement = {
      id: `floor-${Date.now()}`,
      type: 'floor',
      position: { x: center.x, y: activeFloorLevel + dimensions.height / 2, z: center.z },
      rotation: { x: 0, y: 0, z: 0 },
      dimensions,
      floorLevel: activeFloorLevel,
      visible: true,
      locked: false,
      materialId: 'concrete-slab',
    };

    console.log('[FloorTool] Creating new floor:', newFloor);
    addElement(newFloor);
  }, [addElement, activeFloorLevel]);

  const handlePointerUp = useCallback((event: any) => {
    if (isDrawing && startPoint && endPoint && startPoint.distanceTo(endPoint) > 0.1) {
      if (event) event.stopPropagation();
      createFloor(startPoint, endPoint);
    }
    setIsDrawing(false);
    setStartPoint(null);
    setEndPoint(null);
  }, [isDrawing, startPoint, endPoint, createFloor]);

  return (
    <>
      <mesh
        position={[0, activeFloorLevel, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOut={() => { if (isDrawing) handlePointerUp(null); }}
        visible={false}
      >
        <planeGeometry args={[1000, 1000]} />
        <meshBasicMaterial />
      </mesh>

      {isDrawing && startPoint && endPoint && (
        <mesh
          position={[
            (startPoint.x + endPoint.x) / 2,
            activeFloorLevel + DEFAULT_FLOOR_THICKNESS / 2,
            (startPoint.z + endPoint.z) / 2,
          ]}
        >
          <boxGeometry
            args={[
              Math.abs(endPoint.x - startPoint.x),
              DEFAULT_FLOOR_THICKNESS,
              Math.abs(endPoint.z - startPoint.z),
            ]}
          />
          <meshBasicMaterial color="blue" transparent opacity={0.5} />
        </mesh>
      )}
    </>
  );
};
