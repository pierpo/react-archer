declare type ValidLineStyles = 'angle' | 'straight' | 'curve';

declare type AnchorPositionType = 'top' | 'bottom' | 'left' | 'right' | 'middle';

declare type RelationType = {
  targetId: string;
  targetAnchor: AnchorPositionType;
  sourceAnchor: AnchorPositionType;
  order?: number;
  label?: React.ReactNode | null | undefined;
  style?: LineType;
};

declare type EntityRelationType = {
  id: string;
  anchor: AnchorPositionType;
};

declare type SourceToTargetType = {
  source: EntityRelationType;
  target: EntityRelationType;
  order: number;
  label?: React.ReactNode | null | undefined;
  style?: LineType;
};

declare type ArrowShapeType = {
  arrowLength?: number;
  arrowThickness?: number;
};

declare type CircleShapeType = {
  radius?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
};

declare type ShapeType = {
  arrow?: ArrowShapeType;
  circle?: CircleShapeType;
};

declare type LineType = {
  endShape?: ShapeType;
  strokeColor?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  noCurves?: boolean;
  startMarker?: boolean;
  endMarker?: boolean;
  lineStyle?: string;
};

type ValidShapeTypes = 'arrow' | 'circle';
