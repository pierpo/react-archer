import React from 'react';
import { LineType, ShapeType, SourceToTargetType } from '../../types';
import { endShapeDefaultProp } from '../ArcherContainer.constants';
import { getEndShapeFromStyle, getSourceToTargets, getMarkerId } from '../ArcherContainer.helpers';
import { SourceToTargetsArrayType } from '../ArcherContainer.types';

const circleMarker = (style: LineType, endShape: ShapeType) => () => {
  // TODO idea to merge params: we could use a deep merge function that keeps the first non-undefined values obtained

  const radius =
    style.endShape?.circle?.radius || endShape.circle?.radius || endShapeDefaultProp.circle.radius;

  const strokeWidth =
    style.endShape?.circle?.strokeWidth ||
    endShape.circle?.strokeWidth ||
    endShapeDefaultProp.circle.strokeWidth;

  const strokeColor =
    style.endShape?.circle?.strokeColor ||
    endShape.circle?.strokeColor ||
    endShapeDefaultProp.circle.strokeColor;

  const fillColor =
    style.endShape?.circle?.fillColor ||
    endShape.circle?.fillColor ||
    endShapeDefaultProp.circle.fillColor;

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
};

const arrowMarker = (style: LineType, endShape: ShapeType, strokeColor: string) => () => {
  const newStrokeColor = style.strokeColor || strokeColor;
  const newArrowLength =
    style.endShape?.arrow?.arrowLength ??
    endShape?.arrow?.arrowLength ??
    endShapeDefaultProp.arrow.arrowLength;
  const newArrowThickness =
    style.endShape?.arrow?.arrowThickness ||
    endShape?.arrow?.arrowThickness ||
    endShapeDefaultProp.arrow.arrowThickness;
  const arrowPath = `M0,0 L0,${newArrowThickness} L${newArrowLength},${newArrowThickness / 2} z`;

  return {
    markerWidth: newArrowLength,
    markerHeight: newArrowThickness,
    refX: 0,
    refY: newArrowThickness / 2,
    path: <path d={arrowPath} fill={newStrokeColor} />,
  };
};

const buildShape = ({
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

  const shapeMap = {
    circle: circleMarker(style, endShape),
    arrow: arrowMarker(style, endShape, strokeColor),
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
