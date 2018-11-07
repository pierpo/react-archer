declare type AnchorPositionType = 'top' | 'bottom' | 'left' | 'right';

declare type RelationType = {
  from: {
    anchor: AnchorPositionType,
  },
  to: {
    anchor: AnchorPositionType,
    id: string,
  },
  label?: ?React$Node,
};

declare type CompleteRelationType = {
  from: {
    anchor: AnchorPositionType,
    id: string,
  },
  to: {
    anchor: AnchorPositionType,
    id: string,
  },
  label?: ?React$Node,
};
