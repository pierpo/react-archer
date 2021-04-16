declare type AnchorPositionType = 'top' | 'bottom' | 'left' | 'right' | 'middle';

declare type RelationType = {
  targetId: string,
  targetAnchor: AnchorPositionType,
  sourceAnchor: AnchorPositionType,
  label?: ?React$Node,
  style?: LineType,
};

declare type EntityRelationType = {
  id: string,
  anchor: AnchorPositionType,
};

declare type SourceToTargetType = {
  source: EntityRelationType,
  target: EntityRelationType,
  label?: ?React$Node,
  style?: LineType,
};

declare type ShapeType = {
  arrow?: {
    arrowLength?: number,
    arrowThickness?: number,
  },
  circle?: {
    radius?: number,
    fillColor?: string,
    strokeColor?: string,
    strokeWidth?: number,
  },
};

declare type LineType = {
  endShape?: ShapeType,
  strokeColor?: string,
  strokeWidth?: number,
  strokeDasharray?: string,
  noCurves?: boolean,
  startMarker?: boolean,
};

type ValidShapeTypes = 'arrow' | 'circle';
