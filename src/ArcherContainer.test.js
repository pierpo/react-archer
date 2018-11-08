// @flow
import React from 'react';
import { type ShallowWrapper, shallow } from 'enzyme';
import ArcherContainer from './ArcherContainer';

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
});
