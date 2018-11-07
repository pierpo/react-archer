// @flow
import React from 'react';
import { type ShallowWrapper, type ReactWrapper, shallow, mount } from 'enzyme';
import { ArcherElementNoContext } from './ArcherElement';

let wrapper: ShallowWrapper;
let wrapperMount: ReactWrapper;

let registerChildMock;
describe('ArcherElement', () => {
  const children = <div>hi</div>;
  const context = { registerChild: registerChildMock };

  const defaultProps = {
    relations: [],
    id: '',
    context,
    children,
  };

  beforeEach(() => {
    registerChildMock = jest.fn();

    wrapper = shallow(<ArcherElementNoContext {...defaultProps} />);
  });

  it('should render children', () => {
    expect(wrapper.props().children).toEqual(children);
  });

  it.only('should register child on mounting ref callback', () => {
    const context = { registerChild: registerChildMock };
    const props = { ...defaultProps, id: 'the id', context };
    wrapperMount = mount(<ArcherElementNoContext {...props} />);

    expect(registerChildMock).toHaveBeenCalledWith('the id', expect.anything());
    wrapperMount.unmount();
    expect(registerChildMock).toHaveBeenCalledTimes(1);
  });

  describe('lifecycle', () => {
    let instance;
    let registerAllTransitionsMock;

    beforeEach(() => {
      instance = wrapper.instance();
      registerAllTransitionsMock = jest.fn();
      instance.registerAllTransitions = registerAllTransitionsMock;
    });

    it('should call registerAllTransitions on receive props', () => {
      const newRelations = [
        { from: { anchor: 'left' }, to: { id: 'toto', anchor: 'top' } },
      ];
      wrapper.setProps({ relations: newRelations });

      expect(registerAllTransitionsMock).toHaveBeenCalledWith(newRelations);
    });

    it('should not call registerAllTransitions on recive props if relation exists', () => {
      const oldRelations = [
        { from: { anchor: 'left' }, to: { id: 'toto', anchor: 'top' } },
      ];
      wrapper.setProps({ relations: oldRelations });
      registerAllTransitionsMock.mockReset();

      const newRelations = [
        { from: { anchor: 'left' }, to: { id: 'toto', anchor: 'top' } },
      ];
      wrapper.setProps({ relations: newRelations });

      expect(registerAllTransitionsMock).not.toHaveBeenCalled();
    });

    it('should call registerAllTransitions on mount if relations', () => {
      const relations = [
        { from: { anchor: 'left' }, to: { id: 'toto', anchor: 'top' } },
      ];
      registerAllTransitionsMock.mockReset();

      wrapper.setProps({ relations });
      instance.componentDidMount();

      expect(registerAllTransitionsMock).toHaveBeenCalled();
    });

    it('should not call registerAllTransitions on mount if no relations', () => {
      const relations = undefined;
      registerAllTransitionsMock.mockReset();

      wrapper.setProps({ relations });
      instance.componentDidMount();

      expect(registerAllTransitionsMock).not.toHaveBeenCalled();
    });
  });

  describe('registerAllTransitions', () => {
    let instance;
    let registerTransitionMock;

    beforeEach(() => {
      instance = wrapper.instance();
      registerTransitionMock = jest.fn();
      const context = {
        registerChild: registerChildMock,
        registerTransition: registerTransitionMock,
      };

      wrapper.setProps({ context });
    });

    it('should call registerTransition once per relation', () => {
      const relations = ['first relation', 'second relation'];
      wrapper.setProps({ id: 'nice id' });
      instance.registerAllTransitions(relations);

      expect(registerTransitionMock).toHaveBeenCalledWith(
        'nice id',
        'first relation',
      );
      expect(registerTransitionMock).toHaveBeenCalledWith(
        'nice id',
        'second relation',
      );
    });
  });
});
