import { ShapeType, ValidLineStyles, SourceToTargetType } from '../types';
import { ArcherContainerContextType } from './ArcherContainer.context';

type FunctionChild = (context: React.Context<ArcherContainerContextType | null>) => React.ReactNode;

export type ArcherContainerProps = {
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

  children?: React.ReactNode | FunctionChild;
};

export type ArcherContainerHandle = {
  /**
   * Use this to recompute all the arrow positions. Useful if arrows do not properly rerender
   * after the viewport or some elements moved.
   */
  refreshScreen: () => void;
  /** Only for internal testing purposes */
  arrowMarkerUniquePrefix: string;
};

export type SourceToTargetsArrayType = SourceToTargetType[];
