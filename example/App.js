import React from 'react';
import FirstExample from './FirstExample';
import SecondExample from './SecondExample';
import ThirdExample from './ThirdExample';
import FourthExample from './FourthExample';
import FifthExample from './FifthExample';
import SixthExample from './SixthExample';
import SeventhExample from './SeventhExample';

const getExample = id => {
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
    default:
      return SecondExample;
  }
};

const App = () => {
  const [exampleId, setExampleId] = React.useState(1);
  const Example = getExample(exampleId);
  return (
    <div>
      <div>
        <h2>Example {exampleId}</h2>
        <p>Choose an example:</p>
        <button onClick={() => setExampleId(1)}>Example 1</button>
        <button onClick={() => setExampleId(2)}>Example 2</button>
        <button onClick={() => setExampleId(3)}>Example 3</button>
        <button onClick={() => setExampleId(4)}>Example 4</button>
        <button onClick={() => setExampleId(5)}>Example 5</button>
        <button onClick={() => setExampleId(6)}>Example 6</button>
        <button onClick={() => setExampleId(7)}>Example 7</button>
      </div>
      <hr />
      <Example />
    </div>
  );
};

export default App;
