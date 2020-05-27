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

  /**
   * A string representing an array of sizes
   * See https://www.w3schools.com/graphics/svg_stroking.asp
   */
  strokeDasharray?: string;

  /**
   * Set this to true if you want angles instead of curves
   */
  noCurves?: boolean;

  style?: React.CSSProperties;

  /**
   * Style of the SVG container element. Useful if you want to add a z-index to your SVG container to draw the arrows under your elements, for example.
   */
  svgContainerStyle?: React.CSSProperties;

  className?: string;

  /**
   * Optional number for space between element and start/end of stroke
   */
  offset?: number;
}

export class ArcherContainer extends React.Component<ArcherContainerProps> {
  /**
   * Use this to recompute all the arrow positions. Useful if arrows do not properly rerender
   * after the viewport or some elements moved.
   */
  refreshScreen: () => void;
}

export interface ArrowStyle {
  strokeColor?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  arrowLength?: number;
  arrowThickness?: number;
  noCurves?: boolean;
}

export type AnchorPosition = 'top' | 'bottom' | 'left' | 'right' | 'middle';

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
  relations?: Relation[];
  style?: React.CSSProperties;
  className?: string;
  label?: React.ReactNode;
}

export class ArcherElement extends React.Component<ArcherElementProps> {}
