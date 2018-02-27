import React from 'react';
import PropTypes from 'prop-types';

export class ArcherElement extends React.Component {
  componentDidMount() {
    if (!this.context.registerTransition || !this.context.registerChild) {
      return;
    }
    if (this.props.relations) {
      this.props.relations.forEach((relation) => {
        this.context.registerTransition(this.props.id, relation);
      });
    }
  }

  render() {
    return (
      <div ref={this.context.registerChild(this.props.id)}>
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
  relations: PropTypes.arrayOf(PropTypes.shape({
    from: PropTypes.shape({
      anchor: anchorType,
    }),
    to: PropTypes.shape({
      anchor: anchorType,
      id: PropTypes.string,
    }),
  })),
};

export default ArcherElement;
