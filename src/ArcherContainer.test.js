// @flow
import React from 'react';
import { type ShallowWrapper, shallow } from 'enzyme';
import ArcherContainer, { mergeTransitions } from './ArcherContainer';

let wrapper: ShallowWrapper;
let instance: ArcherContainer;
describe('ArcherContainer', () => {
  const children = <div>child</div>;

  const defaultProps = {
    children,
    arrowLength: 10,
    arrowThickness: 30,
    strokeColor: 'rgb(123, 234, 123)',
  };

  beforeEach(() => {
    wrapper = shallow(<ArcherContainer {...defaultProps} />);
    wrapper.setState({
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
    });
    instance = wrapper.instance();
  });

  it('should render given children and a svg element', () => {
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
    const marker = wrapper.find('marker');
    const markerProps = marker.props();

    const expectedProps = {
      id: `${instance.arrowMarkerUniquePrefix}first-elementsecond-element`,
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
          to: { id: 'there', anchor: 'top' },
        },
        {
          from: { id: 'here', anchor: 'top' },
          to: { id: 'here', anchor: 'top' },
        },
      ];
      const newRelation = [];
      const oldRelation = [];

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
          to: { id: 'there', anchor: 'top' },
        },
        {
          from: { id: 'here', anchor: 'top' },
          to: { id: 'here', anchor: 'top' },
        },
      ];

      const newRelation = [
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

      const result = mergeTransitions(
        currentRelations,
        newRelation,
        oldRelation,
      );

      expect(result.length).toEqual(2);
    });

    it('should merge transitions and keep the newer ones', () => {
      const currentRelations = [
        {
          from: { id: 'here', anchor: 'top' },
          to: { id: 'there', anchor: 'top' },
        },
        {
          from: { id: 'here', anchor: 'top' },
          to: { id: 'here', anchor: 'top' },
        },
      ];
      const newRelation = [
        {
          from: { id: 'here', anchor: 'top' },
          to: { id: 'there', anchor: 'top' },
          label: 'this is a new label',
        },
      ];

      const oldRelation = [
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

      expect(result.length).toEqual(2);
      expect(result.find(o => o.label === 'this is a new label')).toEqual(
        newRelation[0],
      );
    });
  });
});
