import React, { DOMAttributes } from 'react';
import { Property } from 'csstype';
import Vector2 from '../geometry/Vector2';
import { AnchorPositionType, ShapeType, ValidLineStyles } from '../types';
import { endShapeDefaultProp } from '../ArcherContainer/ArcherContainer.constants';
import {
  computeArrowPointAccordingToArrowHead,
  computeStartingAnchorPosition,
  computeEndingAnchorPosition,
  computeLabelDimensions,
  computePathString,
} from './SvgArrow.helpers';

type Props = {
  className?: string;
  startingPoint: Vector2;
  startingAnchorOrientation: AnchorPositionType;
  endingPoint: Vector2;
  endingAnchorOrientation: AnchorPositionType;
  strokeColor: string;
  strokeWidth: number;
  strokeDasharray?: string;
  arrowLabel?: React.ReactNode | null | undefined;
  arrowMarkerId: string;
  lineStyle: ValidLineStyles;
  offset?: number;
  enableStartMarker?: boolean;
  disableEndMarker?: boolean;
  endShape: ShapeType;
  domAttributes?: DOMAttributes<SVGElement>;
  hitSlop?: number;
  cursor?: Property.Cursor;
};

const SvgArrow = ({
  className,
  startingPoint,
  startingAnchorOrientation,
  endingPoint,
  endingAnchorOrientation,
  strokeColor,
  strokeWidth,
  strokeDasharray,
  arrowLabel,
  arrowMarkerId,
  lineStyle,
  offset,
  enableStartMarker,
  disableEndMarker,
  endShape,
  domAttributes,
  hitSlop = 10,
  cursor = 'pointer',
}: Props) => {
  const actualArrowLength = endShape.circle
    ? (endShape.circle.radius ?? endShapeDefaultProp.circle.radius) * 2
    : (endShape.arrow?.arrowLength ?? endShapeDefaultProp.arrow.arrowLength) * 2;

  // Starting point with arrow
  const { xPoint: xStart, yPoint: yStart } = computeArrowPointAccordingToArrowHead(
    startingPoint.x,
    startingPoint.y,
    enableStartMarker ? actualArrowLength : 0,
    strokeWidth,
    startingAnchorOrientation,
    lineStyle,
    endingPoint.x,
    endingPoint.y,
  );

  // Ending point with arrow
  const { xPoint: xEnd, yPoint: yEnd } = computeArrowPointAccordingToArrowHead(
    endingPoint.x,
    endingPoint.y,
    disableEndMarker ? 0 : actualArrowLength,
    strokeWidth,
    endingAnchorOrientation,
    lineStyle,
    startingPoint.x,
    startingPoint.y,
  );

  // Starting position
  const { xAnchor1, yAnchor1 } = computeStartingAnchorPosition(
    xStart,
    yStart,
    xEnd,
    yEnd,
    startingAnchorOrientation,
  );

  // Ending position
  const { xAnchor2, yAnchor2 } = computeEndingAnchorPosition(
    xStart,
    yStart,
    xEnd,
    yEnd,
    endingAnchorOrientation,
  );

  const pathString = computePathString({
    xStart,
    yStart,
    xAnchor1,
    yAnchor1,
    xAnchor2,
    yAnchor2,
    xEnd,
    yEnd,
    lineStyle,
    offset,
  });

  const { xLabel, yLabel, labelWidth, labelHeight } = computeLabelDimensions(
    xStart,
    yStart,
    xEnd,
    yEnd,
  );

  const markerUrl = `url(#${arrowMarkerId})`;

  return (
    <g className={className}>
      <path
        d={pathString}
        style={{
          fill: 'none',
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray,
        }}
        markerStart={enableStartMarker ? markerUrl : undefined}
        markerEnd={disableEndMarker ? undefined : markerUrl}
      />

      {/* This a thicker fake path to grab DOM events - makes clicking on the arrow more usable */}
      {domAttributes && (
        <path
          d={pathString}
          style={{
            fill: 'none',
            stroke: 'rgba(0, 0, 0, 0)',
            strokeWidth: hitSlop,
            cursor: domAttributes ? cursor : 'initial',
            pointerEvents: 'all',
          }}
          {...domAttributes}
        />
      )}

      {arrowLabel && (
        <foreignObject
          x={xLabel}
          y={yLabel}
          width={labelWidth}
          height={labelHeight}
          style={{
            overflow: 'visible',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translateX(-50%) translateY(-50%)',
              pointerEvents: 'all',
            }}
          >
            <div>{arrowLabel}</div>
          </div>
        </foreignObject>
      )}
    </g>
  );
};

export default SvgArrow;
