import React from 'react';
import renderer from 'react-test-renderer';
import { mount, shallow, ShallowWrapper } from 'enzyme';
import { getByText, render, screen } from '@testing-library/react';
import ArcherContainer from './ArcherContainer';
import { SourceToTargetType } from './types';
import ArcherElement from './ArcherElement';
import { act } from 'react-dom/test-utils';

describe('ArcherContainer', () => {
  let fakeRandom = 0;
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockImplementation(() => {
      fakeRandom += 0.00001;
      return fakeRandom;
    });
  });

  afterEach(() => {
    fakeRandom = 0;
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  it('should render given children', async () => {
    const screen = render(
      <ArcherContainer>
        <div>child</div>
      </ArcherContainer>,
    );
    await screen.findByText('child');
  });

  describe('rendering an svg with the marker element used to draw an svg arrow', () => {
    it('should render simple elements', async () => {
      const screen = render(
        <ArcherContainer>
          <ArcherElement
            id="elem-left"
            relations={[{ sourceAnchor: 'left', targetAnchor: 'right', targetId: 'elem-right' }]}
          >
            <div>element 1</div>
          </ArcherElement>
          <ArcherElement id="elem-right">
            <div>element 2</div>
          </ArcherElement>
        </ArcherContainer>,
      );
      expect(screen.baseElement).toMatchSnapshot();
    });

    it('should render the arrow with an arrow end by default', () => {
      const screen = render(
        <ArcherContainer>
          <ArcherElement id="elem-left">
            <div>element 1</div>
          </ArcherElement>
          <ArcherElement
            id="elem-right"
            relations={[{ sourceAnchor: 'right', targetAnchor: 'left', targetId: 'elem-left' }]}
          >
            <div>element 2</div>
          </ArcherElement>
        </ArcherContainer>,
      );

      expect(screen.baseElement).toMatchSnapshot();
    });

    it('should render the arrow with a circle end when provided', () => {
      const screen = render(
        <ArcherContainer>
          <ArcherElement
            id="elem-left"
            relations={[
              {
                sourceAnchor: 'left',
                targetAnchor: 'right',
                targetId: 'elem-right',
                style: {
                  endShape: {
                    circle: {
                      radius: 11,
                      strokeWidth: 2,
                      strokeColor: 'tomato',
                      fillColor: '#c0ffee',
                    },
                  },
                },
              },
            ]}
          >
            <div>element 1</div>
          </ArcherElement>
          <ArcherElement id="elem-right">
            <div>element 2</div>
          </ArcherElement>
        </ArcherContainer>,
      );
      expect(screen.baseElement).toMatchSnapshot();
    });

    it('should render the arrow on both ends', () => {
      const screen = render(
        <ArcherContainer startMarker>
          <ArcherElement
            id="elem-left"
            relations={[
              {
                sourceAnchor: 'left',
                targetAnchor: 'right',
                targetId: 'elem-right',
              },
            ]}
          >
            <div>element 1</div>
          </ArcherElement>
          <ArcherElement id="elem-right">
            <div>element 2</div>
          </ArcherElement>
        </ArcherContainer>,
      );
      expect(screen.baseElement).toMatchSnapshot();
    });

    it('should render the arrow only at start', () => {
      const screen = render(
        <ArcherContainer startMarker endMarker={false}>
          <ArcherElement
            id="elem-left"
            relations={[
              {
                sourceAnchor: 'left',
                targetAnchor: 'right',
                targetId: 'elem-right',
              },
            ]}
          >
            <div>element 1</div>
          </ArcherElement>
          <ArcherElement id="elem-right">
            <div>element 2</div>
          </ArcherElement>
        </ArcherContainer>,
      );
      expect(screen.baseElement).toMatchSnapshot();
    });
  });

  describe('Event Listeners', () => {
    it('should move elements on window resize', () => {
      const screen = render(
        <ArcherContainer startMarker endMarker={false}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'stretch',
            }}
          >
            <ArcherElement
              id="elem-left"
              relations={[
                {
                  sourceAnchor: 'left',
                  targetAnchor: 'right',
                  targetId: 'elem-right',
                },
              ]}
            >
              <div>element 1</div>
            </ArcherElement>
            <ArcherElement id="elem-right">
              <div>element 2</div>
            </ArcherElement>
          </div>
        </ArcherContainer>,
      );
      const element2 = screen.getByText('element 2');

      const pathBefore = document.querySelector('path');
      expect(pathBefore?.attributes.getNamedItem('d')?.value).toEqual('M0,0 L0,6 L10,3 z');

      // Sadly all arrows return the same value for getBoundingClientRect
      // let's change the implementation, trigger a resize, then see that the values did change
      element2.getBoundingClientRect = jest.fn().mockReturnValue({
        width: 20,
        height: 20,
        top: 0,
        left: 0,
        right: 20,
        bottom: 20,
      });
      act(() => window.resizeTo(500, 500));
      const path = document.querySelector('path');
      expect(path?.attributes.getNamedItem('d')?.value).toEqual('M0,0 L0,6 L10,3 z');
    });
  });
});
