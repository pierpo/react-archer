import React, { Component } from 'react';
import './App.css';
import ArcherContainer from '../src/ArcherContainer';
import ArcherElement from '../src/ArcherElement'

class App extends Component {
  render() {
    return (
      <div className="App">

        <ArcherContainer
          strokeColor='red'
        >
          <div className="root">
            <ArcherElement id="root" relations={[
              {
                from: { anchor: 'bottom' },
                to: { anchor: 'top', id: 'element2' }
              },
              {
                from: { anchor: 'bottom' },
                to: { anchor: 'top', id: 'element3' }
              },
              {
                from: { anchor: 'bottom' },
                to: { anchor: 'top', id: 'element4' }
              }
            ]}>
              <div className="box">Element 1</div>
            </ArcherElement>
          </div>

          <div className="row">
            <ArcherElement id="element2" relations={[{ from: { anchor: 'right'}, to: { anchor: 'left', id: 'element3' }}]}>
              <div className="box">Element 2</div>
            </ArcherElement>
            <ArcherElement id="element3">
              <div className="box">Element 3</div>
            </ArcherElement>
            <ArcherElement id="element4">
              <div className="box">Element 4</div>
            </ArcherElement>
            <ArcherElement id="element5" relations={[{ from: { anchor: 'top'}, to: { anchor: 'bottom', id: 'root' }}]}>
              <div className="box">Element 5</div>
            </ArcherElement>
          </div>
          <div className="row">
            <ArcherElement id="element6" relations={[{ from: { anchor: 'top'}, to: { anchor: 'left', id: 'element4' }}]}>
              <div className="box">Element 6</div>
            </ArcherElement>
            <div className="box">Element 7</div>
            <div className="box">Element 8</div>
            <ArcherElement id="element9" relations={[{ from: { anchor: 'left'}, to: { anchor: 'right', id: 'element3' }}]}>
              <div className="box">Element 9</div>
            </ArcherElement>
          </div>
        </ArcherContainer>
      </div>
    );
  }
}

export default App;
