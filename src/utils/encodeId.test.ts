import { encodeId } from './encodeId';

describe('encodeId', () => {
  it('leaves a plain id untouched', () => {
    expect(encodeId('node-1')).toEqual('node-1');
  });

  it('encodes spaces and replaces % with _ so the id is SVG-safe', () => {
    // encodeURI turns a space into %20, then % becomes _.
    expect(encodeId('my element')).toEqual('my_20element');
  });

  it('encodes a literal percent sign', () => {
    expect(encodeId('100%')).toEqual('100_25');
  });

  it('encodes unicode characters', () => {
    expect(encodeId('é')).toEqual('_C3_A9');
  });
});
