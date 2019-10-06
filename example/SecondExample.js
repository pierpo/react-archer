import React from 'react';
import ArcherContainer from '../src/ArcherContainer';
import ArcherElement from '../src/ArcherElement';

const rootStyle = { display: 'flex', justifyContent: 'center' };
const rowStyle = {
  margin: '200px 0',
  display: 'flex',
  justifyContent: 'space-between',
};
const boxStyle = { padding: '10px', border: '1px solid black' };

class SecondExample extends React.Component {
  state = { nbElements: 3, labels: 'hello' };

  render = () => {
    return (
      <div style={{ height: '500px', margin: '50px' }}>
        <div>
          <div>Change labels</div>
          <input
            data-cy="change-labels-input"
            type="text"
            onChange={event => {
              this.setState({ labels: event.currentTarget.value });
            }}
          />
        </div>
        <div>
          <div>Add elements</div>
          <button
            data-cy="add-element"
            onClick={() => this.setState({ nbElements: this.state.nbElements + 1 })}
          >
            +
          </button>
          <button
            onClick={() =>
              this.setState({
                nbElements: this.state.nbElements > 1 ? this.state.nbElements - 1 : 0,
              })
            }
          >
            -
          </button>
        </div>
        <ArcherContainer strokeColor="red">
          <div style={rootStyle}>
            <ArcherElement id="root">
              <div style={boxStyle}>Root</div>
            </ArcherElement>
          </div>

          <div style={rowStyle}>
            {Array(this.state.nbElements)
              .fill()
              .map((_, i) => (
                <ArcherElement
                  key={`element${i}`}
                  id={`element${i}`}
                  relations={[
                    {
                      targetId: 'root',
                      targetAnchor: 'bottom',
                      sourceAnchor: 'top',
                      label: (
                        <div>
                          {i} {this.state.labels}
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
}

export default SecondExample;
