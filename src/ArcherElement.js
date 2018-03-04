import React from 'react';
import PropTypes from 'prop-types';

export class ArcherElement extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(this.props.relations) ===
      JSON.stringify(nextProps.relations)
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

  render() {
    return (
      <div
        style={{ ...this.props.style, position: 'relative' }}
        className={this.props.className}
        ref={this.context.registerChild(this.props.id)}
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
