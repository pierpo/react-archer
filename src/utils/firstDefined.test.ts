import { firstDefined } from './firstDefined';

describe('firstDefined', () => {
  it('returns the first non-nullish value', () => {
    expect(firstDefined(undefined, null, 'a', 'b')).toEqual('a');
  });

  it('skips undefined and null but keeps other falsy values', () => {
    expect(firstDefined(undefined, 0)).toEqual(0);
    expect(firstDefined(null, '')).toEqual('');
    expect(firstDefined(undefined, false)).toEqual(false);
  });

  it('returns undefined when every value is nullish', () => {
    expect(firstDefined(undefined, null)).toBeUndefined();
    expect(firstDefined()).toBeUndefined();
  });
});
