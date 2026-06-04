import React from 'react';
import ArcherContainer from '../src/ArcherContainer/ArcherContainer';
import ArcherElement from '../src/ArcherElement/ArcherElement';
import Box from './components/Box';
const rootStyle = {
  display: 'flex',
  justifyContent: 'center',
};
const rowStyle = {
  margin: '200px 0',
  display: 'flex',
  justifyContent: 'space-between',
};

const CircleEnds = () => {
  return (
    <div
      style={{
        height: '500px',
        margin: '50px',
      }}
    >
      <ArcherContainer strokeColor="#6366f1">
        <div style={rootStyle}>
          <ArcherElement
            id="root"
            relations={[
              {
                targetId: 'element2',
                targetAnchor: 'top',
                sourceAnchor: 'bottom',
                // Draws this arrow on top
                order: 100,
                style: {
                  strokeColor: '#ec4899',
                  strokeWidth: 2,
                  endShape: {
                    circle: {
                      radius: 6,
                      fillColor: '#f472b6',
                      strokeColor: '#be185d',
                      strokeWidth: 3,
                    },
                  },
                },
              },
              {
                targetId: 'element3',
                targetAnchor: 'top',
                sourceAnchor: 'bottom',
                style: {
                  strokeColor: '#10b981',
                  strokeWidth: 2,
                  endShape: {
                    circle: {
                      radius: 6,
                      fillColor: '#ffffff',
                      strokeColor: '#10b981',
                      strokeWidth: 3,
                    },
                  },
                },
              },
            ]}
          >
            <Box>Root</Box>
          </ArcherElement>
        </div>

        <div style={rowStyle}>
          <ArcherElement id="element2">
            <Box>Element 2</Box>
          </ArcherElement>

          <ArcherElement id="element3">
            <Box>Element 3</Box>
          </ArcherElement>
        </div>
      </ArcherContainer>
    </div>
  );
};

export default CircleEnds;
