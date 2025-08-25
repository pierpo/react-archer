import { useEffect, useRef } from 'react';
import isEqual from 'react-fast-compare';

// https://stackoverflow.com/questions/54095994/react-useeffect-comparing-objects
function useDeepCompareMemoize<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier

  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export function useDeepCompareEffect<T extends React.EffectCallback, U extends any[]>(
  callback: T,
  dependencies: U,
) {
  // it should not be needed to put the function of the useEffect as a dependency of the useEffect itself
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
}
