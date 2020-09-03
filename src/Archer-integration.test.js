// @flow
import React from 'react';
import { type ReactWrapper, mount } from 'enzyme';

import ArcherElement from './ArcherElement';
import ArcherContainer from './ArcherContainer';
import { rootStyle, rowStyle, boxStyle } from './testHelper';

describe('Archer Integration', () => {
  const defaultProps = {
    arrow: {
      arrowLength: 10,
      arrowThickness: 30,
    },
    strokeColor: 'rgb(123, 234, 123)',
    strokeDasharray: '5,5',
  };

  type ThirdPartyComponentProps = { ItemRenderer: React$Node };

  describe('Uses a functional child API to work with third party renderers', () => {
    const ThirdPartyComponent = ({
      ItemRenderer,
    }: ThirdPartyComponentProps): React$Element<'div'> => <div>{ItemRenderer}</div>;

    const RootElement = (): React$Element<'div'> => (
      <div style={rootStyle}>
        <ArcherElement
          id="root"
          relations={[
            {
              targetId: 'element2',
              targetAnchor: 'top',
              sourceAnchor: 'bottom',
              style: { strokeDasharray: '5,5' },
            },
          ]}
        >
          <div style={boxStyle}>Root</div>
        </ArcherElement>
      </div>
    );

    const ElementTwo = (): React$Element<typeof ArcherElement> => (
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
              endShape: {
                circle: { radius: 3, strokeWidth: 1, fillColor: 'blue', strokeColor: 'black' },
              },
            },
            label: <div style={{ marginTop: '-20px' }}>Arrow 2</div>,
          },
        ]}
      >
        <div style={boxStyle}>Element 2</div>
      </ArcherElement>
    );

    const ElementThree = (): React$Element<typeof ArcherElement> => (
      <ArcherElement id="element3" relations={[]}>
        <div style={boxStyle}>Element 3</div>
      </ArcherElement>
    );

    const ElementFour = (): React$Element<typeof ArcherElement> => (
      <ArcherElement
        id="element4"
        relations={[
          {
            targetId: 'root',
            targetAnchor: 'right',
            sourceAnchor: 'left',
            label: 'Arrow 3',
            style: {
              endShape: {
                circle: {
                  radius: 2,
                  strokeWidth: 1,
                  fillColor: '#c0ffee',
                  strokeColor: 'tomato',
                },
              },
            },
          },
        ]}
      >
        <div style={boxStyle}>Element 4</div>
      </ArcherElement>
    );

    const ItemRendererComponent = () => (
      <div style={{ height: '500px', margin: '50px' }}>
        <ArcherContainer strokeColor="red">
          {ArcherContext => (
            <ArcherContext.Consumer>
              {contextValue => (
                <ThirdPartyComponent
                  ItemRenderer={
                    <ArcherContext.Provider value={contextValue}>
                      <>
                        <RootElement />
                        <div style={rowStyle}>
                          <ElementTwo />
                          <ElementThree />
                          <ElementFour />
                        </div>
                      </>
                    </ArcherContext.Provider>
                  }
                />
              )}
            </ArcherContext.Consumer>
          )}
        </ArcherContainer>
      </div>
    );

    it('renders elements', () => {
      const component: ReactWrapper = mount(<ItemRendererComponent {...defaultProps} />);

      expect(component.find(ArcherElement).length).toEqual(4);
    });
  });
});
