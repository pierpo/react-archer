// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import { type ShallowWrapper, shallow } from 'enzyme';

import ArcherContainer from './ArcherContainer';

describe('ArcherContainer', () => {
  const defaultProps = {
    endShape: {
      arrow: {
        arrowLength: 10,
        arrowThickness: 30,
      },
    },
    strokeColor: 'rgb(123, 234, 123)',
    strokeDasharray: '5,5',
  };

  type WrapperState = {
    sourceToTargetsMap: {
      [string]: SourceToTargetType[],
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

  const circleEndShapeDefaultState: WrapperState = {
    sourceToTargetsMap: {
      bar: [
        {
          source: {
            anchor: 'top',
            id: 'first-element',
          },
          target: {
            anchor: 'bottom',
            id: 'second-element',
          },
          style: {
            endShape: {
              circle: {
                radius: 11,
                strokeWidth: 2,
                strokeColor: 'tomato',
                fillColor: '#c0ffee',
              },
            },
          },
        },
      ],
    },
  };

  const MarkerAtBothEndsState: WrapperState = {
    sourceToTargetsMap: {
      bar: [
        {
          source: {
            anchor: 'top',
            id: 'first-element',
          },
          target: {
            anchor: 'bottom',
            id: 'second-element',
          },
          style: {
            startMarker: true,
            endShape: {
              circle: {
                radius: 11,
                strokeWidth: 2,
                strokeColor: 'tomato',
                fillColor: '#c0ffee',
              },
            },
          },
        },
      ],
    },
  };

  const shallowRenderAndSetState = (newState?: WrapperState) => {
    const wrapper = shallow(
      <ArcherContainer {...defaultProps}>
        <div>child</div>
      </ArcherContainer>,
    );

    wrapper.setState(newState || defaultState);

    return wrapper;
  };

  it('should render given children and a svg element', () => {
    const wrapper: ShallowWrapper<typeof ArcherContainer> = shallowRenderAndSetState();

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

  describe('rendering an svg with the marker element used to draw an svg arrow', () => {
    it('should render the arrow with an arrow end by default', () => {
      const wrapper: ShallowWrapper<typeof ArcherContainer> = shallowRenderAndSetState();
      const marker = wrapper.find('marker');
      const markerProps = marker.props();

      const expectedProps = {
        id: `${wrapper.instance().arrowMarkerUniquePrefix}first-elementsecond-element`,
        markerWidth: 10,
        markerHeight: 30,
        refX: 0,
        refY: 15,
        orient: 'auto-start-reverse',
        markerUnits: 'strokeWidth',
        children: <path d="M0,0 L0,30 L10,15 z" fill="rgb(123, 234, 123)" />,
      };

      expect(markerProps).toMatchObject(expectedProps);
    });

    it('should render the arrow with a circle end when provided', () => {
      const wrapper: ShallowWrapper<typeof ArcherContainer> = shallowRenderAndSetState(
        circleEndShapeDefaultState,
      );
      const marker = wrapper.find('marker');
      const markerProps = marker.props();

      const expectedProps = {
        id: `${wrapper.instance().arrowMarkerUniquePrefix}first-elementsecond-element`,
        markerWidth: 44,
        markerHeight: 44,
        refX: 24,
        refY: 22,
        orient: 'auto-start-reverse',
        markerUnits: 'strokeWidth',
        children: <circle cx={22} cy={22} r={11} fill="#c0ffee" stroke="tomato" strokeWidth={2} />,
      };

      expect(markerProps).toMatchObject(expectedProps);
    });
  });

  describe('render', () => {
    describe('computeArrows', () => {
      describe('with default end shape', () => {
        it('renders an SVG arrow', () => {
          const wrapper: ShallowWrapper<typeof ArcherContainer> = shallowRenderAndSetState();
          const uniquePrefix: string = wrapper.instance().arrowMarkerUniquePrefix;

          const arrow = wrapper.instance()._computeArrows();

          // $FlowFixMe TODO new error since flow upgrade
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
                    "strokeDasharray": "5,5",
                    "strokeWidth": 2,
                  }
                }
              />
            </g>
          `);
        });
      });

      describe('with a circle end shape', () => {
        it('renders an SVG arrow', () => {
          const wrapper: ShallowWrapper<typeof ArcherContainer> = shallowRenderAndSetState(
            circleEndShapeDefaultState,
          );
          const uniquePrefix: string = wrapper.instance().arrowMarkerUniquePrefix;

          const arrow = wrapper.instance()._computeArrows();

          // $FlowFixMe TODO new error since flow upgrade
          const tree = renderer.create(arrow).toJSON();

          expect(tree).toMatchInlineSnapshot(`
            <g>
              <path
                d="M0,0 C0,11 0,11 0,22"
                markerEnd="url(http://localhost/#${uniquePrefix}first-elementsecond-element)"
                style={
                  Object {
                    "fill": "none",
                    "stroke": "rgb(123, 234, 123)",
                    "strokeDasharray": "5,5",
                    "strokeWidth": 2,
                  }
                }
              />
            </g>
          `);
        });
      });

      describe('with a marker at start', () => {
        it('renders an SVG arrow on both ends', () => {
          const wrapper: ShallowWrapper<typeof ArcherContainer> = shallowRenderAndSetState(
            MarkerAtBothEndsState,
          );
          const uniquePrefix: string = wrapper.instance().arrowMarkerUniquePrefix;

          const arrow = wrapper.instance()._computeArrows();

          // $FlowFixMe TODO new error since flow upgrade
          const tree = renderer.create(arrow).toJSON();

          expect(tree).toMatchInlineSnapshot(`
          <g>
            <path
              d="M0,-22 C0,0 0,0 0,22"
              markerEnd="url(http://localhost/#${uniquePrefix}first-elementsecond-element)"
              markerStart="url(http://localhost/#${uniquePrefix}first-elementsecond-element)"
              style={
                Object {
                  "fill": "none",
                  "stroke": "rgb(123, 234, 123)",
                  "strokeDasharray": "5,5",
                  "strokeWidth": 2,
                }
              }
            />
          </g>
        `);
        });
      });
    });

    describe('generateAllArrowMarkers', () => {
      describe('with default end shape', () => {
        it('renders an SVG marker', () => {
          const wrapper: ShallowWrapper<typeof ArcherContainer> = shallowRenderAndSetState();
          const uniquePrefix: string = wrapper.instance().arrowMarkerUniquePrefix;

          const marker = wrapper.instance()._generateAllArrowMarkers();

          // $FlowFixMe TODO new error since flow upgrade
          const tree = renderer.create(marker).toJSON();
          expect(tree).toMatchInlineSnapshot(`
            <marker
              id="${uniquePrefix}first-elementsecond-element"
              markerHeight={30}
              markerUnits="strokeWidth"
              markerWidth={10}
              orient="auto-start-reverse"
              refX={0}
              refY={15}
            >
              <path
                d="M0,0 L0,30 L10,15 z"
                fill="rgb(123, 234, 123)"
              />
            </marker>
          `);
        });
      });

      describe('with a circle end shape', () => {
        it('renders an SVG marker', () => {
          const wrapper: ShallowWrapper<typeof ArcherContainer> = shallowRenderAndSetState(
            circleEndShapeDefaultState,
          );
          const uniquePrefix: string = wrapper.instance().arrowMarkerUniquePrefix;

          const marker = wrapper.instance()._generateAllArrowMarkers();

          // $FlowFixMe TODO new error since flow upgrade
          const tree = renderer.create(marker).toJSON();

          expect(tree).toMatchInlineSnapshot(`
            <marker
              id="${uniquePrefix}first-elementsecond-element"
              markerHeight={44}
              markerUnits="strokeWidth"
              markerWidth={44}
              orient="auto-start-reverse"
              refX={24}
              refY={22}
            >
              <circle
                cx={22}
                cy={22}
                fill="#c0ffee"
                r={11}
                stroke="tomato"
                strokeWidth={2}
              />
            </marker>
          `);
        });
      });
    });
  });

  describe('Event Listeners', () => {
    it('should add/remove resize listeners when mounting/unmounting', () => {
      global.window.addEventListener = jest.fn();
      global.window.removeEventListener = jest.fn();

      const wrapper: ShallowWrapper<typeof ArcherContainer> = shallowRenderAndSetState();

      expect(global.window.addEventListener).toBeCalledWith('resize', expect.anything());

      wrapper.unmount();

      expect(global.window.removeEventListener).toBeCalledWith('resize', expect.anything());
    });
  });
});
