import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import CodeBlock from '@theme/CodeBlock';

import styles from './styles.module.css';

type LiveExampleProps = {
  /** The example component to render live. */
  component: React.ComponentType;
  /** The raw source of the example (imported via raw-loader). */
  source: string;
  /** Optional caption shown above the rendered example. */
  title?: string;
};

/**
 * Renders a react-archer example live, followed by its real source code.
 *
 * The same `example/*.tsx` file is used both for the live render and the code
 * snippet, so the docs can never drift from what actually runs.
 */
export default function LiveExample({ component: Component, source, title }: LiveExampleProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.stage}>
        {/* react-archer measures real DOM, so it only runs in the browser. */}
        <BrowserOnly fallback={<div className={styles.fallback}>Loading example…</div>}>
          {() => <Component />}
        </BrowserOnly>
      </div>
      <CodeBlock language="tsx" title={title}>
        {source.trim()}
      </CodeBlock>
    </div>
  );
}
