import React from 'react';
import { EntityRelationType, LineType, ShapeType, SourceToTargetType } from '../../types';
import { shapeDefaultProp } from '../ArcherContainer.constants';
import {
  getMarkerId,
  getShapeFromStyle,
  getShapeStyleFromShape,
  getSourceToTargets,
} from '../ArcherContainer.helpers';
import { SourceToTargetsArrayType } from '../ArcherContainer.types';

const circleMarker = (style: LineType, isStartShape: boolean, shape: ShapeType) => () => {
  // TODO idea to merge params: we could use a deep merge function that keeps the first non-undefined values obtained

  const shapeStyle = getShapeStyleFromShape(style, isStartShape);

  const radius =
    shapeStyle?.circle?.radius || shape.circle?.radius || shapeDefaultProp.circle.radius;

  const strokeWidth =
    shapeStyle?.circle?.strokeWidth ||
    shape.circle?.strokeWidth ||
    shapeDefaultProp.circle.strokeWidth;

  const strokeColor =
    shapeStyle?.circle?.strokeColor ||
    shape.circle?.strokeColor ||
    shapeDefaultProp.circle.strokeColor;

  const fillColor =
    shapeStyle?.circle?.fillColor || shape.circle?.fillColor || shapeDefaultProp.circle.fillColor;

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

const arrowMarker =
  (style: LineType, isStartShape: boolean, shape: ShapeType, strokeColor: string) => () => {
    const shapeStyle = getShapeStyleFromShape(style, isStartShape);
    const newStrokeColor = style.strokeColor || strokeColor;
    const newArrowLength =
      shapeStyle?.arrow?.arrowLength ??
      shape?.arrow?.arrowLength ??
      shapeDefaultProp.arrow.arrowLength;
    const newArrowThickness =
      shapeStyle?.arrow?.arrowThickness ||
      shape?.arrow?.arrowThickness ||
      shapeDefaultProp.arrow.arrowThickness;
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
  isStartShape,
  strokeColor,
  shape,
}: {
  style: LineType;
  isStartShape: boolean;
  strokeColor: string;
  shape: ShapeType;
}): {
  markerHeight: number;
  markerWidth: number;
  path: React.ReactNode;
  refX: number;
  refY: number;
} => {
  const chosenShape = getShapeFromStyle(style, isStartShape);

  const shapeMap = {
    circle: circleMarker(style, isStartShape, shape),
    arrow: arrowMarker(style, isStartShape, shape, strokeColor),
  };
  return shapeMap[chosenShape]();
};

const buildMarker = ({
  style,
  isStartShape,
  strokeColor,
  shape,
  uniqueId,
  source,
  target,
}: {
  style: LineType;
  isStartShape: boolean;
  strokeColor: string;
  shape: ShapeType;
  uniqueId: string;
  source: EntityRelationType;
  target: EntityRelationType;
}) => {
  const { markerWidth, markerHeight, path, refX, refY } = buildShape({
    style,
    isStartShape,
    strokeColor,
    shape,
  });

  return (
    <marker
      id={getMarkerId(uniqueId, source, target, isStartShape)}
      key={getMarkerId(uniqueId, source, target, isStartShape)}
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
};

/** Generates all the markers
 * We want one marker per arrow so that each arrow can have
 * a different color or size
 * */
export const ArrowMarkers = ({
  enableStartMarker,
  enableEndMarker,
  sourceToTargetsMap,
  startShape,
  endShape,
  strokeColor,
  uniqueId,
}: {
  enableStartMarker: boolean;
  enableEndMarker: boolean;
  sourceToTargetsMap: Record<string, SourceToTargetsArrayType>;
  startShape: ShapeType;
  endShape: ShapeType;
  strokeColor: string;
  uniqueId: string;
}) => {
  return (
    <>
      {getSourceToTargets(sourceToTargetsMap).map(
        ({ source, target, style = {} }: SourceToTargetType, index: number) => (
          <React.Fragment key={`${uniqueId}-${index}`}>
            {enableStartMarker &&
              buildMarker({
                shape: startShape,
                isStartShape: true,
                style,
                strokeColor,
                uniqueId,
                source,
                target,
              })}
            {enableEndMarker &&
              buildMarker({
                shape: endShape,
                isStartShape: false,
                style,
                strokeColor,
                uniqueId,
                source,
                target,
              })}
          </React.Fragment>
        ),
      )}
    </>
  );
};
