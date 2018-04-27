import React from 'react';
import { shallow } from 'enzyme';
import ArcherElement from './ArcherElement';

let wrapper;
let registerChildMock;
describe('ArcherElement', () => {
  const children = <div>hi</div>;

  const defaultProps = {
    children,
  };

  beforeEach(() => {
    registerChildMock = jest.fn();
    const context = { registerChild: registerChildMock };

    wrapper = shallow(<ArcherElement {...defaultProps} />, { context });
  });

  it('should render children', () => {
    expect(wrapper.props().children).toEqual(children);
  });

  it('should call registerChild in ref callback', () => {
    wrapper.setProps({ id: 'the id' });
    expect(registerChildMock).toHaveBeenCalledWith('the id');
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

      wrapper.setContext(context);
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
