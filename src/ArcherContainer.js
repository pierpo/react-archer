// @flow

import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';

import Point from './Point';
import SvgArrow from './SvgArrow';

export type ArcherContainerContextType = {
  registerChild: (string, HTMLElement) => void,
  registerTransitions: (string, SourceToTargetType[]) => void,
  unregisterChild: string => void,
  unregisterTransitions: string => void,
} | null;

type FunctionChild = (context: React$Context<ArcherContainerContextType>) => React$Node;

type Props = {
  arrowLength: number,
  arrowThickness: number,
  strokeColor: string,
  strokeWidth: number,
  strokeDasharray?: string,
  noCurves?: boolean,
  children: React$Node | FunctionChild,
  style?: Object,
  svgContainerStyle?: Object,
  className?: string,
  offset?: number,
};

type SourceToTargetsArrayType = SourceToTargetType[];

// For typing when munging sourceToTargetsMap
type JaggedSourceToTargetsArrayType = SourceToTargetsArrayType[];

type State = {
  refs: {
    [string]: HTMLElement,
  },
  sourceToTargetsMap: {
    [string]: SourceToTargetsArrayType,
  },
  observer: ResizeObserver,
  parent: ?HTMLElement,
};

type SVGContainerStyle = {
  position: string,
  width: string,
  height: string,
  top: number,
  left: number,
};

const defaultSvgContainerStyle: SVGContainerStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
};

function rectToPoint(rect: ClientRect): Point {
  return new Point(rect.left, rect.top);
}

function computeCoordinatesFromAnchorPosition(
  anchorPosition: AnchorPositionType,
  rect: ClientRect,
): Point {
  switch (anchorPosition) {
    case 'top':
      return rectToPoint(rect).add(new Point(rect.width / 2, 0));
    case 'bottom':
      return rectToPoint(rect).add(new Point(rect.width / 2, rect.height));
    case 'left':
      return rectToPoint(rect).add(new Point(0, rect.height / 2));
    case 'right':
      return rectToPoint(rect).add(new Point(rect.width, rect.height / 2));
    case 'middle':
      return rectToPoint(rect).add(new Point(rect.width / 2, rect.height / 2));
    default:
      return new Point(0, 0);
  }
}

const ArcherContainerContext = React.createContext<ArcherContainerContextType>(null);

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
    if (window) window.addEventListener('resize', this.refreshScreen);
  }

  componentWillUnmount() {
    const { observer } = this.state;

    Object.keys(this.state.refs).map(elementKey => {
      observer.unobserve(this.state.refs[elementKey]);
    });

    if (window) window.removeEventListener('resize', this.refreshScreen);
  }

  refreshScreen = (): void => {
    this.setState({ ...this.state });
  };

  _storeParent = (ref: ?HTMLElement): void => {
    if (this.state.parent) return;

    this.setState(currentState => ({ ...currentState, parent: ref }));
  };

  _getRectFromRef = (ref: ?HTMLElement): ?ClientRect => {
    if (!ref) return null;

    return ref.getBoundingClientRect();
  };

  _getParentCoordinates = (): Point => {
    const rectp = this._getRectFromRef(this.state.parent);

    if (!rectp) {
      return new Point(0, 0);
    }
    return rectToPoint(rectp);
  };

  _getPointCoordinatesFromAnchorPosition = (
    position: AnchorPositionType,
    index: string,
    parentCoordinates: Point,
  ): Point => {
    const rect = this._getRectFromRef(this.state.refs[index]);

    if (!rect) {
      return new Point(0, 0);
    }
    const absolutePosition = computeCoordinatesFromAnchorPosition(position, rect);

    return absolutePosition.substract(parentCoordinates);
  };

  _registerTransitions = (elementId: string, newSourceToTargets: SourceToTargetType[]): void => {
    this.setState((prevState: State) => ({
      sourceToTargetsMap: {
        ...prevState.sourceToTargetsMap,
        [elementId]: newSourceToTargets,
      },
    }));
  };

  _unregisterTransitions = (elementId: string): void => {
    this.setState(currentState => {
      const sourceToTargetsMapCopy = { ...currentState.sourceToTargetsMap };
      delete sourceToTargetsMapCopy[elementId];
      return { sourceToTargetsMap: sourceToTargetsMapCopy };
    });
  };

  _registerChild = (id: string, ref: HTMLElement): void => {
    if (!this.state.refs[id]) {
      this.state.observer.observe(ref);

      this.setState((currentState: State) => ({
        refs: { ...currentState.refs, [id]: ref },
      }));
    }
  };

  _unregisterChild = (id: string): void => {
    this.setState((currentState: State) => {
      if (currentState.refs[id]) {
        currentState.observer.unobserve(currentState.refs[id]);
      }
      const newRefs = { ...currentState.refs };
      delete newRefs[id];
      return { refs: newRefs };
    });
  };

  _getSourceToTargets = (): SourceToTargetType[] => {
    const { sourceToTargetsMap } = this.state;

    // Object.values is unavailable in IE11
    const jaggedSourceToTargets: JaggedSourceToTargetsArrayType = Object.keys(
      sourceToTargetsMap,
    ).map((key: string) => sourceToTargetsMap[key]);

    // Flatten
    return [].concat.apply([], jaggedSourceToTargets);
  };

  _computeArrows = (): React$Element<typeof SvgArrow>[] => {
    const parentCoordinates = this._getParentCoordinates();

    return this._getSourceToTargets().map(
      ({ source, target, label, style }: SourceToTargetType) => {
        const strokeColor = (style && style.strokeColor) || this.props.strokeColor;

        // Actual arrowLength value might be 0, which can't work with a simple 'actualValue || defaultValue'
        let arrowLength = this.props.arrowLength;
        if (style && (style.arrowLength || style.arrowLength === 0)) {
          arrowLength = style.arrowLength;
        }

        const strokeWidth = (style && style.strokeWidth) || this.props.strokeWidth;

        const strokeDasharray = (style && style.strokeDasharray) || this.props.strokeDasharray;

        const arrowThickness = (style && style.arrowThickness) || this.props.arrowThickness;

        const noCurves = (style && style.noCurves) || this.props.noCurves;

        const offset = this.props.offset || 0;

        const startingAnchorOrientation = source.anchor;
        const startingPoint = this._getPointCoordinatesFromAnchorPosition(
          source.anchor,
          source.id,
          parentCoordinates,
        );

        const endingAnchorOrientation = target.anchor;
        const endingPoint = this._getPointCoordinatesFromAnchorPosition(
          target.anchor,
          target.id,
          parentCoordinates,
        );

        return (
          <SvgArrow
            key={JSON.stringify({ source, target })}
            startingPoint={startingPoint}
            startingAnchorOrientation={startingAnchorOrientation}
            endingPoint={endingPoint}
            endingAnchorOrientation={endingAnchorOrientation}
            strokeColor={strokeColor}
            arrowLength={arrowLength}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            arrowLabel={label}
            arrowThickness={arrowThickness}
            arrowMarkerId={this._getMarkerId(source, target)}
            noCurves={!!noCurves}
            offset={offset}
          />
        );
      },
    );
  };

  /** Generates an id for an arrow marker
   * Useful to have one marker per arrow so that each arrow
   * can have a different color!
   * */
  _getMarkerId = (source: EntityRelationType, target: EntityRelationType): string => {
    return `${this.arrowMarkerUniquePrefix}${source.id}${target.id}`;
  };

  /** Generates all the markers
   * We want one marker per arrow so that each arrow can have
   * a different color or size
   * */
  _generateAllArrowMarkers = (): React$Element<'marker'>[] => {
    return this._getSourceToTargets().map(
      ({ source, target, label, style }: SourceToTargetType) => {
        const strokeColor = (style && style.strokeColor) || this.props.strokeColor;

        // Actual arrowLength value might be 0, which can't work with a simple 'actualValue || defaultValue'
        let arrowLength = this.props.arrowLength;
        if (style && (style.arrowLength || style.arrowLength === 0)) {
          arrowLength = style.arrowLength;
        }

        const arrowThickness = (style && style.arrowThickness) || this.props.arrowThickness;

        const arrowPath = `M0,0 L0,${arrowThickness} L${arrowLength},${arrowThickness / 2} z`;

        return (
          <marker
            id={this._getMarkerId(source, target)}
            key={this._getMarkerId(source, target)}
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
      },
    );
  };

  _svgContainerStyle = (): Object => ({
    ...defaultSvgContainerStyle,
    ...this.props.svgContainerStyle,
  });

  render() {
    const SvgArrows = this._computeArrows();
    let children: ?React$Node;

    if (typeof this.props.children === 'function') {
      children = this.props.children(ArcherContainerContext);
    } else {
      children = this.props.children;
    }

    return (
      <ArcherContainerContextProvider
        value={{
          registerTransitions: this._registerTransitions,
          unregisterTransitions: this._unregisterTransitions,
          registerChild: this._registerChild,
          unregisterChild: this._unregisterChild,
        }}
      >
        <div style={{ ...this.props.style, position: 'relative' }} className={this.props.className}>
          <svg style={this._svgContainerStyle()}>
            <defs>{this._generateAllArrowMarkers()}</defs>
            {SvgArrows}
          </svg>

          <div style={{ height: '100%' }} ref={this._storeParent}>
            {children}
          </div>
        </div>
      </ArcherContainerContextProvider>
    );
  }
}

export default ArcherContainer;
