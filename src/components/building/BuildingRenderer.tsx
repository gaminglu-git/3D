'use client'

import { memo, useMemo, useCallback, Suspense } from 'react'
import * as THREE from 'three'
import { useBuildingStore } from '@/lib/store/buildingStore'
import Wall from './Wall'
import Floor from './Floor'
import Roof from './Roof'
import {
  isWall,
  isFloorElement,
  isRoofElement,
  BuildingElement,
  WallElement,
  FloorElement,
  RoofElement,
  isDoor,
  isWindow,
} from '@/lib/types/building';
import { getBuildingBoundingBox } from '@/lib/utils/geometry';
import Door from './Door'
import Window from './Window'

export default memo(function BuildingRenderer() {
  const elements = useBuildingStore((state) => state.building?.elements ?? []);
  const selectedElementIds = useBuildingStore((state) => state.selectedElementIds);

  return (
    <group>
      {elements.map((element) => {
        if (!element.visible) return null;

        const isSelected = selectedElementIds.includes(element.id);

        if (isWall(element)) {
          return <Wall key={element.id} wall={element as WallElement} isSelected={isSelected} />;
        }

        if (isFloorElement(element)) {
          return <Floor key={element.id} floor={element as FloorElement} isSelected={isSelected} />;
        }

        if (isRoofElement(element)) {
          return <Roof key={element.id} roof={element as RoofElement} isSelected={isSelected} />;
        }

        return null;
      })}
    </group>
  );
});
