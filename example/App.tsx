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

const getExample = (id: number) => {
  switch (id) {
    case 1:
      return FirstExample;

    case 2:
      return SecondExample;

    case 3:
      return ThirdExample;

    case 4:
      return FourthExample;

    case 5:
      return FifthExample;

    case 6:
      return SixthExample;

    case 7:
      return SeventhExample;

    case 8:
      return EighthExample;

    case 9:
      return NinthExample;

    case 10:
      return TenthExample;

    default:
      return SecondExample;
  }
};

const App = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const exampleFromUrl = Number(urlParams.get('example'));
  const [exampleId, setExampleId] = React.useState(1);
  const Example = getExample(exampleFromUrl || exampleId);
  return (
    <div className="app">
      {!exampleFromUrl && (
        <>
          <header className="app__header">
            <h1 className="app__title">react-archer</h1>
            <p className="app__subtitle">Draw arrows between DOM elements in React</p>
          </header>
          <nav className="picker">
            {[...Array(10).keys()].map((value) => (
              <button
                key={value}
                onClick={() => setExampleId(value + 1)}
                className={`btn${exampleId === value + 1 ? ' btn--active' : ''}`}
              >
                {`Example ${value + 1}`}
              </button>
            ))}
          </nav>
        </>
      )}
      <div className="panel">
        <Example />
      </div>
    </div>
  );
};

export default App;
