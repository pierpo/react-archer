import React from 'react';
import PropTypes from 'prop-types';

const stringifyRelations = relations => {
  const relationsWithStringifiedLabels = (relations || []).map(r => {
    if (r.label && r.label.props) {
      return JSON.stringify(r.label.props);
    }
    return JSON.stringify(r.label);
  });

  return JSON.stringify(relationsWithStringifiedLabels);
};

export class ArcherElement extends React.Component {
  componentWillReceiveProps(nextProps) {
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

  registerAllTransitions(relations) {
    relations.forEach(relation => {
      this.context.registerTransition(this.props.id, relation);
    });
  }

  onRefUpdate = ref => {
    if (!ref) {
      return;
    }
    this.context.registerChild(this.props.id, ref);
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

ArcherElement.contextTypes = {
  registerChild: PropTypes.func,
  registerTransition: PropTypes.func,
  refresh: PropTypes.func,
};

const anchorType = PropTypes.oneOf(['top', 'bottom', 'left', 'right']);

ArcherElement.propTypes = {
  id: PropTypes.string,
  relations: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node,
      from: PropTypes.shape({
        anchor: anchorType,
      }),
      to: PropTypes.shape({
        anchor: anchorType,
        id: PropTypes.string,
      }),
    }),
  ),
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default ArcherElement;
