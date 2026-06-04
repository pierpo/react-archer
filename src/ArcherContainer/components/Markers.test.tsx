import { render } from '@testing-library/react';
import { ArrowMarkers } from './Markers';
import { LineType, ShapeType, SourceToTargetType } from '../../types';
import { SourceToTargetsArrayType } from '../ArcherContainer.types';

const renderMarkers = ({
  style = {},
  endShape = {},
  strokeColor = '#000',
}: {
  style?: LineType;
  endShape?: ShapeType;
  strokeColor?: string;
} = {}) => {
  const relation: SourceToTargetType = {
    source: { id: 'a', anchor: 'bottom' },
    target: { id: 'b', anchor: 'top' },
    order: 0,
    style,
  };
  const map: Record<string, SourceToTargetsArrayType> = { a: [relation] };

  const { container } = render(
    <svg>
      <defs>
        <ArrowMarkers
          sourceToTargetsMap={map}
          endShape={endShape}
          strokeColor={strokeColor}
          uniqueId="u"
        />
      </defs>
    </svg>,
  );
  return container;
};

describe('ArrowMarkers', () => {
  it('renders one marker with the expected id per relation', () => {
    const container = renderMarkers();
    expect(container.querySelector('marker')?.id).toEqual('uab');
  });

  it('renders an arrow path using the default arrow length and thickness', () => {
    const container = renderMarkers();
    // default arrowLength 10, arrowThickness 6
    expect(container.querySelector('path')?.getAttribute('d')).toEqual('M0,0 L0,6 L10,3 z');
  });

  it('lets the container endShape override the arrow default', () => {
    const container = renderMarkers({ endShape: { arrow: { arrowLength: 20 } } });
    expect(container.querySelector('path')?.getAttribute('d')).toEqual('M0,0 L0,6 L20,3 z');
  });

  it('lets the per-relation style override the container endShape', () => {
    const container = renderMarkers({
      style: { endShape: { arrow: { arrowLength: 30 } } },
      endShape: { arrow: { arrowLength: 20 } },
    });
    expect(container.querySelector('path')?.getAttribute('d')).toEqual('M0,0 L0,6 L30,3 z');
  });

  it('resolves circle radius with style > endShape > default precedence', () => {
    // style selects the circle shape but leaves radius undefined -> endShape wins
    const fromEndShape = renderMarkers({
      style: { endShape: { circle: {} } },
      endShape: { circle: { radius: 5 } },
    });
    expect(fromEndShape.querySelector('circle')?.getAttribute('r')).toEqual('5');

    // style radius overrides endShape radius
    const fromStyle = renderMarkers({
      style: { endShape: { circle: { radius: 9 } } },
      endShape: { circle: { radius: 5 } },
    });
    expect(fromStyle.querySelector('circle')?.getAttribute('r')).toEqual('9');
  });

  it('honors an explicit circle strokeWidth of 0 instead of falling back to the default', () => {
    const container = renderMarkers({ style: { endShape: { circle: { strokeWidth: 0 } } } });
    // A borderless circle: 0 must be kept, not replaced by the default stroke width of 1.
    expect(container.querySelector('circle')?.getAttribute('stroke-width')).toEqual('0');
  });
});
