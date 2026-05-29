import React from 'react';
import { Property } from 'csstype';
import Vector2 from '../../geometry/Vector2';
import { getPointCoordinatesFromAnchorPosition } from '../../geometry/rectHelper';
import SvgArrow from '../../SvgArrow/SvgArrow';
import { SourceToTargetType } from '../../types';
import { createShapeObj, getMarkerId, getSourceToTargets } from '../ArcherContainer.helpers';
import { ArcherContainerProps, SourceToTargetsArrayType } from '../ArcherContainer.types';
import { ElementRects } from '../ArcherContainer.hooks';

interface CommonProps {
  startMarker: ArcherContainerProps['startMarker'];
  endMarker: ArcherContainerProps['endMarker'];
  endShape: NonNullable<ArcherContainerProps['endShape']>;
  strokeColor: NonNullable<ArcherContainerProps['strokeColor']>;
  strokeWidth: NonNullable<ArcherContainerProps['strokeWidth']>;
  strokeDasharray: ArcherContainerProps['strokeDasharray'];
  noCurves: ArcherContainerProps['noCurves'];
  lineStyle: ArcherContainerProps['lineStyle'];
  offset: ArcherContainerProps['offset'];
  uniqueId: string;
  rects: ElementRects;
  hitSlop?: number;
  cursor?: Property.Cursor;
}

const AdaptedArrow = (
  props: Omit<SourceToTargetType, 'order'> &
    CommonProps & {
      parentCoordinates: Vector2;
    },
) => {
  const style = props.style || {};
  const newStartMarker = style.startMarker || props.startMarker;
  const newEndMarker = style.endMarker ?? props.endMarker ?? true;

  const newEndShape = createShapeObj(style, props.endShape);

  const domAttributes = props.domAttributes;
  const cursor = props.cursor;
  const hitSlop = props.hitSlop;
  const newStrokeColor = style.strokeColor || props.strokeColor;
  const newStrokeWidth = style.strokeWidth || props.strokeWidth;
  const newStrokeDasharray = style.strokeDasharray || props.strokeDasharray;
  const newNoCurves = !!(style.noCurves || props.noCurves);
  const newLineStyle = style.lineStyle || props.lineStyle || (newNoCurves ? 'angle' : 'curve');
  const newOffset = props.offset || 0;
  const startingAnchorOrientation = props.source.anchor;

  const startingPoint = getPointCoordinatesFromAnchorPosition(
    props.source.anchor,
    props.parentCoordinates,
    props.rects[props.source.id],
  );

  const endingAnchorOrientation = props.target.anchor;

  const endingPoint = getPointCoordinatesFromAnchorPosition(
    props.target.anchor,
    props.parentCoordinates,
    props.rects[props.target.id],
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
      arrowMarkerId={getMarkerId(props.uniqueId, props.source, props.target)}
      lineStyle={newLineStyle}
      offset={newOffset}
      enableStartMarker={!!newStartMarker}
      disableEndMarker={!newEndMarker}
      endShape={newEndShape}
      domAttributes={domAttributes}
      hitSlop={hitSlop}
      cursor={cursor}
    />
  );
};

export const SvgArrows = (
  props: {
    parentCoordinates: Vector2 | null;
    sourceToTargetsMap: Record<string, SourceToTargetsArrayType>;
  } & CommonProps,
) => {
  const parentCoordinates = props.parentCoordinates;

  if (!parentCoordinates) {
    // This happens when the parent has not been measured yet
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
          domAttributes={currentRelation.domAttributes}
          hitSlop={currentRelation.hitSlop}
          cursor={currentRelation.cursor}
          startMarker={props.startMarker}
          endMarker={props.endMarker}
          endShape={props.endShape}
          strokeColor={props.strokeColor}
          strokeWidth={props.strokeWidth}
          strokeDasharray={props.strokeDasharray}
          noCurves={props.noCurves}
          lineStyle={props.lineStyle}
          offset={props.offset}
          parentCoordinates={parentCoordinates}
          rects={props.rects}
          uniqueId={props.uniqueId}
        />
      ))}
    </>
  );
};
