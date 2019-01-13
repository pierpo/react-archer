import React, { Component } from 'react';
import ArcherContainer from '../src/ArcherContainer';
import ArcherElement from '../src/ArcherElement';

const boxStyle = { padding: '10px', border: '1px solid black' };
const elementStyle = {
  width: '100px',
  height: '30px',
  position: 'absolute',
  textAlign: 'center',
};

const initialState = {
  elements: [{
    id: 'root',
    label: 'Root',
    position: { x: 400, y: 0 },
    relations: [{
      from: { anchor: 'bottom' },
      to: { anchor: 'top', id: 'element2' },
    }],
  }, {
    id: 'element2',
    label: 'Element 2',
    position: { x: 100, y: 200 },
    relations: [{
      from: { anchor: 'right' },
      to: { anchor: 'left', id: 'element3' },
      label: <div style={{ marginTop: '-20px' }}>Arrow 2</div>,
    }],
  }, {
    id: 'element3',
    label: 'Element 3',
    position: { x: 600, y: 200 },
    relations: [],
  }],
};

class ThirdExample extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.onArrowClick = this.onArrowClick.bind(this)
  }
  deleteRelation(from, to) {
    const elements = this.state.elements.map(el => {
      if (el.id !== from) return el;
      const relations = el.relations.filter(rel => {
        return rel.to.id !== to;
      });
      return { ...el, relations };
    });
    this.setState({ elements });
  }
  renderElement(el) {
    const { id, label, relations, position } = el;
    return (
      <ArcherElement
        key={id}
        id={id}
        relations={relations}
        style={{ ...elementStyle, top: position.y, left: position.x }}
      >
        <div style={boxStyle}>{label}</div>
      </ArcherElement>
    );
  }
  onArrowClick(evt, markerId, from, to) {
    const { nativeEvent } = evt;
    this.deleteRelation(from, to);
  }
  render() {
    return (
      <div style={{ height: '500px', margin: '50px' }}>
        <ArcherContainer strokeColor="red" style={{ height: '100%' }} onClick={this.onArrowClick}>
          {this.state.elements.map(this.renderElement)}
        </ArcherContainer>
      </div>
    );
  }
}

export default ThirdExample;
