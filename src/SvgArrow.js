// @flow

import React from 'react';
import Point from './Point';

type Props = {
  startingPoint: Point,
  startingAnchor: AnchorPositionType,
  endingPoint: Point,
  endingAnchor: AnchorPositionType,
  strokeColor: string,
  arrowLength: number,
  strokeWidth: number,
  arrowLabel?: ?React$Node,
  arrowMarkerId: string,
};

function computeEndingArrowDirectionVector(endingAnchor) {
  switch (endingAnchor) {
    case 'left':
      return { arrowX: -1, arrowY: 0 };
    case 'right':
      return { arrowX: 1, arrowY: 0 };
    case 'top':
      return { arrowX: 0, arrowY: -1 };
    case 'bottom':
      return { arrowX: 0, arrowY: 1 };
    default:
      return { arrowX: 0, arrowY: 0 };
  }
}

export function computeEndingPointAccordingToArrow(
  xEnd: number,
  yEnd: number,
  arrowLength: number,
  strokeWidth: number,
  endingAnchor: AnchorPositionType,
) {
  const endingVector = computeEndingArrowDirectionVector(endingAnchor);

  const { arrowX, arrowY } = endingVector;

  const xe = xEnd + (arrowX * arrowLength * strokeWidth) / 2;
  const ye = yEnd + (arrowY * arrowLength * strokeWidth) / 2;

  return { xe, ye };
}

export function computeStartingAnchorPosition(
  xs: number,
  ys: number,
  xe: number,
  ye: number,
  startingAnchor: AnchorPositionType,
): { xa1: number, ya1: number } {
  if (startingAnchor === 'top' || startingAnchor === 'bottom') {
    return {
      xa1: xs,
      ya1: ys + (ye - ys) / 2,
    };
  }
  if (startingAnchor === 'left' || startingAnchor === 'right') {
    return {
      xa1: xs + (xe - xs) / 2,
      ya1: ys,
    };
  }

  return { xa1: xs, ya1: ys };
}

export function computeEndingAnchorPosition(
  xs: number,
  ys: number,
  xe: number,
  ye: number,
  endingAnchor: AnchorPositionType,
): { xa2: number, ya2: number } {
  if (endingAnchor === 'top' || endingAnchor === 'bottom') {
    return {
      xa2: xe,
      ya2: ye - (ye - ys) / 2,
    };
  }
  if (endingAnchor === 'left' || endingAnchor === 'right') {
    return {
      xa2: xe - (xe - xs) / 2,
      ya2: ye,
    };
  }

  return { xa2: xe, ya2: ye };
}

export function computeLabelDimensions(
  xs: number,
  ys: number,
  xe: number,
  ye: number,
): { xl: number, yl: number, wl: number, hl: number } {
  const wl = Math.abs(xe - xs);
  const hl = Math.abs(ye - ys);

  const xl = xe > xs ? xs : xe;
  const yl = ye > ys ? ys : ye;

  return {
    xl,
    yl,
    wl,
    hl,
  };
}

const SvgArrow = ({
  startingPoint,
  startingAnchor,
  endingPoint,
  endingAnchor,
  strokeColor,
  arrowLength,
  strokeWidth,
  arrowLabel,
  arrowMarkerId,
}: Props) => {
  const actualArrowLength = arrowLength * 2;

  const xs = startingPoint.x;
  const ys = startingPoint.y;

  const endingPointWithArrow = computeEndingPointAccordingToArrow(
    endingPoint.x,
    endingPoint.y,
    actualArrowLength,
    strokeWidth,
    endingAnchor,
  );
  const { xe, ye } = endingPointWithArrow;

  const startingPosition = computeStartingAnchorPosition(
    xs,
    ys,
    xe,
    ye,
    startingAnchor,
  );
  const { xa1, ya1 } = startingPosition;

  const endingPosition = computeEndingAnchorPosition(
    xs,
    ys,
    xe,
    ye,
    endingAnchor,
  );
  const { xa2, ya2 } = endingPosition;

  const pathString =
    `M${xs},${ys} ` + `C${xa1},${ya1} ${xa2},${ya2} ` + `${xe},${ye}`;

  const { xl, yl, wl, hl } = computeLabelDimensions(xs, ys, xe, ye);

  return (
    <g>
      <path
        d={pathString}
        style={{ fill: 'none', stroke: strokeColor, strokeWidth }}
        markerEnd={`url(${location.href}#${arrowMarkerId})`}
      />
      {arrowLabel && (
        <foreignObject x={xl} y={yl} width={wl} height={hl} style={{overflow:'visible'}}>
          <div
            style={{
              width: wl,
              height: hl,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
