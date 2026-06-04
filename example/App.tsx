import React from 'react';
import FirstExample from './FirstExample';
import SecondExample from './SecondExample';
import ThirdExample from './ThirdExample';
import FourthExample from './FourthExample';
import FifthExample from './FifthExample';
import SixthExample from './SixthExample';
import SeventhExample from './SeventhExample';
import EighthExample from './EighthExample';
import NinthExample from './NinthExample';
import TenthExample from './TenthExample';
import EleventhExample from './EleventhExample';

const EXAMPLES = [
  { Component: FirstExample, name: 'Basic arrows' },
  { Component: SecondExample, name: 'Dynamic elements' },
  { Component: ThirdExample, name: 'Straight lines' },
  { Component: FourthExample, name: 'Anchor offsets' },
  { Component: FifthExample, name: 'Middle anchor' },
  { Component: SixthExample, name: 'Custom labels' },
  { Component: SeventhExample, name: 'Circle ends' },
  { Component: EighthExample, name: 'Start markers' },
  { Component: NinthExample, name: 'Styled relations' },
  { Component: TenthExample, name: 'Interactive' },
  { Component: EleventhExample, name: 'Drag & drop' },
] as const;

const getExample = (id: number) => EXAMPLES[id - 1] ?? EXAMPLES[1];

const App = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const exampleFromUrl = Number(urlParams.get('example'));
  const [exampleId, setExampleId] = React.useState(1);
  const { Component: Example } = getExample(exampleFromUrl || exampleId);
  if (exampleFromUrl) {
    return (
      <div className="app">
        <div className="panel">
          <Example />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">react-archer</h1>
        <p className="app__subtitle">
          Draw beautiful arrows between DOM elements in React — declaratively.
        </p>
        <div className="app__links">
          <a
            className="app__link app__link--primary"
            href="https://github.com/pierpo/react-archer"
            target="_blank"
            rel="noreferrer"
          >
            ★ GitHub
          </a>
          <a
            className="app__link app__link--ghost"
            href="https://www.npmjs.com/package/react-archer"
            target="_blank"
            rel="noreferrer"
          >
            npm
          </a>
        </div>
      </header>
      <div className="layout">
        <nav className="picker">
          {EXAMPLES.map(({ name }, index) => (
            <button
              key={name}
              onClick={() => setExampleId(index + 1)}
              className={`btn${exampleId === index + 1 ? ' btn--active' : ''}`}
            >
              <span className="btn__num">{index + 1}</span>
              {name}
            </button>
          ))}
        </nav>
        <div className="panel">
          <Example />
        </div>
      </div>
    </div>
  );
};

export default App;
