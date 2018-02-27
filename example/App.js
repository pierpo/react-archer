import React, { Component } from 'react';
import './App.css';
import SvgGraphContainer from '../src/SvgGraphContainer';
import DrawSvgArrow from '../src/DrawSvgArrow'

class App extends Component {
  render() {
    return (
      <div className="App">

        <SvgGraphContainer
          strokeColor='red'
        >
          <div className="root">
            <DrawSvgArrow id="root" relations={[
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
            </DrawSvgArrow>
          </div>

          <div className="row">
            <DrawSvgArrow id="element2" relations={[{ from: { anchor: 'right'}, to: { anchor: 'left', id: 'element3' }}]}>
              <div className="box">Element 2</div>
            </DrawSvgArrow>
            <DrawSvgArrow id="element3">
              <div className="box">Element 3</div>
            </DrawSvgArrow>
            <DrawSvgArrow id="element4">
              <div className="box">Element 4</div>
            </DrawSvgArrow>
            <DrawSvgArrow id="element5" relations={[{ from: { anchor: 'top'}, to: { anchor: 'bottom', id: 'root' }}]}>
              <div className="box">Element 5</div>
            </DrawSvgArrow>
          </div>
          <div className="row">
            <DrawSvgArrow id="element6" relations={[{ from: { anchor: 'top'}, to: { anchor: 'left', id: 'element4' }}]}>
              <div className="box">Element 6</div>
            </DrawSvgArrow>
            <div className="box">Element 7</div>
            <div className="box">Element 8</div>
            <DrawSvgArrow id="element9" relations={[{ from: { anchor: 'left'}, to: { anchor: 'right', id: 'element3' }}]}>
              <div className="box">Element 9</div>
            </DrawSvgArrow>
          </div>
        </SvgGraphContainer>
      </div>
    );
  }
}

export default App;
