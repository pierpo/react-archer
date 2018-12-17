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
  className?: string,
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

export function mergeTransitions(
  allCurrentRelations: Array<CompleteRelationType>,
  newRelationsOfElement: Array<CompleteRelationType>,
  oldRelationsOfElement: Array<CompleteRelationType>,
): Array<CompleteRelationType> {
  const allCurrentRelationsWithoutOldRelationsOfElement = allCurrentRelations.filter(
    relation => {
      const existsInOld = oldRelationsOfElement.find(oldRelation =>
        oldRelation.from.id === relation.from.id
      );

      return !existsInOld;
    },
  );

  return [
    ...allCurrentRelationsWithoutOldRelationsOfElement,
    ...newRelationsOfElement,
  ];
}

export type ArcherContainerContextType = {
  registerChild?: (string, HTMLElement) => void,
  registerTransition?: (
    string,
    Array<RelationType>,
    Array<RelationType>,
  ) => void,
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
      fromTo: [],
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

  registerTransition = (
    fromElementId: string,
    newRelationsOfElement: Array<RelationType>,
    oldRelationsOfElement: Array<RelationType>,
  ): void => {
    const enrichedNewFromToObjects = this.relationsWithFromId(fromElementId, newRelationsOfElement);
    const enrichedOldFromToObjects = this.relationsWithFromId(fromElementId, oldRelationsOfElement);

    this.setState((currentState: State) => ({
      fromTo: mergeTransitions(
        currentState.fromTo,
        enrichedNewFromToObjects,
        enrichedOldFromToObjects,
      ),
    }));
  };

  relationsWithFromId = (fromElementId: string, relations: Array<RelationType>): Array<CompleteRelationType> => {
    // $FlowFixMe
    return relations.map(relation => ({
      ...relation,
      from: { ...relation.from, id: fromElementId },
    }));
  };

  unregisterTransitions = (elementId: string): void => {
    const { fromTo } = this.state;
    const newFromTo = fromTo.filter(
      sd => sd.from.id !== elementId,
    );
    this.setState(() => ({ fromTo: newFromTo }));
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

  computeArrows = (): React$Node => {
    const parentCoordinates = this.getParentCoordinates();

    return this.state.fromTo.map(({ from, to, label, style }: CompleteRelationType) => {
      const strokeColor =
        (style && style.strokeColor) || this.props.strokeColor;

      const arrowLength =
        (style && style.arrowLength) || this.props.arrowLength;

      const strokeWidth =
        (style && style.strokeWidth) || this.props.strokeWidth;

      const startingAnchor = from.anchor;
      const startingPoint = this.getPointCoordinatesFromAnchorPosition(
        from.anchor,
        from.id,
        parentCoordinates,
      );

      if (Array.isArray(to)) {
        return (
          <React.Fragment key={JSON.stringify({ from, to })}>
            {to.map((relationNozzle: RelationNozzleType) => {
              const endingAnchor = relationNozzle.anchor;
              const endingPoint = this.getPointCoordinatesFromAnchorPosition(
                relationNozzle.anchor,
                relationNozzle.id,
                parentCoordinates,
              );

              return (
                <SvgArrow
                  key={JSON.stringify({ from, relationNozzle })}
                  startingPoint={startingPoint}
                  startingAnchor={startingAnchor}
                  endingPoint={endingPoint}
                  endingAnchor={endingAnchor}
                  strokeColor={strokeColor}
                  arrowLength={arrowLength}
                  strokeWidth={strokeWidth}
                  arrowLabel={label}
                  arrowMarkerId={this.getMarkerId(from, relationNozzle)}
                />
              );
            })}
          </React.Fragment>
        );
      }

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
          strokeColor={strokeColor}
          arrowLength={arrowLength}
          strokeWidth={strokeWidth}
          arrowLabel={label}
          arrowMarkerId={this.getMarkerId(from, to)}
        />
      );
    });
  };

  /** Generates an id for an arrow marker
   * Useful to have one marker per arrow so that each arrow
   * can have a different color!
   * */
  getMarkerId = (from: RelationNozzleType, to: RelationNozzleType): string => {
    return `${this.arrowMarkerUniquePrefix}${from.id}${to.id}`;
  };

  /** Generates all the markers
   * We want one marker per arrow so that each arrow can have
   * a different color or size
   * */
  generateAllArrowMarkers = (): React$Node => {
    return this.state.fromTo.map(({ from, to, style }: CompleteRelationType) => {

      const strokeColor =
        (style && style.strokeColor) || this.props.strokeColor;

      const arrowLength =
        (style && style.arrowLength) || this.props.arrowLength;

      const arrowThickness =
        (style && style.arrowThickness) || this.props.arrowThickness;

      const arrowPath = `M0,0 L0,${arrowThickness} L${arrowLength -
        1},${arrowThickness / 2} z`;
      
      if (Array.isArray(to)) {
        return (
          <React.Fragment key={JSON.stringify({ from, to })}>
            {to.map((relationNozzle: RelationNozzleType) => (
              <marker
                id={this.getMarkerId(from, relationNozzle)}
                key={this.getMarkerId(from, relationNozzle)}
                markerWidth={arrowLength}
                markerHeight={arrowThickness}
                refX="0"
                refY={arrowThickness / 2}
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d={arrowPath} fill={strokeColor} />
              </marker>
            ))}
          </React.Fragment>
        );
      }

      return (
        <marker
          id={this.getMarkerId(from, to)}
          key={this.getMarkerId(from, to)}
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

  render() {
    const SvgArrows = this.computeArrows();

    return (
      <ArcherContainerContextProvider
        value={{
          registerTransition: this.registerTransition,
          unregisterTransitions: this.unregisterTransitions,
          registerChild: this.registerChild,
          unregisterChild: this.unregisterChild,
        }}
      >
        <div
          style={{ ...this.props.style, position: 'relative' }}
          className={this.props.className}
        >
          <svg style={svgContainerStyle}>
            <defs>{this.generateAllArrowMarkers()}</defs>
            {SvgArrows}
          </svg>

          <div ref={this.storeParent}>{this.props.children}</div>
        </div>
      </ArcherContainerContextProvider>
    );
  }
}

export default ArcherContainer;
