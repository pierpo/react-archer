import {
  getEndShapeFromStyle,
  getSourceToTargets,
  createShapeObj,
  getMarkerId,
} from './ArcherContainer.helpers';
import { SourceToTargetType } from '../types';
import { SourceToTargetsArrayType } from './ArcherContainer.types';

const relation = (id: string, order: number): SourceToTargetType => ({
  source: { id: `s-${id}`, anchor: 'bottom' },
  target: { id: `t-${id}`, anchor: 'top' },
  order,
});

describe('getEndShapeFromStyle', () => {
  it('defaults to arrow when no endShape is set', () => {
    expect(getEndShapeFromStyle({})).toEqual('arrow');
  });

  it('returns circle when the endShape declares a circle', () => {
    expect(getEndShapeFromStyle({ endShape: { circle: { radius: 4 } } })).toEqual('circle');
  });

  it('falls back to arrow when the endShape has no known shape key', () => {
    expect(getEndShapeFromStyle({ endShape: {} })).toEqual('arrow');
  });
});

describe('getSourceToTargets', () => {
  it('flattens every entry and sorts them by order', () => {
    const map: Record<string, SourceToTargetsArrayType> = {
      a: [relation('a', 2)],
      b: [relation('b1', 0), relation('b2', 1)],
    };

    const result = getSourceToTargets(map);

    expect(result.map((r) => r.order)).toEqual([0, 1, 2]);
    expect(result).toHaveLength(3);
  });
});

describe('createShapeObj', () => {
  it('merges container endShape with the per-relation style (style wins)', () => {
    const result = createShapeObj(
      { endShape: { arrow: { arrowLength: 99 } } },
      { arrow: { arrowLength: 10, arrowThickness: 6 } },
    );

    expect(result).toEqual({ arrow: { arrowLength: 99, arrowThickness: 6 } });
  });
});

describe('getMarkerId', () => {
  it('concatenates the unique prefix with the source and target ids', () => {
    const id = getMarkerId('prefix', { id: 'a', anchor: 'top' }, { id: 'b', anchor: 'bottom' });
    expect(id).toEqual('prefixab');
  });
});
