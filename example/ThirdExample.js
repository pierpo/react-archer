import React from 'react';
import ArcherContainer from '../src/ArcherContainer';
import ArcherElement from '../src/ArcherElement';

const boxStyle = {
  border: 'none',
  display: 'inline-block',
  width: '100px',
  position: 'relative',
  display: 'inline-block',
  textAlign: 'center'
};

const abBoxStyle = {
  background: 'deepskyblue',
  color: 'white'
}
const mergeBoxtyle = {
  background: 'linear-gradient(to right, deepskyblue, limegreen)',
  color: 'white'
};

const resultBoxStyle = {
  background: 'limegreen',
  color: 'white'
}

const innerStyle = {padding: '10px'};

const ThirdExample = () => {
  return (
      <div style={{height: '500px', width: '800px', margin: '50px', position: 'absolute'}}>
        <ArcherContainer strokeColor="gray" style={{height: '100%'}}>
          <div style={{...boxStyle, ...abBoxStyle, top: 10, left: 10}}>
            <ArcherElement
                id="StepA"
                relations={[
                  {
                    targetId: 'merge',
                    targetAnchor: 'left',
                    sourceAnchor: 'right',
                    style: {
                      arrow: {
                        stroke: 'deepskyblue',
                        strokeDasharray: '16px 8px',
                        animation: 'dash 15s linear infinite',
                      },
                    },
                  label: <div style={{color: '#BBBBBB', top: '-15px', position: "relative"}}>A → M</div>,
                  },
                ]}
            >
              <div style={innerStyle}>Step A</div>
            </ArcherElement>
          </div>

          <div style={{...boxStyle, ...mergeBoxtyle, top: 10, left: 200}}>
            <ArcherElement
                id="merge"
                relations={[
                  {
                    targetId: 'result',
                    targetAnchor: 'left',
                    sourceAnchor: 'right',
                    style: {
                      arrow: {
                        stroke: 'limegreen',
                        strokeDasharray: '16px 8px',
                        animation: 'dash 12s linear infinite',
                      },
                    },
                  },
                ]}
            >
              <div style={innerStyle}>Merge</div>
            </ArcherElement>
          </div>

          <div style={{...boxStyle, ...resultBoxStyle, top: 10, left: 420}}>
            <ArcherElement id="result">
              <div style={innerStyle}>Result</div>
            </ArcherElement>
          </div>
          <div style={{...boxStyle, ...abBoxStyle, top: 100, left: 10, position: "absolute"}}>
            <ArcherElement
                id="StepB"
                relations={[
                  {
                    targetId: 'merge',
                    targetAnchor: 'left',
                    sourceAnchor: 'right',
                    style: {
                      arrow: {
                        stroke: 'deepskyblue',
                        strokeDasharray: '16px 8px',
                        animation: 'dash 12s linear infinite',
                      },
                    }
                  },
                ]}
            >
              <div style={innerStyle}>Step B</div>
            </ArcherElement>
          </div>
        </ArcherContainer>
      </div>
  );
};

export default ThirdExample;
