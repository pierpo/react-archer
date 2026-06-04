import React, { useState } from 'react';
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

const TenthExample = () => {
  const [isHovering, setIsHovering] = useState(false);

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
                style: {
                  strokeDasharray: '5,5',
                  strokeColor: isHovering ? '#10b981' : '#ec4899',
                },
                domAttributes: {
                  // The hovering style could be achieved with CSS as well
                  onMouseOver: () => {
                    setIsHovering(true);
                  },
                  onMouseOut: () => {
                    setIsHovering(false);
                  },
                  // The click however needs a props, obviously
                  onClick: () => {
                    console.log('you clicked me!');
                  },
                },
                hitSlop: 30,
                cursor: 'grab',
              },
            ]}
          >
            <Box>Hover my arrow</Box>
          </ArcherElement>
        </div>

        <div style={rowStyle}>
          <ArcherElement
            id="element2"
            relations={[
              {
                targetId: 'element3',
                style: {
                  strokeColor: '#ec4899',
                  strokeWidth: 1,
                },
                label: (
                  <div
                    style={{
                      marginTop: '-20px',
                    }}
                  >
                    Arrow 2
                  </div>
                ),
              },
            ]}
          >
            <Box>Element 2</Box>
          </ArcherElement>

          <ArcherElement id="element3">
            <Box>Element 3</Box>
          </ArcherElement>

          <ArcherElement
            id="element4"
            relations={[
              {
                targetId: 'root',
                label: 'Arrow 3',
              },
            ]}
          >
            <Box>Element 4</Box>
          </ArcherElement>
        </div>
      </ArcherContainer>
    </div>
  );
};

export default TenthExample;
