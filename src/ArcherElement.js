// @flow

import React from 'react';

import {
  type ArcherContainerContextType,
  ArcherContainerContextConsumer,
} from './ArcherContainer';

type OuterProps = {
  id: string,
  relations: Array<RelationType>,
  style?: Object,
  className?: string,
  children: React$Node,
};

type InnerProps = OuterProps & {
  context: ArcherContainerContextType,
};

// This function allows us to compare relations with a deep comparison,
// maybe not in the most robust way...
const stringifyRelations = (relations: Array<RelationType>): string => {
  const stringifiedLabels = (relations || []).map(r => {
    // $FlowFixMe TODO
    if (r.label && r.label.props) {
      return JSON.stringify(r.label.props);
    }
    return JSON.stringify(r.label);
  });

  const relationsWithoutLabels = (relations || []).map(r => {
    const { label, ...rest } = r;
    return rest;
  });

  return (
    JSON.stringify(relationsWithoutLabels) + JSON.stringify(stringifiedLabels)
  );
};

export class ArcherElementNoContext extends React.Component<InnerProps> {
  static defaultProps = {
    relations: [],
  };

  componentDidUpdate(prevProps: InnerProps) {
    if (
      stringifyRelations(prevProps.relations) ===
      stringifyRelations(this.props.relations)
    ) {
      return;
    }

    this.registerTransitions(this.props.relations, prevProps.relations);
  }

  componentDidMount() {
    if (this.props.relations.length === 0) {
      return;
    }

    this.registerTransitions(this.props.relations);
  }

  componentWillUnmount() {
    this.unregisterChild();
    this.unregisterTransitions();
  }

  registerTransitions(
    newRelations: Array<RelationType>,
    oldRelations: Array<RelationType> = [],
  ) {
    if (!this.props.context.registerTransition) {
      throw new Error(
        `Could not find "registerTransition" in the context of ` +
        `<ArcherElement>. Wrap the component in a <ArcherContainer>.`
      );
    }

    this.props.context.registerTransition(
      this.props.id,
      newRelations,
      oldRelations,
    );
  }

  unregisterTransitions() {
    if (!this.props.context.unregisterTransitions) {
      throw new Error(
        `Could not find "unregisterTransitions" in the context of ` +
        `<ArcherElement>. Wrap the component in a <ArcherContainer>.`
      );
    }

    this.props.context.unregisterTransitions(this.props.id);
  }

  onRefUpdate = (ref: ?HTMLElement) => {
    if (!ref) return;
    if (!this.props.context.registerChild) {
      throw new Error(
        `Could not find "registerChild" in the context of ` +
        `<ArcherElement>. Wrap the component in a <ArcherContainer>.`
      );
    }

    this.props.context.registerChild(this.props.id, ref);
  };

  unregisterChild() {
    if (!this.props.context.unregisterChild) {
      throw new Error(
        `Could not find "unregisterChild" in the context of ` +
        `<ArcherElement>. Wrap the component in a <ArcherContainer>.`
      );
    }

    this.props.context.unregisterChild(this.props.id);
  }

  render() {
    return (
      <div
        style={{ ...this.props.style, position: 'relative' }}
        className={this.props.className}
        ref={this.onRefUpdate}
      >
        {this.props.children}
      </div>
    );
  }
}

const ArcherElementWithContext = (props: OuterProps) => (
  <ArcherContainerContextConsumer>
    {context => <ArcherElementNoContext {...props} context={context} />}
  </ArcherContainerContextConsumer>
);

export default ArcherElementWithContext;
