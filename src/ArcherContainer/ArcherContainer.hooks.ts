import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import Vector2 from '../geometry/Vector2';
import { getPointFromElement } from '../geometry/rectHelper';
import { SourceToTargetsArrayType } from './ArcherContainer.types';

export type ElementRects = Record<string, DOMRect>;

export type ArcherMeasurements = {
  parentCoordinates: Vector2 | null;
  rects: ElementRects;
};

/**
 * Measures the parent and every registered element after layout, storing the
 * result in state. Keeping the measurements in state (rather than reading the
 * DOM during render) makes the render pure, so it follows the Rules of React
 * and can be optimized by the React Compiler.
 *
 * Returns the latest measurements and a `refreshScreen` callback that forces a
 * re-measure (used by the resize listener, the element observer and the public
 * imperative handle).
 */
export function useArcherMeasurements(
  parentRef: React.RefObject<HTMLDivElement | null>,
  refs: Record<string, HTMLElement>,
  sourceToTargetsMap: Record<string, SourceToTargetsArrayType>,
): { measurements: ArcherMeasurements; refreshScreen: () => void } {
  const [measurements, setMeasurements] = useState<ArcherMeasurements>({
    parentCoordinates: null,
    rects: {},
  });
  const [version, setVersion] = useState(0);

  const refreshScreen = useCallback(() => setVersion((previous) => previous + 1), []);

  useLayoutEffect(() => {
    const parentCoordinates = getPointFromElement(parentRef.current);
    const rects: ElementRects = {};

    Object.keys(refs).forEach((elementId) => {
      const rect = refs[elementId]?.getBoundingClientRect();

      if (rect) {
        rects[elementId] = rect;
      }
    });

    setMeasurements({ parentCoordinates, rects });
    // Re-measure when the registered elements or their relations change, when a
    // window/element resize bumps `version`, and on the initial layout pass.
  }, [parentRef, refs, sourceToTargetsMap, version]);

  return { measurements, refreshScreen };
}

/** Observe registered elements for size changes and refresh on any change. */
export const useObserveElements = (
  refs: Record<string, HTMLElement>,
  refreshScreen: () => void,
) => {
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      refreshScreen();
    });

    Object.keys(refs).forEach((elementId) => {
      observer.observe(refs[elementId]);
    });

    return () => {
      observer.disconnect();
    };
  }, [refs, refreshScreen]);
};

/** Subscribe/unsubscribe to the resize window event */
export function useResizeListener(refreshScreen: () => void) {
  useEffect(() => {
    if (window) window.addEventListener('resize', refreshScreen);

    return () => {
      if (window) window.removeEventListener('resize', refreshScreen);
    };
  }, [refreshScreen]);
}
