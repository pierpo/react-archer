declare type AnchorPositionType = 'top' | 'bottom' | 'left' | 'right';

declare type RelationType = {
  targetId: string,
  targetAnchor: AnchorPositionType,
  sourceAnchor: AnchorPositionType,
  label?: ?React$Node,
  style?: ArrowStyleType,
};

declare type EntityRelationType = {
  id: string,
  anchor: AnchorPositionType,
};

declare type SourceToTargetType = {
  source: EntityRelationType,
  target: EntityRelationType,
  label?: ?React$Node,
  style?: ArrowStyleType,
};

declare type ArrowStyleType = {
  arrowLength: number,
  arrowThickness: number,
  strokeColor: string,
  strokeWidth: number,
};