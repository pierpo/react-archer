import React from 'react';
import {
  LineType,
  ShapeType,
  ValidShapeTypes,
  ArrowShapeType,
  CircleShapeType,
  SourceToTargetType,
} from '../../types';
import { endShapeDefaultProp } from '../ArcherContainer.constants';
import { getEndShapeFromStyle, getSourceToTargets, getMarkerId } from '../ArcherContainer.helpers';
import { SourceToTargetsArrayType } from '../ArcherContainer.types';

export const buildShape = ({
  style,
  strokeColor,
  endShape,
}: {
  style: LineType;
  strokeColor: string;
  endShape: ShapeType;
}): {
  markerHeight: number;
  markerWidth: number;
  path: React.ReactNode;
  refX: number;
  refY: number;
} => {
  const chosenEndShape = getEndShapeFromStyle(style);

  const getProp = (shape: ValidShapeTypes, prop: keyof ArrowShapeType | keyof CircleShapeType) => {
    return (
      // @ts-expect-error needs changes at runtime to fix the TS error
      style.endShape?.[shape]?.[prop] ||
      // @ts-expect-error needs changes at runtime to fix the TS error
      endShape?.[shape]?.[prop] ||
      // @ts-expect-error needs changes at runtime to fix the TS error
      endShapeDefaultProp[shape][prop]
    );
  };

  const shapeMap = {
    circle: () => {
      const radius = getProp('circle', 'radius');
      const strokeWidth = getProp('circle', 'strokeWidth');
      const strokeColor = getProp('circle', 'strokeColor');
      const fillColor = getProp('circle', 'fillColor');
      return {
        markerWidth: radius * 4,
        markerHeight: radius * 4,
        refX: radius * 2 + strokeWidth,
        refY: radius * 2,
        path: (
          <circle
            cx={radius * 2}
            cy={radius * 2}
            r={radius}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        ),
      };
    },
    arrow: () => {
      const newStrokeColor = style.strokeColor || strokeColor;
      const newArrowLength =
        style.endShape?.arrow?.arrowLength ??
        endShape?.arrow?.arrowLength ??
        endShapeDefaultProp.arrow.arrowLength;
      const newArrowThickness =
        style.endShape?.arrow?.arrowThickness ||
        endShape?.arrow?.arrowThickness ||
        endShapeDefaultProp.arrow.arrowThickness;
      const arrowPath = `M0,0 L0,${newArrowThickness} L${newArrowLength},${
        newArrowThickness / 2
      } z`;
      return {
        markerWidth: newArrowLength,
        markerHeight: newArrowThickness,
        refX: 0,
        refY: newArrowThickness / 2,
        path: <path d={arrowPath} fill={newStrokeColor} />,
      };
    },
  };
  return shapeMap[chosenEndShape]();
};

/** Generates all the markers
 * We want one marker per arrow so that each arrow can have
 * a different color or size
 * */
export const ArrowMarkers = ({
  sourceToTargetsMap,
  endShape,
  strokeColor,
  uniqueId,
}: {
  sourceToTargetsMap: Record<string, SourceToTargetsArrayType>;
  endShape: ShapeType;
  strokeColor: string;
  uniqueId: string;
}) => {
  return (
    <>
      {getSourceToTargets(sourceToTargetsMap).map(
        ({ source, target, style = {} }: SourceToTargetType) => {
          const { markerHeight, markerWidth, path, refX, refY } = buildShape({
            style,
            endShape,
            strokeColor,
          });

          return (
            <marker
              id={getMarkerId(uniqueId, source, target)}
              key={getMarkerId(uniqueId, source, target)}
              markerWidth={markerWidth}
              markerHeight={markerHeight}
              refX={refX}
              refY={refY}
              orient="auto-start-reverse"
              markerUnits="strokeWidth"
            >
              {path}
            </marker>
          );
        },
      )}
    </>
  );
};
