// @flow

import React from 'react';

import {
  type ArcherContainerContextType,
  ArcherContainerContextConsumer,
} from './ArcherContainer';

type Props = {
  id: string,
  relations: Array<RelationType>,
  style?: Object,
  className?: string,
  children: React$Node,
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

export class ArcherElementNoContext extends React.Component<Props> {
  componentWillReceiveProps(nextProps: Props) {
    if (
      stringifyRelations(this.props.relations) ===
      stringifyRelations(nextProps.relations)
    ) {
      return;
    }
    this.registerAllTransitions(nextProps.relations);
  }

  componentDidMount() {
    if (!this.props.relations) {
      return;
    }
    this.registerAllTransitions(this.props.relations);
  }

  componentWillUnmount() {
    this.unregisterChild();
    this.unregisterAllTransitions();
  }

  registerAllTransitions(relations: Array<RelationType>) {
    relations.forEach(relation => {
      if (!this.props.context.registerTransition) return;

      this.props.context.registerTransition(this.props.id, relation);
    });
  }

  unregisterAllTransitions() {
    if (!this.props.context.unregisterAllTransitions) return;
    this.props.context.unregisterAllTransitions(this.props.id);
  }

  onRefUpdate = (ref: ?HTMLElement) => {
    if (!ref) return;
    if (!this.props.context.registerChild) return;

    this.props.context.registerChild(this.props.id, ref);
  };

  unregisterChild() {
    if (!this.props.context.unregisterChild) return;

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

const ArcherElementWithContext = (props: Props) => (
  <ArcherContainerContextConsumer>
    {context => <ArcherElementNoContext {...props} context={context} />}
  </ArcherContainerContextConsumer>
);

export default ArcherElementWithContext;
