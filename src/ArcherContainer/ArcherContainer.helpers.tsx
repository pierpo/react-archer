import {
  ValidShapeTypes,
  LineType,
  SourceToTargetType,
  ShapeType,
  EntityRelationType,
} from '../types';
import { SourceToTargetsArrayType } from './ArcherContainer.types';

const possibleShapes: Array<ValidShapeTypes> = ['arrow', 'circle'];

export const getEndShapeFromStyle = (shapeObj: LineType) => {
  if (!shapeObj.endShape) {
    return possibleShapes[0];
  }

  return (
    (Object.keys(shapeObj.endShape) as ValidShapeTypes[]).filter((key) =>
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

export const createShapeObj = (style: LineType, endShape: ShapeType) => {
  const chosenEndShape = getEndShapeFromStyle(style);
  const shapeObjMap = {
    arrow: () => ({
      arrow: {
        ...endShape?.arrow,
        ...style.endShape?.arrow,
      },
    }),
    circle: () => ({
      circle: {
        ...endShape?.circle,
        ...style.endShape?.circle,
      },
    }),
  };
  return shapeObjMap[chosenEndShape]();
};

/** Generates an id for an arrow marker
 * Useful to have one marker per arrow so that each arrow
 * can have a different color!
 * */
export const getMarkerId = (
  uniqueId: string,
  source: EntityRelationType,
  target: EntityRelationType,
): string => {
  return `${uniqueId}${source.id}${target.id}`;
};
