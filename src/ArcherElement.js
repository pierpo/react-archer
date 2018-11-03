// @flow

import React from 'react';

import {
  type ArcherContainerContextType,
  ArcherContainerContextConsumer,
} from './ArcherContainer';

type Props = {
  id: string,
  relations: Array<RelationType>,
  style: Object,
  className: string,
  children: React$Node,
  context: ArcherContainerContextType,
};

const stringifyRelations = (relations: Array<RelationType>): string => {
  const relationsWithStringifiedLabels = (relations || []).map(r => {
    // $FlowFixMe TODO
    if (r.label && r.label.props) {
      return JSON.stringify(r.label.props);
    }
    return JSON.stringify(r.label);
  });

  return JSON.stringify(relationsWithStringifiedLabels);
};

export class ArcherElement extends React.Component<Props> {
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

  registerAllTransitions(relations: Array<RelationType>) {
    relations.forEach(relation => {
      if (!this.props.context.registerTransition) return;

      this.props.context.registerTransition(this.props.id, relation);
    });
  }

  onRefUpdate = (ref: ?HTMLElement) => {
    if (!ref) return;
    if (!this.props.context.registerChild) return;

    this.props.context.registerChild(this.props.id, ref);
  };

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

const ArcherElementWithContext = (props: *) => (
  <ArcherContainerContextConsumer>
    {context => <ArcherElement {...props} context={context} />}
  </ArcherContainerContextConsumer>
);

export default ArcherElementWithContext;
