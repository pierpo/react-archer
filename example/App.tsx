import React from 'react';
import BasicArrows from './BasicArrows';
import DynamicElements from './DynamicElements';
import AngleLines from './AngleLines';
import StraightLines from './StraightLines';
import AnchorOffsets from './AnchorOffsets';
import MiddleAnchor from './MiddleAnchor';
import CustomLabels from './CustomLabels';
import CircleEnds from './CircleEnds';
import StartMarkers from './StartMarkers';
import StyledRelations from './StyledRelations';
import Interactive from './Interactive';
import DragAndDrop from './DragAndDrop';

const EXAMPLES = [
  { slug: 'basic-arrows', name: 'Basic arrows', Component: BasicArrows },
  { slug: 'dynamic-elements', name: 'Dynamic elements', Component: DynamicElements },
  { slug: 'angle-lines', name: 'Angle lines', Component: AngleLines },
  { slug: 'straight-lines', name: 'Straight lines', Component: StraightLines },
  { slug: 'anchor-offsets', name: 'Anchor offsets', Component: AnchorOffsets },
  { slug: 'middle-anchor', name: 'Middle anchor', Component: MiddleAnchor },
  { slug: 'custom-labels', name: 'Custom labels', Component: CustomLabels },
  { slug: 'circle-ends', name: 'Circle ends', Component: CircleEnds },
  { slug: 'start-markers', name: 'Start markers', Component: StartMarkers },
  { slug: 'styled-relations', name: 'Styled relations', Component: StyledRelations },
  { slug: 'interactive', name: 'Interactive', Component: Interactive },
  { slug: 'drag-and-drop', name: 'Drag & drop', Component: DragAndDrop },
] as const;

const App = () => {
  const slugFromUrl = new URLSearchParams(window.location.search).get('example');
  const exampleFromUrl = EXAMPLES.find((example) => example.slug === slugFromUrl);
  const [selectedSlug, setSelectedSlug] = React.useState<(typeof EXAMPLES)[number]['slug']>(
    EXAMPLES[0].slug,
  );

  // Single-example mode (used by the e2e tests): render only the example.
  if (exampleFromUrl) {
    const { Component } = exampleFromUrl;
    return (
      <div className="app">
        <div className="panel">
          <Component />
        </div>
      </div>
    );
  }

  const { Component } = EXAMPLES.find((example) => example.slug === selectedSlug) ?? EXAMPLES[0];

  return (
    <div className="app">
      <div className="layout">
        <nav className="picker">
          {EXAMPLES.map(({ slug, name }, index) => (
            <button
              key={slug}
              onClick={() => setSelectedSlug(slug)}
              className={`btn${selectedSlug === slug ? ' btn--active' : ''}`}
            >
              <span className="btn__num">{index + 1}</span>
              {name}
            </button>
          ))}
        </nav>
        <div className="panel">
          <Component />
        </div>
      </div>
    </div>
  );
};

export default App;
