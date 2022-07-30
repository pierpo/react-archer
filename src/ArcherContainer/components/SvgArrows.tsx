import React from 'react';
import Vector2 from '../../geometry/Vector2';
import {
  getPointCoordinatesFromAnchorPosition,
  getPointFromElement,
} from '../../geometry/rectHelper';
import SvgArrow from '../../SvgArrow/SvgArrow';
import { SourceToTargetType } from '../../types';
import { createShapeObj, getMarkerId, getSourceToTargets } from '../ArcherContainer.helpers';
import { ArcherContainerProps, SourceToTargetsArrayType } from '../ArcherContainer.types';

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
  refs: Record<string, HTMLElement>;
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
    return null;
  }

  if (!endingPoint) {
    return null;
  }

  return (
    <SvgArrow
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
          label={currentRelation.label}
          style={currentRelation.style || {}}
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
          refs={props.refs}
          uniqueId={props.uniqueId}
        />
      ))}
    </>
  );
};
