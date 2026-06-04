import React from 'react';
import styles from './Box.module.css';

type BoxProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * The styled node used throughout the examples. It owns its own styling (via a
 * co-located CSS Module), so dropping it into any host — the Vite demo app or
 * the Docusaurus docs — brings the look with it, with no global stylesheet.
 *
 * `ArcherElement` clones its child and attaches a `ref`, so `Box` forwards the
 * ref to the underlying `div` and spreads through any extra props (style, event
 * handlers, etc.).
 */
const Box = React.forwardRef<HTMLDivElement, BoxProps>(({ className, ...rest }, ref) => (
  <div ref={ref} className={className ? `${styles.box} ${className}` : styles.box} {...rest} />
));

Box.displayName = 'Box';

export default Box;
