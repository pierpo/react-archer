import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import Point from './Point';
import SvgArrow from './SvgArrow';

export type ArcherContainerContextType = {
  registerChild: (arg0: string, arg1: HTMLElement) => void;
  registerTransitions: (arg0: string, arg1: SourceToTargetType[]) => void;
  unregisterChild: (arg0: string) => void;
  unregisterTransitions: (arg0: string) => void;
} | null;

type FunctionChild = (context: React.Context<ArcherContainerContextType>) => React.ReactNode;

type Props = {
  /**
   * A color string
   *
   * @example '#ff0000'
   */
  strokeColor?: string;

  /**
   * A size in px
   */
  strokeWidth?: number;

  /**
   * A string representing an array of sizes
   * See https://www.w3schools.com/graphics/svg_stroking.asp
   */
  strokeDasharray?: string;

  style?: React.CSSProperties;

  /**
   * Style of the SVG container element. Useful if you want to add a z-index to your SVG container to draw the arrows under your elements, for example.
   */
  svgContainerStyle?: React.CSSProperties;

  className?: string;

  /**
   * Optional number for space between element and start/end of stroke
   */
  offset?: number;

  /**
   * Customize the end shape of the line. Defaults to a traditional "arrow" (triangle) shape.
   */
  endShape?: ShapeType;

  /**
   * Set this to true of you want to render a marker at the start of the line
   */
  startMarker?: boolean;

  /**
   * Set this to false of you do not want to render a marker at the end of the line
   */
  endMarker?: boolean;

  /**
   * Define how the line is drawn, grid for angles, straight for direct line and curve for curves
   */

  lineStyle?: ValidLineStyles;

  /**
   * Set this to true if you want angles instead of curves
   */
  noCurves?: boolean;
};

type SourceToTargetsArrayType = SourceToTargetType[];

type State = {
  refs: Record<string, HTMLElement>;
  sourceToTargetsMap: Record<string, SourceToTargetsArrayType>;
  observer: ResizeObserver;
  parent: HTMLElement | null | undefined;
};

const defaultSvgContainerStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  pointerEvents: 'none',
};

function rectToPoint(rect: DOMRect): Point {
  return new Point(rect.left, rect.top);
}

function computeCoordinatesFromAnchorPosition(
  anchorPosition: AnchorPositionType,
  rect: DOMRect,
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

const possibleShapes: Array<ValidShapeTypes> = ['arrow', 'circle'];

const getEndShapeFromStyle = (shapeObj: LineType) => {
  if (!shapeObj.endShape) {
    return possibleShapes[0];
  }

  return (
    (Object.keys(shapeObj.endShape) as ValidShapeTypes[]).filter((key) =>
      possibleShapes.includes(key),
    )[0] || possibleShapes[0]
  );
};

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
    const arrowMarkerRandomNumber = Math.random().toString().slice(2);
    this.arrowMarkerUniquePrefix = `arrow${arrowMarkerRandomNumber}`;
  }

  static defaultProps = {
    endShape: {
      arrow: {
        arrowLength: 10,
        arrowThickness: 6,
      },
      circle: {
        radius: 2,
        fillColor: '#f00',
        strokeColor: '#0ff',
        strokeWidth: 1,
      },
    },
    strokeColor: '#f00',
    strokeWidth: 2,
    svgContainerStyle: {},
  };

  componentDidMount() {
    if (window) window.addEventListener('resize', this.refreshScreen);
  }

  componentWillUnmount() {
    const { observer } = this.state;
    Object.keys(this.state.refs).map((elementKey) => {
      observer.unobserve(this.state.refs[elementKey]);
    });
    if (window) window.removeEventListener('resize', this.refreshScreen);
  }

  /**
   * Use this to recompute all the arrow positions. Useful if arrows do not properly rerender
   * after the viewport or some elements moved.
   */
  refreshScreen = (): void => {
    this.setState({ ...this.state });
  };
  _storeParent = (ref: HTMLElement | null | undefined): void => {
    if (this.state.parent) return;
    this.setState((currentState) => ({ ...currentState, parent: ref }));
  };
  _getRectFromRef = (ref: HTMLElement | null | undefined): DOMRect | null | undefined => {
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
      sourceToTargetsMap: { ...prevState.sourceToTargetsMap, [elementId]: newSourceToTargets },
    }));
  };
  _unregisterTransitions = (elementId: string): void => {
    this.setState((currentState) => {
      const sourceToTargetsMapCopy = { ...currentState.sourceToTargetsMap };
      delete sourceToTargetsMapCopy[elementId];
      return {
        sourceToTargetsMap: sourceToTargetsMapCopy,
      };
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
      return {
        refs: newRefs,
      };
    });
  };
  _getSourceToTargets = (): SourceToTargetType[] => {
    const { sourceToTargetsMap } = this.state;
    // Object.values is unavailable in IE11
    const jaggedSourceToTargets = Object.keys(sourceToTargetsMap).map(
      (key: string) => sourceToTargetsMap[key],
    );
    // Flatten
    return ([] as SourceToTargetType[]).concat
      .apply([], jaggedSourceToTargets)
      .sort((a, b) => a.order - b.order);
  };
  _createShapeObj = (style: LineType) => {
    const chosenEndShape = getEndShapeFromStyle(style);
    const shapeObjMap = {
      arrow: () => ({
        arrow: {
          // $FlowFixMe new error since flow upgrade
          ...this.props.endShape?.arrow,
          ...style.endShape?.arrow,
        },
      }),
      circle: () => ({
        circle: {
          // $FlowFixMe new error since flow upgrade
          ...this.props.endShape?.circle,
          ...style.endShape?.circle,
        },
      }),
    };
    return shapeObjMap[chosenEndShape]();
  };
  _computeArrows = (): React.ReactElement<
    React.ComponentProps<typeof SvgArrow>,
    typeof SvgArrow
  >[] => {
    const parentCoordinates = this._getParentCoordinates();

    return this._getSourceToTargets().map(
      ({ source, target, label, style = {} }: SourceToTargetType) => {
        const startMarker = style.startMarker || this.props.startMarker;
        const endMarker = style.endMarker ?? this.props.endMarker ?? true;

        const endShape = this._createShapeObj(style);

        // TODO remove these casts once defaultProps types are properly handled with functional components
        const strokeColor = style.strokeColor || (this.props.strokeColor as string);
        const strokeWidth = style.strokeWidth || (this.props.strokeWidth as number);
        const strokeDasharray = style.strokeDasharray || this.props.strokeDasharray;
        const noCurves = !!(style.noCurves || this.props.noCurves);
        const lineStyle = style.lineStyle || this.props.lineStyle || (noCurves ? 'angle' : 'curve');
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
            key={JSON.stringify({
              source,
              target,
            })}
            startingPoint={startingPoint}
            startingAnchorOrientation={startingAnchorOrientation}
            endingPoint={endingPoint}
            endingAnchorOrientation={endingAnchorOrientation}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            arrowLabel={label}
            arrowMarkerId={this._getMarkerId(source, target)}
            lineStyle={lineStyle}
            offset={offset}
            enableStartMarker={!!startMarker}
            disableEndMarker={!endMarker}
            endShape={endShape}
          />
        );
      },
    );
  };
  _buildShape = (
    style: LineType,
  ): {
    markerHeight: number;
    markerWidth: number;
    path: React.ReactNode;
    refX: number;
    refY: number;
  } => {
    const chosenEndShape = getEndShapeFromStyle(style);

    const getProp = (
      shape: ValidShapeTypes,
      prop: keyof ArrowShapeType | keyof CircleShapeType,
    ) => {
      return (
        // @ts-expect-error needs changes at runtime to fix the TS error
        style.endShape?.[shape]?.[prop] ||
        // @ts-expect-error needs changes at runtime to fix the TS error
        this.props.endShape?.[shape]?.[prop] ||
        // @ts-expect-error needs changes at runtime to fix the TS error
        ArcherContainer.defaultProps.endShape[shape][prop]
      );
    };

    const shapeMap = {
      circle: () => {
        const radius = getProp('circle', 'radius');
        const strokeWidth = getProp('circle', 'strokeWidth');
        const strokeColor = getProp('circle', 'strokeColor');
        const fillColor = getProp('circle', 'fillColor');
        return {
          markerWidth: radius * 4,
          markerHeight: radius * 4,
          refX: radius * 2 + strokeWidth,
          refY: radius * 2,
          path: (
            <circle
              cx={radius * 2}
              cy={radius * 2}
              r={radius}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          ),
        };
      },
      arrow: () => {
        const strokeColor = style.strokeColor || this.props.strokeColor;
        const arrowLength =
          style.endShape?.arrow?.arrowLength ??
          this.props.endShape?.arrow?.arrowLength ??
          ArcherContainer.defaultProps.endShape.arrow.arrowLength;
        const arrowThickness =
          style.endShape?.arrow?.arrowThickness ||
          this.props.endShape?.arrow?.arrowThickness ||
          ArcherContainer.defaultProps.endShape.arrow.arrowThickness;
        const arrowPath = `M0,0 L0,${arrowThickness} L${arrowLength},${arrowThickness / 2} z`;
        return {
          markerWidth: arrowLength,
          markerHeight: arrowThickness,
          refX: 0,
          refY: arrowThickness / 2,
          path: <path d={arrowPath} fill={strokeColor} />,
        };
      },
    };
    return shapeMap[chosenEndShape]();
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
  _generateAllArrowMarkers = (): React.ReactElement<React.ComponentProps<'marker'>, 'marker'>[] => {
    return this._getSourceToTargets().map(({ source, target, style = {} }: SourceToTargetType) => {
      const { markerHeight, markerWidth, path, refX, refY } = this._buildShape(style);

      return (
        <marker
          id={this._getMarkerId(source, target)}
          key={this._getMarkerId(source, target)}
          markerWidth={markerWidth}
          markerHeight={markerHeight}
          refX={refX}
          refY={refY}
          orient="auto-start-reverse"
          markerUnits="strokeWidth"
        >
          {path}
        </marker>
      );
    });
  };
  _svgContainerStyle = (): Record<string, any> => ({
    ...defaultSvgContainerStyle,
    ...this.props.svgContainerStyle,
  });

  render() {
    const SvgArrows = this._computeArrows();

    let children: React.ReactNode | null | undefined;

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

          <div
            style={{
              height: '100%',
            }}
            ref={this._storeParent}
          >
            {children}
          </div>
        </div>
      </ArcherContainerContextProvider>
    );
  }
}
export default ArcherContainer;
