import React from 'react';
import SvgArrow from '../../SvgArrow/SvgArrow';
import Vector2 from '../../geometry/Vector2';
import {
  getPointCoordinatesFromAnchorPosition,
  getPointFromElement,
} from '../../geometry/rectHelper';
import { SourceToTargetType } from '../../types';
import { createShapeObj, getMarkerId, getSourceToTargets } from '../ArcherContainer.helpers';
import { ArcherContainerProps, SourceToTargetsArrayType } from '../ArcherContainer.types';

interface CommonProps {
  enableStartMarker: ArcherContainerProps['enableStartMarker'];
  enableEndMarker: ArcherContainerProps['enableEndMarker'];
  startShape: NonNullable<ArcherContainerProps['startShape']>;
  endShape: NonNullable<ArcherContainerProps['endShape']>;
  strokeColor: NonNullable<ArcherContainerProps['strokeColor']>;
  strokeWidth: NonNullable<ArcherContainerProps['strokeWidth']>;
  strokeDasharray: ArcherContainerProps['strokeDasharray'];
  noCurves: ArcherContainerProps['noCurves'];
  lineStyle: ArcherContainerProps['lineStyle'];
  offset: ArcherContainerProps['offset'];
  uniqueId: string;
  refs: Record<string, HTMLElement>;
}

const AdaptedArrow = (
  props: Omit<SourceToTargetType, 'order'> &
    CommonProps & {
      parentCoordinates: Vector2;
    },
) => {
  const style = props.style || {};
  const enableStartMarker = style.enableStartMarker ?? props.enableStartMarker ?? false;
  const enableEndMarker = style.enableEndMarker ?? props.enableEndMarker ?? true;

  const newStartShape = createShapeObj(style, props.startShape, true);
  const newEndShape = createShapeObj(style, props.endShape, false);

  const newStrokeColor = style.strokeColor || props.strokeColor;
  const newStrokeWidth = style.strokeWidth || props.strokeWidth;
  const newStrokeDasharray = style.strokeDasharray || props.strokeDasharray;
  const newNoCurves = !!(style.noCurves || props.noCurves);
  const newLineStyle = style.lineStyle || props.lineStyle || (newNoCurves ? 'angle' : 'curve');
  const newOffset = props.offset || 0;
  const startingAnchorOrientation = props.source.anchor;

  const startingPoint = getPointCoordinatesFromAnchorPosition(
    props.source.anchor,
    props.source.id,
    props.parentCoordinates,
    props.refs,
  );

  const endingAnchorOrientation = props.target.anchor;

  const endingPoint = getPointCoordinatesFromAnchorPosition(
    props.target.anchor,
    props.target.id,
    props.parentCoordinates,
    props.refs,
  );

  if (!startingPoint) {
    console.warn('[React Archer] Could not find starting point of element! Not drawing the arrow.');
    return null;
  }

  if (!endingPoint) {
    console.warn('[React Archer] Could not find target element! Not drawing the arrow.');
    return null;
  }

  return (
    <SvgArrow
      className={props.className}
      startingPoint={startingPoint}
      startingAnchorOrientation={startingAnchorOrientation}
      endingPoint={endingPoint}
      endingAnchorOrientation={endingAnchorOrientation}
      strokeColor={newStrokeColor}
      strokeWidth={newStrokeWidth}
      strokeDasharray={newStrokeDasharray}
      arrowLabel={props.label}
      startArrowMarkerId={getMarkerId(props.uniqueId, props.source, props.target, true)}
      endArrowMarkerId={getMarkerId(props.uniqueId, props.source, props.target, false)}
      lineStyle={newLineStyle}
      offset={newOffset}
      enableStartMarker={enableStartMarker}
      enableEndMarker={enableEndMarker}
      startShape={newStartShape}
      endShape={newEndShape}
    />
  );
};

export const SvgArrows = (
  props: {
    parentCurrent: HTMLDivElement | null | undefined;
    sourceToTargetsMap: Record<string, SourceToTargetsArrayType>;
  } & CommonProps,
) => {
  const parentCoordinates = getPointFromElement(props.parentCurrent);

  if (!parentCoordinates) {
    // This happens when parent ref is not ready yet
    return null;
  }

  return (
    <>
      {getSourceToTargets(props.sourceToTargetsMap).map((currentRelation) => (
        <AdaptedArrow
          key={JSON.stringify({
            source: currentRelation.source,
            target: currentRelation.target,
          })}
          source={currentRelation.source}
          target={currentRelation.target}
          className={currentRelation.className}
          label={currentRelation.label}
          style={currentRelation.style || {}}
          enableStartMarker={props.enableStartMarker}
          enableEndMarker={props.enableEndMarker}
          startShape={props.startShape}
          endShape={props.endShape}
          strokeColor={props.strokeColor}
          strokeWidth={props.strokeWidth}
          strokeDasharray={props.strokeDasharray}
          noCurves={props.noCurves}
          lineStyle={props.lineStyle}
          offset={props.offset}
          parentCoordinates={parentCoordinates}
          refs={props.refs}
          uniqueId={props.uniqueId}
        />
      ))}
    </>
  );
};
