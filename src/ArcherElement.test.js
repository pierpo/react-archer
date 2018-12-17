// @flow
import * as React from 'react';
import { type ReactWrapper, mount } from 'enzyme';
import ArcherElement from './ArcherElement';
import { ArcherContainerContextProvider } from './ArcherContainer';

describe('ArcherElement', () => {
  let registerChildMock;
  let unregisterChildMock;
  let registerTransitionMock;
  let unregisterTransitionsMock;

  const children = <div>hi</div>;
  const defaultProps = {
    relations: [],
    id: '',
    children,
  };

  type MockArcherContainerType = {
    registerTransition?: Function,
    unregisterTransitions?: Function,
    registerChild?: Function,
    unregisterChild?: Function,
    children: React.Node,
  }

  const MockArcherContainer = ({
    registerTransition,
    unregisterTransitions,
    registerChild,
    unregisterChild,
    children
  }: MockArcherContainerType) => (
    <ArcherContainerContextProvider
      value={{
        registerTransition,
        unregisterTransitions,
        registerChild,
        unregisterChild,
      }}
    >
      {children}
    </ArcherContainerContextProvider>
  );

  // For triggering relations props changes in a less contrived way
  class PassThrough extends React.Component<any, any> {
    state = {
      relations: this.props.relations,
      newRelations: this.props.newRelations,
    };

    render() {
      const { relations, newRelations } = this.state;

      return (
        <ArcherElement {...this.props} relations={relations}>
          <div className="foo" onClick={() => this.setState({ relations: newRelations })}>
            Foo
          </div>
        </ArcherElement>
      );
    }
  }

  const mountContainer = (
    relations: Array<RelationType>,
    newRelations: Array<RelationType>
  ): ReactWrapper => {
    const props = { ...defaultProps, id: 'foo' };

    return mount(
      <MockArcherContainer
        registerChild={registerChildMock}
        unregisterChild={unregisterChildMock}
        registerTransition={registerTransitionMock}
        unregisterTransitions={unregisterTransitionsMock}
      >
        <PassThrough {...props} relations={relations} newRelations={newRelations} />
      </MockArcherContainer>
    );
  };

  beforeEach(() => {
    registerChildMock = jest.fn();
    unregisterChildMock = jest.fn();
    registerTransitionMock = jest.fn();
    unregisterTransitionsMock = jest.fn();
  });

  it('should register and unregister child on mounting ref callback', () => {
    const relations = [];

    const wrapper: ReactWrapper = mountContainer(relations, []);

    // See we register the child
    expect(registerChildMock).toHaveBeenCalledWith('foo', expect.anything());

    wrapper.unmount();

    // See we unregister the child and all transitions
    expect(unregisterChildMock).toHaveBeenCalledWith('foo');
    expect(unregisterTransitionsMock).toHaveBeenCalledWith('foo');

    expect(registerChildMock).toHaveBeenCalledTimes(1);
    expect(unregisterChildMock).toHaveBeenCalledTimes(1);
    expect(unregisterTransitionsMock).toHaveBeenCalledTimes(1);
  });

  describe('lifecycle', () => {
    it('should call registerTransition on update', () => {
      const relations = [];
      const newRelations = [
        { from: { anchor: 'left' }, to: { id: 'toto', anchor: 'top' } },
      ];

      const wrapper: ReactWrapper = mountContainer(relations, newRelations);

      // Trigger update in ArcherElement
      wrapper.find(PassThrough).find('div.foo').simulate('click');

      wrapper.update();

      expect(registerTransitionMock).toHaveBeenCalledWith('foo', newRelations, []);
    });

    it('should not call registerTransition on update if relation exists', () => {
      const relations = [
        { from: { anchor: 'left' }, to: { id: 'toto', anchor: 'top' } },
      ];
      const newRelations = [
        { from: { anchor: 'left' }, to: { id: 'toto', anchor: 'top' } },
      ];

      const wrapper: ReactWrapper = mountContainer(relations, newRelations);

      // mergeTransitions will get called with default []
      registerTransitionMock.mockReset();

      // Trigger update in ArcherElement
      wrapper.find(PassThrough).find('div.foo').simulate('click');

      wrapper.update();

      expect(registerTransitionMock).not.toHaveBeenCalled();
    });

    it('should call registerTransition on mount if relations', () => {
      const relations = [
        { from: { anchor: 'left' }, to: { id: 'toto', anchor: 'top' } },
      ];

      const wrapper: ReactWrapper = mountContainer(relations, []);

      wrapper.update();

      expect(registerTransitionMock).toHaveBeenCalledWith('foo', relations, []);
    });

    it('should not call registerTransition on mount if no relations', () => {
      const relations = [];

      const wrapper: ReactWrapper = mountContainer(relations, []);

      wrapper.update();

      expect(registerTransitionMock).not.toHaveBeenCalled();
    });
  });
});
