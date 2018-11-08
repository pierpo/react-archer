declare type AnchorPositionType = 'top' | 'bottom' | 'left' | 'right';

declare type IncompleteRelationNozzleType = {
  anchor: AnchorPositionType,
};

declare type RelationNozzleType = {
  anchor: AnchorPositionType,
  id: string,
};

declare type ArrowStyleType = {
  arrowLength: number,
  arrowThickness: number,
  strokeColor: string,
  strokeWidth: number,
};

declare type RelationType = {
  from: IncompleteRelationNozzleType,
  to: RelationNozzleType,
  label?: ?React$Node,
  style?: ArrowStyleType,
};

declare type CompleteRelationType = {
  from: RelationNozzleType,
  to: RelationNozzleType,
  label?: ?React$Node,
  style?: ArrowStyleType,
};
