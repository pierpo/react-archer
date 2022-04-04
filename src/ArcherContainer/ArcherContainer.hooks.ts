import { useEffect } from 'react';

/** Subscribe/unsubscribe to the DOM observer */
export const useObserveElements = (refs: Record<string, HTMLElement>, observer: ResizeObserver) => {
  useEffect(() => {
    Object.keys(refs).map((elementKey) => {
      observer.observe(refs[elementKey]);
    });

    return () => {
      Object.keys(refs).map((elementKey) => {
        observer.unobserve(refs[elementKey]);
      });
    };
  }, [refs]);
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
