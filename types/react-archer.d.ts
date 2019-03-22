import * as React from 'react';

export interface ArcherContainerProps {
  /**
   * A size in px
   */
  arrowLength?: number;
  /**
   * A size in px
   */
  arrowThickness?: number;
  /**
   * A color string
   *
   * @example '#ff0000'
   */
  strokeColor?: string;
  /**
   * A size in px
   */
  strokeWidth?: number;

  style?: React.CSSProperties;

  svgContainerStyle?: React.CSSProperties;

  className?: string;
}

export const ArcherContainer: React.ComponentType<ArcherContainerProps>;

export interface ArrowStyle {
  strokeColor?: string;
  strokeWidth?: number;
  arrowLength?: number;
  arrowThickness?: number;
}

export type AnchorPosition = 'top' | 'bottom' | 'left' | 'right';

export interface Relation {
  targetId: string;
  targetAnchor: AnchorPosition;
  sourceAnchor: AnchorPosition;
  label?: React.ReactNode;
  style?: ArrowStyle;
}

export interface ArcherElementProps {
  /**
   * The id that will identify the Archer Element. Should only contain alphanumeric characters and standard characters that you can find in HTML ids.
   */
  id: string;
  relations?: Array<Relation>;
  style?: React.CSSProperties;
  className?: string;
  label?: React.ReactNode;
}

export const ArcherElement: React.ComponentType<ArcherElementProps>;
