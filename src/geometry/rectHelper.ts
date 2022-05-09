import Vector2 from './Vector2';
import { AnchorPositionType } from '../types';

function rectToPoint(rect: DOMRect): Vector2 {
  return new Vector2(rect.left, rect.top);
}

function computeCoordinatesFromAnchorPosition(
  anchorPosition: AnchorPositionType,
  rect: DOMRect,
): Vector2 {
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
      return new Vector2(0, 0);
  }
}

const getRectFromElement = (
  element: HTMLElement | null | undefined,
): DOMRect | null | undefined => {
  if (!element) return null;
  return element.getBoundingClientRect();
};

export const getPointFromElement = (element: HTMLDivElement | null | undefined) => {
  const rectp = getRectFromElement(element);

  if (!rectp) {
    return new Vector2(0, 0);
  }

  return rectToPoint(rectp);
};

export const getPointCoordinatesFromAnchorPosition = (
  position: AnchorPositionType,
  index: string,
  parentCoordinates: Vector2,
  refs: Record<string, HTMLElement>,
): Vector2 => {
  const rect = getRectFromElement(refs[index]);

  if (!rect) {
    return new Vector2(0, 0);
  }

  const absolutePosition = computeCoordinatesFromAnchorPosition(position, rect);
  return absolutePosition.substract(parentCoordinates);
};
