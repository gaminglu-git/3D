import { BuildingElement } from './building';
import { VisualProperties } from './materials';

export interface BaseElementProps<T extends BuildingElement> {
  element: T;
  isSelected: boolean;
  material: VisualProperties;
  onClick: (id: string, shiftKey: boolean) => void;
  children?: React.ReactNode;
}
