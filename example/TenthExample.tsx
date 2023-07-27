import React, { useState } from 'react';
import ArcherContainer from '../src/ArcherContainer/ArcherContainer';
import ArcherElement from '../src/ArcherElement/ArcherElement';
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

const TenthExample = () => {
  const [isHovering, setIsHovering] = useState(false);

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
                style: {
                  strokeDasharray: '5,5',
                  strokeColor: isHovering ? 'green' : 'blue',
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
              },
            ]}
          >
            <div style={boxStyle}>Hover my arrow</div>
          </ArcherElement>
        </div>

        <div style={rowStyle}>
          <ArcherElement
            id="element2"
            relations={[
              {
                targetId: 'element3',
                targetAnchor: 'left',
                sourceAnchor: 'right',
                style: {
                  strokeColor: 'blue',
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
            <div style={boxStyle}>Element 2</div>
          </ArcherElement>

          <ArcherElement id="element3">
            <div style={boxStyle}>Element 3</div>
          </ArcherElement>

          <ArcherElement
            id="element4"
            relations={[
              {
                targetId: 'root',
                targetAnchor: 'right',
                sourceAnchor: 'left',
                label: 'Arrow 3',
              },
            ]}
          >
            <div style={boxStyle}>Element 4</div>
          </ArcherElement>
        </div>
      </ArcherContainer>
    </div>
  );
};

export default TenthExample;
