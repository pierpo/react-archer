import Point from './Point';
import { AnchorPositionType } from '../types';

export function rectToPoint(rect: DOMRect): Point {
  return new Point(rect.left, rect.top);
}

export function computeCoordinatesFromAnchorPosition(
  anchorPosition: AnchorPositionType,
  rect: DOMRect,
): Point {
  switch (anchorPosition) {
    case 'top':
      return rectToPoint(rect).add(new Point(rect.width / 2, 0));

    case 'bottom':
      return rectToPoint(rect).add(new Point(rect.width / 2, rect.height));

    case 'left':
      return rectToPoint(rect).add(new Point(0, rect.height / 2));

    case 'right':
      return rectToPoint(rect).add(new Point(rect.width, rect.height / 2));

    case 'middle':
      return rectToPoint(rect).add(new Point(rect.width / 2, rect.height / 2));

    default:
      return new Point(0, 0);
  }
}
