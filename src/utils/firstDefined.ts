/**
 * Returns the first argument that is neither `undefined` nor `null`.
 *
 * Useful for merging layered config with a "first defined wins" precedence
 * (e.g. per-relation style -> container default -> hardcoded fallback) without
 * the `||` pitfall of discarding legitimate falsy values such as `0`.
 */
export const firstDefined = <T>(...values: Array<T | undefined | null>): T | undefined => {
  for (const value of values) {
    if (value !== undefined && value !== null) {
      return value;
    }
  }

  return undefined;
};
