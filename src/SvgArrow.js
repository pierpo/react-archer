import React from 'react';
import PropTypes from 'prop-types';

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

function computeEndingPointAccordingToArrow(xEnd, yEnd, arrowLength, strokeWidth, endingAnchor) {
  const { arrowX, arrowY } = computeEndingArrowDirectionVector(endingAnchor);

  const xe = xEnd + arrowX * arrowLength * strokeWidth / 2;
  const ye = yEnd + arrowY * arrowLength * strokeWidth / 2;

  return { xe, ye };
}

function computeStartingAnchorPosition(xs, ys, xe, ye, startingAnchor) {
  if (startingAnchor === 'top' || startingAnchor === 'bottom') {
    return {
      xa1: xs,
      ya1: ys + (ye - ys) / 2
    };
  }
  if (startingAnchor === 'left' || startingAnchor === 'right') {
    return {
      xa1: xs + (xe - xs) / 2,
      ya1: ys
    };
  }

  return { xa1: xs, ya1: ys };
}

function computeEndingAnchorPosition(xs, ys, xe, ye, endingAnchor) {
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

const SvgArrow = ({
  startingPoint,
  startingAnchor,
  endingPoint,
  endingAnchor,
  strokeColor,
  arrowLength,
  strokeWidth
}) => {
  const actualArrowLength = arrowLength * 2;

  const xs = startingPoint.x;
  const ys = startingPoint.y;

  const { xe, ye } = computeEndingPointAccordingToArrow(endingPoint.x, endingPoint.y, actualArrowLength, strokeWidth, endingAnchor);

  const { xa1, ya1 } = computeStartingAnchorPosition(xs, ys, xe, ye, startingAnchor);
  const { xa2, ya2 } = computeEndingAnchorPosition(xs, ys, xe, ye, endingAnchor);

  const pathString = `M${xs},${ys} ` +
    `C${xa1},${ya1} ${xa2},${ya2} ` +
    `${xe},${ye}`;

  return (
    <path
      d={pathString}
      style={{ fill: 'none', stroke: strokeColor, strokeWidth }}
      markerEnd="url(#arrow)"
    />
  );
};

const pointPropType = PropTypes.shape({
  x: PropTypes.number,
  y: PropTypes.number,
});

const anchorType = PropTypes.oneOf(['top', 'bottom', 'left', 'right']);

SvgArrow.propTypes = {
  startingPoint: pointPropType,
  startingAnchor: anchorType,
  endingPoint: pointPropType,
  endingAnchor: anchorType,
  strokeColor: PropTypes.string,
  arrowLength: PropTypes.number,
  strokeWidth: PropTypes.number,
};

export default SvgArrow;
