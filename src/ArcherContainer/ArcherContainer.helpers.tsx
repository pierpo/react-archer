import {
  EntityRelationType,
  LineType,
  ShapeType,
  SourceToTargetType,
  ValidShapeTypes,
} from '../types';
import { SourceToTargetsArrayType } from './ArcherContainer.types';

const possibleShapes: Array<ValidShapeTypes> = ['arrow', 'circle'];

export const getShapeStyleFromShape = (style: LineType, isStartShape: boolean) => {
  return isStartShape ? style.startShape : style.endShape;
};

export const getShapeFromStyle = (shapeObj: LineType, isStartShape: boolean) => {
  const shapeStyle = getShapeStyleFromShape(shapeObj, isStartShape);
  if (!shapeStyle) {
    return possibleShapes[0];
  }

  return (
    (Object.keys(shapeStyle) as ValidShapeTypes[]).filter((key) =>
      possibleShapes.includes(key),
    )[0] || possibleShapes[0]
  );
};

export const getSourceToTargets = (
  sourceToTargetsMap: Record<string, SourceToTargetsArrayType>,
): SourceToTargetType[] => {
  // Object.values is unavailable in IE11
  const jaggedSourceToTargets = Object.keys(sourceToTargetsMap).map(
    (key: string) => sourceToTargetsMap[key],
  );
  // Flatten
  return ([] as SourceToTargetType[]).concat
    .apply([], jaggedSourceToTargets)
    .sort((a, b) => a.order - b.order);
};

export const createShapeObj = (style: LineType, shape: ShapeType, isStartShape: boolean) => {
  const chosenShape = getShapeFromStyle(style, isStartShape);
  const shapeStyle = getShapeStyleFromShape(style, isStartShape);
  const shapeObjMap = {
    arrow: () => ({
      arrow: {
        ...shape?.arrow,
        ...shapeStyle?.arrow,
      },
    }),
    circle: () => ({
      circle: {
        ...shape?.circle,
        ...shapeStyle?.circle,
      },
    }),
  };
  return shapeObjMap[chosenShape]();
};

/** Generates an id for an arrow marker
 * Useful to have one marker per arrow so that each arrow
 * can have a different color!
 * */
export const getMarkerId = (
  uniqueId: string,
  source: EntityRelationType,
  target: EntityRelationType,
  isStartShape: boolean,
): string => {
  return `${uniqueId}${source.id}${target.id}-${isStartShape ? 'start' : 'end'}`;
};
