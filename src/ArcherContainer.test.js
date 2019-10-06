// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { type ShallowWrapper, shallow } from 'enzyme';

import ArcherContainer from './ArcherContainer';

describe('ArcherContainer', () => {
  const children = <div>child</div>;

  const defaultProps = {
    children,
    arrowLength: 10,
    arrowThickness: 30,
    strokeColor: 'rgb(123, 234, 123)',
  };

  type WrapperState = {
    sourceToTargetsMap: {
      [string]: Array<SourceToTargetType>,
    },
  };

  const defaultState: WrapperState = {
    sourceToTargetsMap: {
      foo: [
        {
          source: {
            anchor: 'top',
            id: 'first-element',
          },
          target: {
            anchor: 'bottom',
            id: 'second-element',
          },
        },
      ],
    },
  };

  const shallowRenderAndSetState = (newState?: WrapperState) => {
    const wrapper = shallow(<ArcherContainer {...defaultProps} />);

    wrapper.setState(newState || defaultState);

    return wrapper;
  };

  it('should render given children and a svg element', () => {
    const wrapper: ShallowWrapper = shallowRenderAndSetState();

    expect(
      wrapper
        .childAt(0)
        .childAt(1)
        .text(),
    ).toEqual('child');

    expect(
      wrapper
        .childAt(0)
        .childAt(0)
        .getElements()[0].type,
    ).toEqual('svg');
  });

  it('should render svg with the marker element used to draw an svg arrow', () => {
    const wrapper: ShallowWrapper = shallowRenderAndSetState();
    const marker = wrapper.find('marker');
    const markerProps = marker.props();

    const expectedProps = {
      id: `${wrapper.instance().arrowMarkerUniquePrefix}first-elementsecond-element`,
      markerWidth: 10,
      markerHeight: 30,
      refX: '0',
      refY: 15,
      orient: 'auto',
      markerUnits: 'strokeWidth',
      children: <path d="M0,0 L0,30 L9,15 z" fill="rgb(123, 234, 123)" />,
    };

    expect(markerProps).toMatchObject(expectedProps);
  });

  describe('render', () => {
    describe('computeArrows', () => {
      it('renders an SVG arrow', () => {
        const wrapper: ShallowWrapper = shallowRenderAndSetState();
        const uniquePrefix: string = wrapper.instance().arrowMarkerUniquePrefix;

        const arrow = wrapper.instance().computeArrows();

        const tree = renderer.create(arrow).toJSON();

        expect(tree).toMatchInlineSnapshot(`
<g>
  <path
    d="M0,0 C0,10 0,10 0,20"
    markerEnd="url(http://localhost/#${uniquePrefix}first-elementsecond-element)"
    style={
      Object {
        "fill": "none",
        "stroke": "rgb(123, 234, 123)",
        "strokeWidth": 2,
      }
    }
  />
</g>
`);
      });
    });

    describe('generateAllArrowMarkers', () => {
      it('renders an SVG marker', () => {
        const wrapper: ShallowWrapper = shallowRenderAndSetState();
        const uniquePrefix: string = wrapper.instance().arrowMarkerUniquePrefix;

        const marker = wrapper.instance().generateAllArrowMarkers();

        const tree = renderer.create(marker).toJSON();

        expect(tree).toMatchInlineSnapshot(`
<marker
  id="${uniquePrefix}first-elementsecond-element"
  markerHeight={30}
  markerUnits="strokeWidth"
  markerWidth={10}
  orient="auto"
  refX="0"
  refY={15}
>
  <path
    d="M0,0 L0,30 L9,15 z"
    fill="rgb(123, 234, 123)"
  />
</marker>
`);
      });
    });
  });

  describe('Event Listeners', () => {
    it('should add/remove resize listeners when mounting/unmounting', () => {
      global.window.addEventListener = jest.fn();
      global.window.removeEventListener = jest.fn();

      const wrapper: ShallowWrapper = shallowRenderAndSetState();

      expect(global.window.addEventListener).toBeCalledWith('resize', expect.anything());

      wrapper.unmount();

      expect(global.window.removeEventListener).toBeCalledWith('resize', expect.anything());
    });
  });
});
