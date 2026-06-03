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
      <div className="controls">
        <div className="controls__field">
          <label className="controls__label" htmlFor="change-labels-input">
            Change labels
          </label>
          <input
            id="change-labels-input"
            data-cy="change-labels-input"
            className="controls__input"
            type="text"
            placeholder="Type a label…"
            onChange={(event) => {
              setLabels(event.currentTarget.value);
            }}
          />
        </div>
        <div className="controls__field">
          <span className="controls__label">Elements</span>
          <div className="controls__stepper">
            <button
              className="controls__step"
              aria-label="Remove element"
              onClick={() => setNbElements(nbElements > 1 ? nbElements - 1 : 0)}
            >
              −
            </button>
            <span className="controls__count">{nbElements}</span>
            <button
              data-cy="add-element"
              className="controls__step"
              aria-label="Add element"
              onClick={() => setNbElements(nbElements + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <ArcherContainer strokeColor="#6366f1">
        <div style={rootStyle}>
          <ArcherElement id="root with spaces et accents héhéhéhé">
            <div className="archer-box">Root</div>
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
                <div className="archer-box">Element {i}</div>
              </ArcherElement>
            ))}
        </div>
      </ArcherContainer>
    </div>
  );
};

export default SecondExample;
