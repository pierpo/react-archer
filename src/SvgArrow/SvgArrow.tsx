import React from 'react';
import Vector2 from '../geometry/Vector2';
import { AnchorPositionType, ValidLineStyles } from '../types';
import { computeArrowDirectionVector } from './SvgArrow.helper';

type Props = {
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
  endShape: Record<string, any>;
};

export function computeArrowPointAccordingToArrowHead(
  xArrowHeadPoint: number,
  yArrowHeadPoint: number,
  arrowLength: number,
  strokeWidth: number,
  endingAnchorOrientation: AnchorPositionType,
  lineStyle?: ValidLineStyles,
  xArrowStart?: number,
  yArrowStart?: number,
) {
  let { arrowX, arrowY } = computeArrowDirectionVector(endingAnchorOrientation);

  if (lineStyle === 'straight' && xArrowStart !== undefined && yArrowStart !== undefined) {
    const angle = Math.atan2(yArrowStart - yArrowHeadPoint, xArrowStart - xArrowHeadPoint);
    arrowX = Math.cos(angle);
    arrowY = Math.sin(angle);
  }

  const xPoint = xArrowHeadPoint + (arrowX * arrowLength * strokeWidth) / 2;
  const yPoint = yArrowHeadPoint + (arrowY * arrowLength * strokeWidth) / 2;
  return {
    xPoint,
    yPoint,
  };
}

export function computeStartingAnchorPosition(
  xStart: number,
  yStart: number,
  xEnd: number,
  yEnd: number,
  startingAnchorOrientation: AnchorPositionType,
): {
  xAnchor1: number;
  yAnchor1: number;
} {
  if (startingAnchorOrientation === 'top' || startingAnchorOrientation === 'bottom') {
    return {
      xAnchor1: xStart,
      yAnchor1: yStart + (yEnd - yStart) / 2,
    };
  }

  if (startingAnchorOrientation === 'left' || startingAnchorOrientation === 'right') {
    return {
      xAnchor1: xStart + (xEnd - xStart) / 2,
      yAnchor1: yStart,
    };
  }

  return {
    xAnchor1: xStart,
    yAnchor1: yStart,
  };
}

export function computeEndingAnchorPosition(
  xStart: number,
  yStart: number,
  xEnd: number,
  yEnd: number,
  endingAnchorOrientation: AnchorPositionType,
): {
  xAnchor2: number;
  yAnchor2: number;
} {
  if (endingAnchorOrientation === 'top' || endingAnchorOrientation === 'bottom') {
    return {
      xAnchor2: xEnd,
      yAnchor2: yEnd - (yEnd - yStart) / 2,
    };
  }

  if (endingAnchorOrientation === 'left' || endingAnchorOrientation === 'right') {
    return {
      xAnchor2: xEnd - (xEnd - xStart) / 2,
      yAnchor2: yEnd,
    };
  }

  return {
    xAnchor2: xEnd,
    yAnchor2: yEnd,
  };
}

export function computeLabelDimensions(
  xStart: number,
  yStart: number,
  xEnd: number,
  yEnd: number,
): {
  xLabel: number;
  yLabel: number;
  labelWidth: number;
  labelHeight: number;
} {
  const labelWidth = Math.max(Math.abs(xEnd - xStart), 1);
  const labelHeight = Math.max(Math.abs(yEnd - yStart), 1);
  const xLabel = xEnd > xStart ? xStart : xEnd;
  const yLabel = yEnd > yStart ? yStart : yEnd;
  return {
    xLabel,
    yLabel,
    labelWidth,
    labelHeight,
  };
}

function computePathString({
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
}: {
  xStart: number;
  yStart: number;
  xAnchor1: number;
  yAnchor1: number;
  xAnchor2: number;
  yAnchor2: number;
  xEnd: number;
  yEnd: number;
  lineStyle: string;
  offset?: number;
}): string {
  if (offset && offset !== 0) {
    const angle =
      lineStyle === 'straight'
        ? Math.atan2(yEnd - yStart, xEnd - xStart)
        : Math.atan2(yAnchor1 - yStart, xAnchor1 - xStart);
    const xOffset = offset * Math.cos(angle);
    const yOffset = offset * Math.sin(angle);

    if (lineStyle !== 'straight') {
      xStart = xStart + xOffset;
      yStart = yStart + yOffset;
    }

    xEnd = xEnd - xOffset;
    yEnd = yEnd - yOffset;
  }

  let linePath = `M${xStart},${yStart} `;

  if (['curve', 'angle'].includes(lineStyle)) {
    linePath += `${
      lineStyle === 'curve' ? 'C' : ''
    }${xAnchor1},${yAnchor1} ${xAnchor2},${yAnchor2} `;
  }

  linePath += `${xEnd},${yEnd}`;
  return linePath;
}

const SvgArrow = ({
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
}: Props) => {
  const actualArrowLength = endShape.circle
    ? endShape.circle.radius * 2
    : endShape.arrow.arrowLength * 2;

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
    <g>
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
