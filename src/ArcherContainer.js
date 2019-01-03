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
  style?: Object,
  svgContainerStyle?: Object,
  className?: string,
};

type SourceToTargetsArrayType = Array<SourceToTargetType>;

// For typing when munging sourceToTargetsMap
type JaggedSourceToTargetsArrayType = Array<SourceToTargetsArrayType>;

type State = {
  refs: {
    [string]: HTMLElement,
  },
  sourceToTargetsMap: {
    [string]: SourceToTargetsArrayType
  },
  observer: ResizeObserver,
  parent: ?HTMLElement,
};

const defaultSvgContainerStyle = {
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
  registerTransitions?: (string, Array<SourceToTargetType>) => void,
  unregisterChild?: string => void,
  unregisterTransitions?: string => void,
};

const ArcherContainerContext = React.createContext<ArcherContainerContextType>(
  {},
);

export const ArcherContainerContextProvider = ArcherContainerContext.Provider;
export const ArcherContainerContextConsumer = ArcherContainerContext.Consumer;

export class ArcherContainer extends React.Component<Props, State> {
  arrowMarkerUniquePrefix: string;

  constructor(props: Props) {
    super(props);

    const observer = new ResizeObserver(() => {
      this.refreshScreen();
    });

    this.state = {
      refs: {},
      sourceToTargetsMap: {},
      observer,
      parent: null,
    };

    const arrowMarkerRandomNumber = Math.random()
      .toString()
      .slice(2);

    this.arrowMarkerUniquePrefix = `arrow${arrowMarkerRandomNumber}`;
  }

  static defaultProps = {
    arrowLength: 10,
    arrowThickness: 6,
    strokeColor: '#f00',
    strokeWidth: 2,
    svgContainerStyle: {},
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
    if (this.state.parent) return;

    this.setState(currentState => ({ ...currentState, parent: ref }));
  };

  getRectFromRef = (ref: ?HTMLElement): ?ClientRect => {
    if (!ref) return null;

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

  registerTransitions = (elementId: string, newSourceToTargets: Array<SourceToTargetType>): void => {
    this.setState((prevState: State) => ({
      sourceToTargetsMap: {
        ...prevState.sourceToTargetsMap,
        [elementId]: newSourceToTargets
      },
    }));
  };

  unregisterTransitions = (elementId: string): void => {
    const { sourceToTargetsMap } = this.state;

    const sourceToTargetsMapCopy = { ...sourceToTargetsMap };

    delete sourceToTargetsMapCopy[elementId];

    this.setState(() => ({ sourceToTargetsMap: sourceToTargetsMapCopy }));
  };

  registerChild = (id: string, ref: HTMLElement): void => {
    if (!this.state.refs[id]) {
      this.state.observer.observe(ref);

      this.setState((currentState: State) => ({
        refs: { ...currentState.refs, [id]: ref },
      }));
    }
  };

  unregisterChild = (id: string): void => {
    const { refs, observer } = this.state;
    observer.unobserve(refs[id]);
    const newRefs = { ...refs };
    delete newRefs[id];
    this.setState(() => ({ refs: newRefs }));
  };

  getSourceToTargets = (): Array<SourceToTargetType> => {
    const { sourceToTargetsMap } = this.state;

    // Object.values is unavailable in IE11
    const jaggedSourceToTargets: JaggedSourceToTargetsArrayType = Object.keys(sourceToTargetsMap).map((key: string) => sourceToTargetsMap[key]);

    // Flatten
    return [].concat.apply([], jaggedSourceToTargets);
  };

  computeArrows = (): React$Node => {
    const parentCoordinates = this.getParentCoordinates();

    return this.getSourceToTargets().map(({ source, target, label, style }: SourceToTargetType) => {
      const strokeColor =
        (style && style.strokeColor) || this.props.strokeColor;

      const arrowLength =
        (style && style.arrowLength) || this.props.arrowLength;

      const strokeWidth =
        (style && style.strokeWidth) || this.props.strokeWidth;

      const arrowThickness =
        (style && style.arrowThickness) || this.props.arrowThickness;

      const startingAnchor = source.anchor;
      const startingPoint = this.getPointCoordinatesFromAnchorPosition(
        source.anchor,
        source.id,
        parentCoordinates,
      );

      const endingAnchor = target.anchor;
      const endingPoint = this.getPointCoordinatesFromAnchorPosition(
        target.anchor,
        target.id,
        parentCoordinates,
      );

      return (
        <SvgArrow
          key={JSON.stringify({ source, target })}
          startingPoint={startingPoint}
          startingAnchor={startingAnchor}
          endingPoint={endingPoint}
          endingAnchor={endingAnchor}
          strokeColor={strokeColor}
          arrowLength={arrowLength}
          strokeWidth={strokeWidth}
          arrowLabel={label}
          arrowThickness={arrowThickness}
          arrowMarkerId={this.getMarkerId(source, target)}
        />
      );
    });
  };

  /** Generates an id for an arrow marker
   * Useful to have one marker per arrow so that each arrow
   * can have a different color!
   * */
  getMarkerId = (source: EntityRelationType, target: EntityRelationType): string => {
    return `${this.arrowMarkerUniquePrefix}${source.id}${target.id}`;
  };

  /** Generates all the markers
   * We want one marker per arrow so that each arrow can have
   * a different color or size
   * */
  generateAllArrowMarkers = (): React$Node => {
    return this.getSourceToTargets().map(({ source, target, label, style }: SourceToTargetType) => {

      const strokeColor =
        (style && style.strokeColor) || this.props.strokeColor;

      const arrowLength =
        (style && style.arrowLength) || this.props.arrowLength;

      const arrowThickness =
        (style && style.arrowThickness) || this.props.arrowThickness;

      const arrowPath = `M0,0 L0,${arrowThickness} L${arrowLength -
        1},${arrowThickness / 2} z`;

      return (
        <marker
          id={this.getMarkerId(source, target)}
          key={this.getMarkerId(source, target)}
          markerWidth={arrowLength}
          markerHeight={arrowThickness}
          refX="0"
          refY={arrowThickness / 2}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d={arrowPath} fill={strokeColor} />
        </marker>
      );
    });
  };

  svgContainerStyle = () => ({
    ...defaultSvgContainerStyle,
    ...this.props.svgContainerStyle,
  });

  render() {
    const SvgArrows = this.computeArrows();

    return (
      <ArcherContainerContextProvider
        value={{
          registerTransitions: this.registerTransitions,
          unregisterTransitions: this.unregisterTransitions,
          registerChild: this.registerChild,
          unregisterChild: this.unregisterChild,
        }}
      >
        <div
          style={{ ...this.props.style, position: 'relative' }}
          className={this.props.className}
        >
          <svg style={this.svgContainerStyle()}>
            <defs>{this.generateAllArrowMarkers()}</defs>
            {SvgArrows}
          </svg>

          <div style={{ height: '100%' }} ref={this.storeParent}>{this.props.children}</div>
        </div>
      </ArcherContainerContextProvider>
    );
  }
}

export default ArcherContainer;
