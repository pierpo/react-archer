import React from 'react';
import FirstExample from './FirstExample';
import SecondExample from './SecondExample';
import ThirdExample from './ThirdExample';
import FourthExample from './FourthExample';

class App extends React.Component {
  state = { currentExample: 1 };

  getExample = () => {
    switch (this.state.currentExample) {
      case 1:
        return FirstExample;
      case 2:
        return SecondExample;
      case 3:
        return ThirdExample;
      case 4:
        return FourthExample;
      default:
        return SecondExample;
    }
  };

  changeExample = value => () => {
    this.setState({ currentExample: value });
  };

  render = () => {
    const Example = this.getExample();
    return (
      <div>
        <div>
          <h2>Example {this.state.currentExample}</h2>
          <p>Choose an example:</p>
          <button onClick={this.changeExample(1)}>Example 1</button>
          <button onClick={this.changeExample(2)}>Example 2</button>
          <button onClick={this.changeExample(3)}>Example 3</button>
          <button onClick={this.changeExample(4)}>Example 4</button>
        </div>
        <hr />
        <Example />
      </div>
    );
  };
}

export default App;
