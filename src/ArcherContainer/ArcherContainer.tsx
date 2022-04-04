import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import Point from '../geometry/Point';
import SvgArrow from '../SvgArrow';
import {
  ArrowShapeType,
  CircleShapeType,
  EntityRelationType,
  LineType,
  ShapeType,
  SourceToTargetType,
  ValidShapeTypes,
} from '../types';
import { getPointCoordinatesFromAnchorPosition, getPointFromElement } from '../geometry/rectHelper';
import { ArcherContainerContext, ArcherContainerContextProvider } from './ArcherContainer.context';
import {
  SourceToTargetsArrayType,
  ArcherContainerProps,
  ArcherContainerHandle,
} from './ArcherContainer.types';

const defaultSvgContainerStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  pointerEvents: 'none',
};

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

const getSourceToTargets = (
  sourceToTargetsMap: Record<string, SourceToTargetsArrayType>,
): SourceToTargetType[] => {
  // Object.values is unavailable in IE11
  const jaggedSourceToTargets = Object.keys(sourceToTargetsMap).map(
    (key: string) => sourceToTargetsMap[key],
  );
  // Flatten
  return ([] as SourceToTargetType[]).concat
    .apply([], jaggedSourceToTargets)
    .sort((a, b) => a.order - b.order);
};

const createShapeObj = (style: LineType, endShape: ShapeType) => {
  const chosenEndShape = getEndShapeFromStyle(style);
  const shapeObjMap = {
    arrow: () => ({
      arrow: {
        ...endShape?.arrow,
        ...style.endShape?.arrow,
      },
    }),
    circle: () => ({
      circle: {
        ...endShape?.circle,
        ...style.endShape?.circle,
      },
    }),
  };
  return shapeObjMap[chosenEndShape]();
};

/** Generates an id for an arrow marker
 * Useful to have one marker per arrow so that each arrow
 * can have a different color!
 * */
const getMarkerId = (
  uniqueId: string,
  source: EntityRelationType,
  target: EntityRelationType,
): string => {
  return `${uniqueId}${source.id}${target.id}`;
};

const endShapeDefaultProp = {
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
};

const AdaptedArrow = ({
  source,
  target,
  label,
  style = {},
  uniqueId,
  startMarker,
  endMarker,
  endShape,
  strokeColor,
  strokeWidth,
  strokeDasharray,
  noCurves,
  lineStyle,
  offset,
  parentCoordinates,
  refs,
}: // TODO quite a tedious type, should be simplified
Omit<SourceToTargetType, 'order'> & {
  startMarker: ArcherContainerProps['startMarker'];
  endMarker: ArcherContainerProps['endMarker'];
  endShape: NonNullable<ArcherContainerProps['endShape']>;
  strokeColor: NonNullable<ArcherContainerProps['strokeColor']>;
  strokeWidth: NonNullable<ArcherContainerProps['strokeWidth']>;
  strokeDasharray: ArcherContainerProps['strokeDasharray'];
  noCurves: ArcherContainerProps['noCurves'];
  lineStyle: ArcherContainerProps['lineStyle'];
  offset: ArcherContainerProps['offset'];
} & {
  uniqueId: string;
  parentCoordinates: Point;
  refs: Record<string, HTMLElement>;
}) => {
  const newStartMarker = style.startMarker || startMarker;
  const newEndMarker = style.endMarker ?? endMarker ?? true;

  const newEndShape = createShapeObj(style, endShape);

  const newStrokeColor = style.strokeColor || strokeColor;
  const newStrokeWidth = style.strokeWidth || strokeWidth;
  const newStrokeDasharray = style.strokeDasharray || strokeDasharray;
  const newNoCurves = !!(style.noCurves || noCurves);
  const newLineStyle = style.lineStyle || lineStyle || (newNoCurves ? 'angle' : 'curve');
  const newOffset = offset || 0;
  const startingAnchorOrientation = source.anchor;

  const startingPoint = getPointCoordinatesFromAnchorPosition(
    source.anchor,
    source.id,
    parentCoordinates,
    refs,
  );

  const endingAnchorOrientation = target.anchor;

  const endingPoint = getPointCoordinatesFromAnchorPosition(
    target.anchor,
    target.id,
    parentCoordinates,
    refs,
  );

  return (
    <SvgArrow
      startingPoint={startingPoint}
      startingAnchorOrientation={startingAnchorOrientation}
      endingPoint={endingPoint}
      endingAnchorOrientation={endingAnchorOrientation}
      strokeColor={newStrokeColor}
      strokeWidth={newStrokeWidth}
      strokeDasharray={newStrokeDasharray}
      arrowLabel={label}
      arrowMarkerId={getMarkerId(uniqueId, source, target)}
      lineStyle={newLineStyle}
      offset={newOffset}
      enableStartMarker={!!newStartMarker}
      disableEndMarker={!newEndMarker}
      endShape={newEndShape}
    />
  );
};

const SvgArrows = ({
  parentCurrent,
  sourceToTargetsMap,
  startMarker,
  endMarker,
  endShape,
  strokeColor,
  strokeWidth,
  strokeDasharray,
  noCurves,
  lineStyle,
  offset,
  refs,
  uniqueId,
}: // TODO simplify the type
{
  parentCurrent: HTMLDivElement | null | undefined;
  sourceToTargetsMap: Record<string, SourceToTargetsArrayType>;
  startMarker: ArcherContainerProps['startMarker'];
  endMarker: ArcherContainerProps['endMarker'];
  endShape: NonNullable<ArcherContainerProps['endShape']>;
  strokeColor: NonNullable<ArcherContainerProps['strokeColor']>;
  strokeWidth: NonNullable<ArcherContainerProps['strokeWidth']>;
  strokeDasharray: ArcherContainerProps['strokeDasharray'];
  noCurves: ArcherContainerProps['noCurves'];
  lineStyle: ArcherContainerProps['lineStyle'];
  offset: ArcherContainerProps['offset'];
} & {
  uniqueId: string;
  refs: Record<string, HTMLElement>;
}) => {
  const parentCoordinates = getPointFromElement(parentCurrent);

  return (
    <>
      {getSourceToTargets(sourceToTargetsMap).map((currentRelation) => (
        <AdaptedArrow
          key={JSON.stringify({
            source: currentRelation.source,
            target: currentRelation.target,
          })}
          source={currentRelation.source}
          target={currentRelation.target}
          label={currentRelation.label}
          style={currentRelation.style}
          startMarker={startMarker}
          endMarker={endMarker}
          endShape={endShape}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          noCurves={noCurves}
          lineStyle={lineStyle}
          offset={offset}
          parentCoordinates={parentCoordinates}
          refs={refs}
          uniqueId={uniqueId}
        />
      ))}
    </>
  );
};

export const ArcherContainer = React.forwardRef<ArcherContainerHandle, ArcherContainerProps>(
  (
    {
      endShape = endShapeDefaultProp,
      strokeColor = '#f00',
      strokeWidth = 2,
      svgContainerStyle = {},
      noCurves,
      children,
      className,
      endMarker,
      lineStyle,
      offset,
      startMarker,
      strokeDasharray,
      style,
    }: ArcherContainerProps,
    archerContainerRef,
  ) => {
    const [refs, setRefs] = useState<Record<string, HTMLElement>>({});
    const [sourceToTargetsMap, setSourceToTargetsMap] = useState<
      Record<string, SourceToTargetsArrayType>
    >({});
    const observer = useRef<ResizeObserver>(
      new ResizeObserver(() => {
        refreshScreen();
      }),
    ).current;

    const parent = useRef<HTMLDivElement>(null);

    const [, updateState] = React.useState<{}>();

    const uniqueId = useRef<string>(`arrow${Math.random().toString().slice(2)}`).current;

    useImperativeHandle(
      archerContainerRef,
      (): ArcherContainerHandle => ({
        refreshScreen,
        arrowMarkerUniquePrefix: uniqueId,
      }),
    );

    /**
     * Use this to recompute all the arrow positions. Useful if arrows do not properly rerender
     * after the viewport or some elements moved.
     */
    const refreshScreen = React.useCallback(() => updateState({}), []);

    const _registerTransitions = useCallback(
      (elementId: string, newSourceToTargets: SourceToTargetType[]): void => {
        setSourceToTargetsMap((previousValue) => ({
          ...previousValue,
          [elementId]: newSourceToTargets,
        }));
      },
      [],
    );

    const _unregisterTransitions = useCallback((elementId: string): void => {
      setSourceToTargetsMap((previousValue) => {
        const sourceToTargetsMapCopy = { ...previousValue };
        delete sourceToTargetsMapCopy[elementId];
        return sourceToTargetsMapCopy;
      });
    }, []);

    const _registerChild = useCallback(
      (id: string, ref: HTMLElement): void => {
        if (!refs[id]) {
          observer.observe(ref);
          setRefs((currentRefs) => ({
            ...currentRefs,
            [id]: ref,
          }));
        }
      },
      [refs],
    );

    const _unregisterChild = useCallback((id: string): void => {
      setRefs((currentRefs) => {
        if (currentRefs[id]) {
          observer.unobserve(currentRefs[id]);
        }

        const newRefs = { ...currentRefs };
        delete newRefs[id];
        return newRefs;
      });
    }, []);

    const _buildShape = (
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
          endShape?.[shape]?.[prop] ||
          // @ts-expect-error needs changes at runtime to fix the TS error
          endShapeDefaultProp[shape][prop]
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
          const newStrokeColor = style.strokeColor || strokeColor;
          const newArrowLength =
            style.endShape?.arrow?.arrowLength ??
            endShape?.arrow?.arrowLength ??
            endShapeDefaultProp.arrow.arrowLength;
          const newArrowThickness =
            style.endShape?.arrow?.arrowThickness ||
            endShape?.arrow?.arrowThickness ||
            endShapeDefaultProp.arrow.arrowThickness;
          const arrowPath = `M0,0 L0,${newArrowThickness} L${newArrowLength},${
            newArrowThickness / 2
          } z`;
          return {
            markerWidth: newArrowLength,
            markerHeight: newArrowThickness,
            refX: 0,
            refY: newArrowThickness / 2,
            path: <path d={arrowPath} fill={newStrokeColor} />,
          };
        },
      };
      return shapeMap[chosenEndShape]();
    };

    /** Generates all the markers
     * We want one marker per arrow so that each arrow can have
     * a different color or size
     * */
    const _generateAllArrowMarkers = (): React.ReactElement<
      React.ComponentProps<'marker'>,
      'marker'
    >[] => {
      return getSourceToTargets(sourceToTargetsMap).map(
        ({ source, target, style = {} }: SourceToTargetType) => {
          const { markerHeight, markerWidth, path, refX, refY } = _buildShape(style);

          return (
            <marker
              id={getMarkerId(uniqueId, source, target)}
              key={getMarkerId(uniqueId, source, target)}
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
        },
      );
    };

    const _svgContainerStyle = useMemo(
      (): Record<string, any> => ({
        ...defaultSvgContainerStyle,
        ...svgContainerStyle,
      }),
      [defaultSvgContainerStyle, svgContainerStyle],
    );

    let newChildren: React.ReactNode | null | undefined;

    if (typeof children === 'function') {
      newChildren = children(ArcherContainerContext);
    } else {
      newChildren = children;
    }

    // Subscribe/unsubscribe to the resize window event
    useEffect(() => {
      if (window) window.addEventListener('resize', refreshScreen);

      return () => {
        if (window) window.removeEventListener('resize', refreshScreen);
      };
    }, [refreshScreen]);

    // Subscribe/unsubscribe to the DOM observer
    useEffect(() => {
      Object.keys(refs).map((elementKey) => {
        observer.observe(refs[elementKey]);
      });

      return () => {
        Object.keys(refs).map((elementKey) => {
          observer.unobserve(refs[elementKey]);
        });
      };
    }, [refs]);

    const contextValue = useMemo(
      () => ({
        registerTransitions: _registerTransitions,
        unregisterTransitions: _unregisterTransitions,
        registerChild: _registerChild,
        unregisterChild: _unregisterChild,
      }),
      [_registerTransitions, _unregisterTransitions, _registerChild, _unregisterChild],
    );

    return (
      <ArcherContainerContextProvider value={contextValue}>
        <div style={{ ...style, position: 'relative' }} className={className}>
          <svg style={_svgContainerStyle}>
            <defs>{_generateAllArrowMarkers()}</defs>
            <SvgArrows
              startMarker={startMarker}
              endMarker={endMarker}
              endShape={endShape}
              strokeColor={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              noCurves={noCurves}
              lineStyle={lineStyle}
              offset={offset}
              parentCurrent={parent.current}
              refs={refs}
              uniqueId={uniqueId}
              sourceToTargetsMap={sourceToTargetsMap}
            />
          </svg>

          <div
            style={{
              height: '100%',
            }}
            ref={parent}
          >
            {newChildren}
          </div>
        </div>
      </ArcherContainerContextProvider>
    );
  },
);

export default ArcherContainer;
