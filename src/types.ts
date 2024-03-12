export type ValidLineStyles = 'angle' | 'straight' | 'curve';

export type AnchorPositionType = 'top' | 'bottom' | 'left' | 'right' | 'middle';

export type RelationType = {
  targetId: string;
  targetAnchor: AnchorPositionType;
  sourceAnchor: AnchorPositionType;
  order?: number;
  label?: React.ReactNode | null | undefined;
  className?: string;
  style?: LineType;
};

export type EntityRelationType = {
  id: string;
  anchor: AnchorPositionType;
};

export type SourceToTargetType = {
  className?: string;
  source: EntityRelationType;
  target: EntityRelationType;
  order: number;
  label?: React.ReactNode | null | undefined;
  style?: LineType;
};

export type ArrowShapeType = {
  arrowLength?: number;
  arrowThickness?: number;
};

export type CircleShapeType = {
  radius?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
};

export type ShapeType = {
  arrow?: ArrowShapeType;
  circle?: CircleShapeType;
};

export type LineType = {
  startShape?: ShapeType;
  endShape?: ShapeType;
  strokeColor?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  noCurves?: boolean;
  enableStartMarker?: boolean;
  enableEndMarker?: boolean;
  lineStyle?: ValidLineStyles;
};

export type ValidShapeTypes = 'arrow' | 'circle';
