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
const boxStyle = {
  padding: '10px',
  border: '1px solid black',
};

const SecondExample = () => {
  const [nbElements, setNbElements] = React.useState(3);
  const [labels, setLabels] = React.useState('hello');
  return (
    <div
      style={{
        height: '500px',
        margin: '50px',
      }}
    >
      <div>
        <div>Change labels</div>
        <input
          data-cy="change-labels-input"
          type="text"
          onChange={(event) => {
            setLabels(event.currentTarget.value);
          }}
        />
      </div>
      <div>
        <div>Add elements</div>
        <button data-cy="add-element" onClick={() => setNbElements(nbElements + 1)}>
          +
        </button>
        <button onClick={() => setNbElements(nbElements > 1 ? nbElements - 1 : 0)}>-</button>
      </div>
      <ArcherContainer strokeColor="red">
        <div style={rootStyle}>
          <ArcherElement id="root with spaces et accents héhéhéhé">
            <div style={boxStyle}>Root</div>
          </ArcherElement>
        </div>

        <div style={rowStyle}>
          {Array(nbElements)
            .fill(0)
            .map((_, i) => (
              <ArcherElement
                key={`element${i}`}
                id={`element${i}`}
                relations={[
                  {
                    targetId: 'root with spaces et accents héhéhéhé',
                    targetAnchor: 'bottom',
                    sourceAnchor: 'top',
                    label: (
                      <div>
                        {i} {labels}
                      </div>
                    ),
                  },
                ]}
              >
                <div style={boxStyle}>Element {i}</div>
              </ArcherElement>
            ))}
        </div>
      </ArcherContainer>
    </div>
  );
};

export default SecondExample;
