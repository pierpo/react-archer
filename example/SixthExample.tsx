import React from 'react';
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

const SixthExample = () => (
  <div
    style={{
      height: '500px',
      margin: '50px',
    }}
  >
    <ArcherContainer strokeColor="#6366f1">
      {/* eslint-disable-next-line unused-imports/no-unused-vars -- this is for the example */}
      {(ArcherContext) => (
        <>
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
                  },
                },
              ]}
            >
              <div className="archer-box">Root</div>
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
              <div className="archer-box">Element 2</div>
            </ArcherElement>

            <ArcherElement id="element3">
              <div className="archer-box">Element 3</div>
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
              <div className="archer-box">Element 4</div>
            </ArcherElement>
          </div>
        </>
      )}
    </ArcherContainer>
  </div>
);

export default SixthExample;
