// @flow
import * as React from 'react';
import { type ReactWrapper, mount } from 'enzyme';
import ArcherElement from './ArcherElement';
import { ArcherContainerContextProvider } from './ArcherContainer';

describe('ArcherElement', () => {
  let registerChildMock;
  let unregisterChildMock;
  let registerTransitionsMock;
  let unregisterTransitionsMock;

  const children = <div>hi</div>;
  const defaultProps = {
    relations: [],
    id: '',
    children,
  };

  type MockArcherContainerType = {
    registerTransitions: Function,
    unregisterTransitions: Function,
    registerChild: Function,
    unregisterChild: Function,
    children: React.Node,
  };

  const MockArcherContainer = ({
    registerTransitions,
    unregisterTransitions,
    registerChild,
    unregisterChild,
    children,
  }: MockArcherContainerType) => (
    <ArcherContainerContextProvider
      value={{
        registerTransitions,
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
    newRelations: Array<RelationType>,
  ): ReactWrapper<typeof MockArcherContainer> => {
    const props = { ...defaultProps, id: 'foo' };

    return mount(
      <MockArcherContainer
        registerChild={registerChildMock}
        unregisterChild={unregisterChildMock}
        registerTransitions={registerTransitionsMock}
        unregisterTransitions={unregisterTransitionsMock}
      >
        <PassThrough {...props} relations={relations} newRelations={newRelations} />
      </MockArcherContainer>,
    );
  };

  beforeEach(() => {
    registerChildMock = jest.fn();
    unregisterChildMock = jest.fn();
    registerTransitionsMock = jest.fn();
    unregisterTransitionsMock = jest.fn();
  });

  it('should register and unregister child on mounting ref callback', () => {
    const relations = [];

    const wrapper: ReactWrapper<typeof MockArcherContainer> = mountContainer(relations, []);

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
    it('should call registerTransitions with sourceToTargets on update', () => {
      const relations = [];
      const newRelations = [{ targetId: 'toto', targetAnchor: 'top', sourceAnchor: 'left' }];

      const sourceToTargets = [
        {
          source: { id: 'foo', anchor: 'left' },
          target: { id: 'toto', anchor: 'top' },
          label: undefined,
          style: undefined,
        },
      ];

      const wrapper: ReactWrapper<typeof MockArcherContainer> = mountContainer(
        relations,
        newRelations,
      );

      // Trigger update in ArcherElement
      wrapper
        .find(PassThrough)
        .find('div.foo')
        .simulate('click');

      wrapper.update();

      expect(registerTransitionsMock).toHaveBeenCalledWith('foo', sourceToTargets);
    });

    it('should not call registerTransitions on update if relation exists', () => {
      const relations = [{ targetId: 'toto', targetAnchor: 'top', sourceAnchor: 'left' }];
      const newRelations = [{ targetId: 'toto', targetAnchor: 'top', sourceAnchor: 'left' }];

      const wrapper: ReactWrapper<typeof MockArcherContainer> = mountContainer(
        relations,
        newRelations,
      );

      // Will get called on mount regardless
      registerTransitionsMock.mockReset();

      // Trigger update in ArcherElement
      wrapper
        .find(PassThrough)
        .find('div.foo')
        .simulate('click');

      wrapper.update();

      expect(registerTransitionsMock).not.toHaveBeenCalled();
    });

    it('should call registerTransitions with sourceToTargets on mount if relations', () => {
      const relations = [{ targetId: 'toto', targetAnchor: 'top', sourceAnchor: 'left' }];

      const sourceToTargets = [
        {
          source: { id: 'foo', anchor: 'left' },
          target: { id: 'toto', anchor: 'top' },
          label: undefined,
          style: undefined,
        },
      ];

      const wrapper: ReactWrapper<typeof MockArcherContainer> = mountContainer(relations, []);

      wrapper.update();

      expect(registerTransitionsMock).toHaveBeenCalledWith('foo', sourceToTargets);
    });

    it('should not call registerTransitions on mount if no relations', () => {
      const relations = [];

      const wrapper: ReactWrapper<typeof MockArcherContainer> = mountContainer(relations, []);

      wrapper.update();

      expect(registerTransitionsMock).not.toHaveBeenCalled();
    });
  });
});
