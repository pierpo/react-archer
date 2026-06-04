import { AnchorPositionType, ValidLineStyles } from '../types';

export function computeArrowDirectionVector(anchorOrientation: AnchorPositionType) {
  switch (anchorOrientation) {
    case 'left':
      return {
        arrowX: -1,
        arrowY: 0,
      };

    case 'right':
      return {
        arrowX: 1,
        arrowY: 0,
      };

    case 'top':
      return {
        arrowX: 0,
        arrowY: -1,
      };

    case 'bottom':
      return {
        arrowX: 0,
        arrowY: 1,
      };

    default:
      return {
        arrowX: 0,
        arrowY: 0,
      };
  }
}

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

// Offset the control point along the anchor's outward direction rather than the raw
// signed distance. This keeps the path tangent (and thus the marker) pointing the right
// way even when the elements overlap and the edge points end up in reversed order.
function computeAnchorControlPoint(
  baseX: number,
  baseY: number,
  spanX: number,
  spanY: number,
  anchorOrientation: AnchorPositionType,
): { x: number; y: number } {
  const { arrowX, arrowY } = computeArrowDirectionVector(anchorOrientation);

  if (anchorOrientation === 'top' || anchorOrientation === 'bottom') {
    return { x: baseX, y: baseY + (arrowY * spanY) / 2 };
  }

  if (anchorOrientation === 'left' || anchorOrientation === 'right') {
    return { x: baseX + (arrowX * spanX) / 2, y: baseY };
  }

  return { x: baseX, y: baseY };
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
  const { x, y } = computeAnchorControlPoint(
    xStart,
    yStart,
    Math.abs(xEnd - xStart),
    Math.abs(yEnd - yStart),
    startingAnchorOrientation,
  );
  return { xAnchor1: x, yAnchor1: y };
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
  const { x, y } = computeAnchorControlPoint(
    xEnd,
    yEnd,
    Math.abs(xEnd - xStart),
    Math.abs(yEnd - yStart),
    endingAnchorOrientation,
  );
  return { xAnchor2: x, yAnchor2: y };
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

export function computePathString({
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
