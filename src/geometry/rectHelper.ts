import Point from './Point';
import { AnchorPositionType } from '../types';

function rectToPoint(rect: DOMRect): Point {
  return new Point(rect.left, rect.top);
}

function computeCoordinatesFromAnchorPosition(
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

const getRectFromElement = (
  element: HTMLElement | null | undefined,
): DOMRect | null | undefined => {
  if (!element) return null;
  return element.getBoundingClientRect();
};

export const getPointFromElement = (element: HTMLDivElement | null | undefined) => {
  const rectp = getRectFromElement(element);

  if (!rectp) {
    return new Point(0, 0);
  }

  return rectToPoint(rectp);
};

export const getPointCoordinatesFromAnchorPosition = (
  position: AnchorPositionType,
  index: string,
  parentCoordinates: Point,
  refs: Record<string, HTMLElement>,
): Point => {
  const rect = getRectFromElement(refs[index]);

  if (!rect) {
    return new Point(0, 0);
  }

  const absolutePosition = computeCoordinatesFromAnchorPosition(position, rect);
  return absolutePosition.substract(parentCoordinates);
};
