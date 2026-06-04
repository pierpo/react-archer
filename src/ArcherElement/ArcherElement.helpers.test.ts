import { generateSourceToTarget, assertContextExists } from './ArcherElement.helpers';
import { ArcherContainerContextType } from '../ArcherContainer/ArcherContainer.context';

describe('generateSourceToTarget', () => {
  it('applies the default anchors and order', () => {
    const [relation] = generateSourceToTarget('source', [{ targetId: 'target' }]);

    expect(relation.source).toEqual({ id: 'source', anchor: 'auto' });
    expect(relation.target).toEqual({ id: 'target', anchor: 'auto' });
    expect(relation.order).toEqual(0);
  });

  it('encodes both source and target ids', () => {
    const [relation] = generateSourceToTarget('a b', [{ targetId: 'c d' }]);

    expect(relation.source.id).toEqual('a_20b');
    expect(relation.target.id).toEqual('c_20d');
  });

  it('preserves explicit anchors, order and pass-through fields', () => {
    const [relation] = generateSourceToTarget('source', [
      {
        targetId: 'target',
        sourceAnchor: 'right',
        targetAnchor: 'left',
        order: 3,
        label: 'hello',
        className: 'my-class',
        hitSlop: 20,
      },
    ]);

    expect(relation.source.anchor).toEqual('right');
    expect(relation.target.anchor).toEqual('left');
    expect(relation.order).toEqual(3);
    expect(relation.label).toEqual('hello');
    expect(relation.className).toEqual('my-class');
    expect(relation.hitSlop).toEqual(20);
  });
});

describe('assertContextExists', () => {
  it('throws when the context is missing', () => {
    expect(() => assertContextExists(null)).toThrow(/ArcherContainer/);
  });

  it('does not throw when the context exists', () => {
    const context = {} as ArcherContainerContextType;
    expect(() => assertContextExists(context)).not.toThrow();
  });
});
