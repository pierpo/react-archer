// @noflow
import * as React from 'react';

export interface ShapeType {
  arrow?: {
    arrowLength?: number;
    arrowThickness?: number;
  };
  circle?: {
    radius?: number;
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
  };
}

export type ValidLineStyles = 'angle' | 'straight' | 'curve';

export interface ArcherContainerProps {
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

  /**
   * Customize the end shape of the line. Defaults to a traditional "arrow" (triangle) shape.
   */
  endShape?: ShapeType;

  /**
   * Set this to true of you want to render a marker at the start of the line
   */
  startMarker?: boolean;

  /**
   * Set this to false of you do not want to render a marker at the end of the line
   */
  endMarker?: boolean;

  /**
   * Define how the line is drawn, grid for angles, straight for direct line and curve for curves
   */

  lineStyle?: ValidLineStyles;

  /**
   * Set this to true if you want angles instead of curves
   */
  noCurves?: boolean;
}

export class ArcherContainer extends React.Component<ArcherContainerProps> {
  /**
   * Use this to recompute all the arrow positions. Useful if arrows do not properly rerender
   * after the viewport or some elements moved.
   */
  refreshScreen: () => void;
}

export interface LineStyle {
  strokeColor?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  startMarker?: boolean;
  endMarker?: boolean;
  noCurves?: boolean;
  endShape?: ShapeType;
  lineStyle?: ValidLineStyles;
}

export type AnchorPosition = 'top' | 'bottom' | 'left' | 'right' | 'middle';

export type ValidShapeTypes = 'arrow' | 'circle';

export interface Relation {
  targetId: string;
  targetAnchor: AnchorPosition;
  sourceAnchor: AnchorPosition;
  order?: number;
  label?: React.ReactNode;
  style?: LineStyle;
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
