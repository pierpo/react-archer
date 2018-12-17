// @flow
import React from 'react';
// $FlowFixMe
import renderer from 'react-test-renderer';
import { type ShallowWrapper, shallow } from 'enzyme';

import ArcherContainer, { mergeTransitions } from './ArcherContainer';

describe('ArcherContainer', () => {
  const children = <div>child</div>;

  const defaultProps = {
    children,
    arrowLength: 10,
    arrowThickness: 30,
    strokeColor: 'rgb(123, 234, 123)',
  };

  type WrapperState = {
    fromTo: Array<CompleteRelationType>,
  };

  const defaultState: WrapperState = {
    fromTo: [
      {
        from: {
          anchor: 'top',
          id: 'first-element',
        },
        to: {
          anchor: 'bottom',
          id: 'second-element',
        },
      },
    ],
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
      id: `${
        wrapper.instance().arrowMarkerUniquePrefix
      }first-elementsecond-element`,
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

  describe('mergeTransitions', () => {
    it('should keep transitions intact if no changes', () => {
      const currentRelations = [
        {
          from: { id: 'here', anchor: 'top' },
          to: [{ id: 'there', anchor: 'top' }, { id: 'here', anchor: 'top' }],
        },
      ];
      const oldRelation = [];
      const newRelation = [];

      const result = mergeTransitions(
        currentRelations,
        newRelation,
        oldRelation,
      );

      expect(result).toEqual(currentRelations);
    });

    it('should properly merge transitions', () => {
      const currentRelations = [
        {
          from: { id: 'here', anchor: 'top' },
          to: [{ id: 'there', anchor: 'top' }, { id: 'here', anchor: 'top' }],
        },
      ];

      const oldRelation = [
        {
          from: { id: 'here', anchor: 'top' },
          to: [{ id: 'there', anchor: 'top' }, { id: 'here', anchor: 'top' }],
        },
      ];

      const newRelation = [
        {
          from: { id: 'here', anchor: 'top' },
          to: { id: 'there', anchor: 'top' },
        },
      ];

      const result = mergeTransitions(
        currentRelations,
        newRelation,
        oldRelation,
      );

      expect(result).toEqual(newRelation);
    });

    it('should merge transitions and keep the newer ones', () => {
      const currentRelations = [
        {
          from: { id: 'here', anchor: 'top' },
          to: { id: 'there', anchor: 'top' },
        },
      ];

      const oldRelation = [
        {
          from: { id: 'here', anchor: 'top' },
          to: { id: 'there', anchor: 'top' },
        },
      ];

      const newRelation = [
        {
          from: { id: 'here', anchor: 'top' },
          to: { id: 'there', anchor: 'top' },
          label: 'this is a new label',
        },
      ];

      const result = mergeTransitions(
        currentRelations,
        newRelation,
        oldRelation,
      );

      expect(result).toEqual(newRelation);
      expect(result[0].label).toEqual('this is a new label');
    });
  });

  describe('render', () => {
    const newState: WrapperState = {
      fromTo: [
        {
          from: {
            anchor: 'bottom',
            id: 'first-element',
          },
          to: [
            {
              anchor: 'top',
              id: 'second-element',
            },
            {
              anchor: 'top',
              id: 'third-element',
            },
          ],
        },
      ],
    };

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

      it('renders a Fragment of SVG arrows', () => {
        const wrapper: ShallowWrapper = shallowRenderAndSetState(newState);
        const uniquePrefix: string = wrapper.instance().arrowMarkerUniquePrefix;

        const arrows = wrapper.instance().computeArrows();

        const tree = renderer.create(arrows).toJSON();

        expect(tree).toMatchInlineSnapshot(`
Array [
  <g>
    <path
      d="M0,0 C0,-10 0,-10 0,-20"
      markerEnd="url(http://localhost/#${uniquePrefix}first-elementsecond-element)"
      style={
        Object {
          "fill": "none",
          "stroke": "rgb(123, 234, 123)",
          "strokeWidth": 2,
        }
      }
    />
  </g>,
  <g>
    <path
      d="M0,0 C0,-10 0,-10 0,-20"
      markerEnd="url(http://localhost/#${uniquePrefix}first-elementthird-element)"
      style={
        Object {
          "fill": "none",
          "stroke": "rgb(123, 234, 123)",
          "strokeWidth": 2,
        }
      }
    />
  </g>,
]
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

      it('renders a Fragment of SVG markers', () => {
        const wrapper: ShallowWrapper = shallowRenderAndSetState(newState);
        const uniquePrefix: string = wrapper.instance().arrowMarkerUniquePrefix;

        const markers = wrapper.instance().generateAllArrowMarkers();

        const tree = renderer.create(markers).toJSON();

        expect(tree).toMatchInlineSnapshot(`
Array [
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
  </marker>,
  <marker
    id="${uniquePrefix}first-elementthird-element"
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
  </marker>,
]
`);
      });
    });
  });
});
