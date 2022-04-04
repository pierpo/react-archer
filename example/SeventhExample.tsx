import React from 'react';
import ArcherContainer from '../src/ArcherContainer/ArcherContainer';
import ArcherElement from '../src/ArcherElement';
const rootStyle = {
  display: 'flex',
  justifyContent: 'center',
};
const rowStyle = {
  margin: '200px 0',
  display: 'flex',
  justifyContent: 'space-between',
};
const boxStyle = {
  padding: '10px',
  border: '1px solid black',
};

const SeventhExample = () => {
  return (
    <div
      style={{
        height: '500px',
        margin: '50px',
      }}
    >
      <ArcherContainer strokeColor="red">
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
                  strokeColor: 'blue',
                  endShape: {
                    circle: {
                      radius: 3,
                    },
                  },
                },
              },
              {
                targetId: 'element3',
                targetAnchor: 'top',
                sourceAnchor: 'bottom',
                style: {
                  endShape: {
                    circle: {
                      radius: 4,
                      fillColor: '#c0ffee',
                      strokeColor: 'black',
                      strokeWidth: 2,
                    },
                  },
                },
              },
            ]}
          >
            <div style={boxStyle}>Root</div>
          </ArcherElement>
        </div>

        <div style={rowStyle}>
          <ArcherElement id="element2">
            <div style={boxStyle}>Element 2</div>
          </ArcherElement>

          <ArcherElement id="element3">
            <div style={boxStyle}>Element 3</div>
          </ArcherElement>
        </div>
      </ArcherContainer>
    </div>
  );
};

export default SeventhExample;
