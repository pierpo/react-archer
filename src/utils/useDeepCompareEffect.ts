import { useEffect, useRef } from 'react';
import isEqual from 'react-fast-compare';

// https://stackoverflow.com/questions/54095994/react-useeffect-comparing-objects
function useDeepCompareMemoize<T>(value: T): T | undefined {
  const ref = useRef<T>();
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
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
}
