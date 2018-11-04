// @flow

import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import Point from './Point';

import SvgArrow from './SvgArrow';

type Props = {
  arrowLength: number,
  arrowThickness: number,
  strokeColor: string,
  strokeWidth: number,
  children: React$Node,
  style: Object,
  className: string,
};

type State = {
  refs: {
    [string]: HTMLElement,
  },
  fromTo: Array<CompleteRelationType>,
  observer: ResizeObserver,
  parent: ?HTMLElement,
};

const svgContainerStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
};

function rectToPoint(rect: ClientRect) {
  return new Point(rect.left, rect.top);
}

function computeCoordinatesFromAnchorPosition(
  anchorPosition: AnchorPositionType,
  rect: ClientRect,
) {
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

export type ArcherContainerContextType = {
  registerChild?: (string, HTMLElement) => void,
  registerTransition?: (string, RelationType) => void,
};

const ArcherContainerContext = React.createContext<ArcherContainerContextType>(
  {},
);

const ArcherContainerContextProvider = ArcherContainerContext.Provider;
export const ArcherContainerContextConsumer = ArcherContainerContext.Consumer;

export class ArcherContainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const observer = new ResizeObserver(() => {
      this.refreshScreen();
    });
    this.state = {
      refs: {},
      fromTo: [],
      observer,
      parent: null,
    };
  }

  static defaultProps = {
    arrowLength: 10,
    arrowThickness: 6,
    strokeColor: '#f00',
    strokeWidth: 2,
  };

  componentDidMount() {
    window.addEventListener('resize', this.refreshScreen);
  }

  componentWillUnmount() {
    Object.keys(this.state.refs).map(elementKey => {
      const { observer } = this.state;
      observer.unobserve(this.state.refs[elementKey]);
    });
    window.removeEventListener('resize', this.refreshScreen);
  }

  refreshScreen = (): void => {
    this.setState({ ...this.state });
  };

  storeParent = (ref: ?HTMLElement): void => {
    if (this.state.parent) {
      return;
    }
    this.setState(currentState => ({ ...currentState, parent: ref }));
  };

  getRectFromRef = (ref: ?HTMLElement): ?ClientRect => {
    if (!ref) {
      return null;
    }
    return ref.getBoundingClientRect();
  };

  getParentCoordinates = (): Point => {
    const rectp = this.getRectFromRef(this.state.parent);

    if (!rectp) {
      return new Point(0, 0);
    }
    return rectToPoint(rectp);
  };

  getPointCoordinatesFromAnchorPosition = (
    position: AnchorPositionType,
    index: string,
    parentCoordinates: Point,
  ): Point => {
    const rect = this.getRectFromRef(this.state.refs[index]);

    if (!rect) {
      return new Point(0, 0);
    }
    const absolutePosition = computeCoordinatesFromAnchorPosition(
      position,
      rect,
    );

    return absolutePosition.substract(parentCoordinates);
  };

  registerTransition = (fromElement: string, relation: RelationType): void => {
    // TODO prevent duplicate registering
    // TODO improve the state merge... (should be shorter)
    const fromTo = [...this.state.fromTo];
    const newFromTo = {
      ...relation,
      from: { ...relation.from, id: fromElement },
    };
    fromTo.push(newFromTo);

    this.setState((currentState: State) => ({
      // Really can't find a solution for this Flow error. I think it's a bug.
      // I wrote an issue on Flow, let's see what happens.
      // https://github.com/facebook/flow/issues/7135
      // $FlowFixMe
      fromTo: [...currentState.fromTo, ...fromTo],
    }));
  };

  registerChild = (id: string, ref: HTMLElement): void => {
    if (!this.state.refs[id]) {
      this.state.observer.observe(ref);
      this.setState((currentState: State) => ({
        refs: { ...currentState.refs, [id]: ref },
      }));
    }
  };

  computeArrows = (): React$Node => {
    const parentCoordinates = this.getParentCoordinates();
    return this.state.fromTo.map(sd => {
      const { from, to, label } = sd;
      const startingAnchor = from.anchor;
      const startingPoint = this.getPointCoordinatesFromAnchorPosition(
        from.anchor,
        from.id,
        parentCoordinates,
      );
      const endingAnchor = to.anchor;
      const endingPoint = this.getPointCoordinatesFromAnchorPosition(
        to.anchor,
        to.id,
        parentCoordinates,
      );
      return (
        <SvgArrow
          key={JSON.stringify({ from, to })}
          startingPoint={startingPoint}
          startingAnchor={startingAnchor}
          endingPoint={endingPoint}
          endingAnchor={endingAnchor}
          strokeColor={this.props.strokeColor}
          arrowLength={this.props.arrowLength}
          strokeWidth={this.props.strokeWidth}
          arrowLabel={label}
        />
      );
    });
  };

  render() {
    const SvgArrows = this.computeArrows();
    const arrowPath = `M0,0 L0,${this.props.arrowThickness} L${this.props
      .arrowLength - 1},${this.props.arrowThickness / 2} z`;

    return (
      <ArcherContainerContextProvider
        value={{
          registerTransition: this.registerTransition,
          registerChild: this.registerChild,
        }}
      >
        <div
          style={{ ...this.props.style, position: 'relative' }}
          className={this.props.className}
        >
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
                <path d={arrowPath} fill={this.props.strokeColor} />
              </marker>
            </defs>
            {SvgArrows}
          </svg>

          <div ref={this.storeParent}>{this.props.children}</div>
        </div>
      </ArcherContainerContextProvider>
    );
  }
}

export default ArcherContainer;
