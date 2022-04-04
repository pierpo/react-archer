import React from 'react';
import Point from '../../geometry/Point';
import {
  getPointCoordinatesFromAnchorPosition,
  getPointFromElement,
} from '../../geometry/rectHelper';
import SvgArrow from '../../SvgArrow';
import { SourceToTargetType } from '../../types';
import { createShapeObj, getMarkerId, getSourceToTargets } from '../ArcherContainer.helpers';
import { ArcherContainerProps, SourceToTargetsArrayType } from '../ArcherContainer.types';

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

export const SvgArrows = ({
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
