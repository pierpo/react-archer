import React from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import Point from './Point';

import SvgArrow from './SvgArrow';

const svgContainerStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
};

function rectToPoint(rect) {
  return new Point(rect.left, rect.top);
}

function computeCoordinatesFromAnchorPosition (anchorPosition, rect) {
  switch (anchorPosition) {
  case 'top':
    return rectToPoint(rect).add(new Point(rect.width / 2, 0));
  case 'bottom':
    return rectToPoint(rect).add(new Point(rect.width / 2, rect.height));
  case 'left':
    return rectToPoint(rect).add(new Point(0, rect.height / 2));
  case 'right':
    return rectToPoint(rect).add(new Point(rect.width, rect.height / 2));
  default:
    return new Point(0, 0);
  }
}

export class ArcherContainer extends React.Component {
  constructor(props) {
    super(props);
    this.registerTransition = this.registerTransition.bind(this);
    this.registerChild = this.registerChild.bind(this);
    this.storeParent = this.storeParent.bind(this);
    this.refreshScreen = this.refreshScreen.bind(this);
    this.state = {
      refs: {},
      fromTo: [],
    };
  }
  componentDidMount() {
    window.addEventListener('resize', this.refreshScreen);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.refreshScreen);
  }

  refreshScreen() {
    this.setState({...this.state});
  }

  getChildContext() {
    return {
      registerTransition: this.registerTransition,
      registerChild: this.registerChild,
    };
  }

  storeParent(ref) {
    if (this.state.parent) {
      return;
    }
    this.setState(currentState => ({...currentState, parent: ref}));
  }

  getRectFromRef(ref) {
    if (!ref) {
      return new Point(0, 0);
    }
    return ref.getBoundingClientRect();
  }

  getParentCoordinates() {
    const rectp = this.getRectFromRef(this.state.parent);
    return rectToPoint(rectp);
  }

  getPointCoordinatesFromAnchorPosition(position, index, parentCoordinates) {
    const rect = this.getRectFromRef(this.state.refs[index]);
    const absolutePosition = computeCoordinatesFromAnchorPosition(position, rect);

    return absolutePosition.substract(parentCoordinates);
  }

  registerTransition(fromElement, relation) {
    const fromTo = [...this.state.fromTo];
    const newFromTo = { ...relation, from: { ...relation.from, id: fromElement } };
    fromTo.push(newFromTo);
    this.setState(currentState => {
      return { ...this.currentState, fromTo: [...currentState.fromTo, ...fromTo] };
    });
  }

  registerChild(id) {
    return (ref) => {
      if (!this.state.refs[id]) {
        const ro = new ResizeObserver(() => {
          this.refreshScreen();
        });
        ro.observe(ref);
        this.setState(currentState => {
          return { ...this.currentState, refs: { ...currentState.refs, [id]: ref } };
        });
      }
    };
  }

  computeArrows() {
    const parentCoordinates = this.getParentCoordinates();
    return this.state.fromTo.map((sd) => {
      const startingAnchor = sd.from.anchor;
      const startingPoint = this.getPointCoordinatesFromAnchorPosition(sd.from.anchor, sd.from.id, parentCoordinates);
      const endingAnchor = sd.to.anchor;
      const endingPoint = this.getPointCoordinatesFromAnchorPosition(sd.to.anchor, sd.to.id, parentCoordinates);
      return (
        <SvgArrow
          key={JSON.stringify(sd)}
          startingPoint={startingPoint}
          startingAnchor={startingAnchor}
          endingPoint={endingPoint}
          endingAnchor={endingAnchor}
          strokeColor={this.props.strokeColor}
          arrowLength={this.props.arrowLength}
        />
      );}
    );
  }

  render() {
    const SvgArrows = this.computeArrows();
    const arrowPath = `M0,0 L0,${this.props.arrowThickness} L${this.props.arrowLength - 1},${this.props.arrowThickness / 2} z`;

    return (
      <div style={{ position: 'relative' }}>
        <svg style={svgContainerStyle}>
          <defs>
            <marker
              id="arrow"
              markerWidth={this.props.arrowLength}
              markerHeight={this.props.arrowThickness}
              refX="0"
              refY={this.props.arrowThickness / 2}
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path
                d={arrowPath}
                fill={this.props.strokeColor} />
            </marker>
          </defs>
          {SvgArrows}
        </svg>

        <div ref={this.storeParent}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

ArcherContainer.propTypes = {
  arrowLength: PropTypes.number,
  arrowThickness: PropTypes.number,
  strokeColor: PropTypes.string,
  children: PropTypes.node,
};

ArcherContainer.defaultProps = {
  arrowLength: 10,
  arrowThickness: 6,
  strokeColor: '#f00',
};

ArcherContainer.childContextTypes = {
  registerChild: PropTypes.func,
  registerTransition: PropTypes.func,
};

export default ArcherContainer;
