import React, { useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { SourceToTargetType } from '../types';
import { ArcherContainerContext, ArcherContainerContextProvider } from './ArcherContainer.context';
import {
  SourceToTargetsArrayType,
  ArcherContainerProps,
  ArcherContainerHandle,
} from './ArcherContainer.types';
import { SvgArrows } from './components/SvgArrows';
import { endShapeDefaultProp } from './ArcherContainer.constants';
import { ArrowMarkers } from './components/Markers';
import { useObserveElements, useResizeListener } from './ArcherContainer.hooks';

const defaultSvgContainerStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  pointerEvents: 'none',
};

const ArcherContainer = React.forwardRef<ArcherContainerHandle, ArcherContainerProps>(
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

    useResizeListener(refreshScreen);

    useObserveElements(refs, observer);

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
            <defs>
              <ArrowMarkers
                endShape={endShape}
                sourceToTargetsMap={sourceToTargetsMap}
                strokeColor={strokeColor}
                uniqueId={uniqueId}
              />
            </defs>
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
