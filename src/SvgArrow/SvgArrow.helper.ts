import { AnchorPositionType } from '../types';

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
