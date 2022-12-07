import { useLayoutEffect, useEffect } from 'react';

/**
 * Ignores useLayoutEffect for server-side rendering. It's fine, since the
 * server can't draw the arrows.
 * https://medium.com/@alexandereardon/uselayouteffect-and-ssr-192986cdcf7a
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
