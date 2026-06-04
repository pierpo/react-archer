import Vector2 from './Vector2';
import { AnchorPositionType } from '../types';

function rectToPoint(rect: DOMRect): Vector2 {
  return new Vector2(rect.left, rect.top);
}

function computeCoordinatesFromAnchorPosition(
  anchorPosition: AnchorPositionType,
  rect: DOMRect,
): Vector2 | null {
  switch (anchorPosition) {
    case 'top':
      return rectToPoint(rect).add(new Vector2(rect.width / 2, 0));

    case 'bottom':
      return rectToPoint(rect).add(new Vector2(rect.width / 2, rect.height));

    case 'left':
      return rectToPoint(rect).add(new Vector2(0, rect.height / 2));

    case 'right':
      return rectToPoint(rect).add(new Vector2(rect.width, rect.height / 2));

    case 'middle':
      return rectToPoint(rect).add(new Vector2(rect.width / 2, rect.height / 2));

    default:
      console.error('[React Archer] Invalid anchor position was provided. Not drawing the arrow.');
      return null;
  }
}

const getRectFromElement = (
  element: HTMLElement | null | undefined,
): DOMRect | null | undefined => {
  if (!element) return null;
  return element.getBoundingClientRect();
};

export const getPointFromElement = (element: HTMLDivElement | null | undefined): Vector2 | null => {
  const rectp = getRectFromElement(element);

  if (!rectp) {
    return null;
  }

  return rectToPoint(rectp);
};

/**
 * Resolves an `'auto'` anchor to a concrete edge: the side of `ownRect` that faces
 * `otherRect`. Picks left/right when the horizontal gap dominates, top/bottom otherwise,
 * so the arrow always takes the natural short path between the two elements. On a perfect
 * diagonal, the vertical axis (top/bottom) wins.
 */
export const resolveAutoAnchor = (
  ownRect: DOMRect | null | undefined,
  otherRect: DOMRect | null | undefined,
): AnchorPositionType => {
  if (!ownRect || !otherRect) {
    return 'middle';
  }

  const dx = otherRect.left + otherRect.width / 2 - (ownRect.left + ownRect.width / 2);
  const dy = otherRect.top + otherRect.height / 2 - (ownRect.top + ownRect.height / 2);

  const horizontalWins = Math.abs(dx) > Math.abs(dy);

  if (horizontalWins) {
    return dx >= 0 ? 'right' : 'left';
  }

  return dy >= 0 ? 'bottom' : 'top';
};

export const getPointCoordinatesFromAnchorPosition = (
  position: AnchorPositionType,
  parentCoordinates: Vector2,
  rect: DOMRect | null | undefined,
): Vector2 | null => {
  if (!rect) {
    return null;
  }

  const absolutePosition = computeCoordinatesFromAnchorPosition(position, rect);

  if (!absolutePosition) {
    return null;
  }

  return absolutePosition.subtract(parentCoordinates);
};
