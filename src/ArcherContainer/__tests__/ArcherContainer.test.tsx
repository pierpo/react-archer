import React, { act } from 'react';
import { render } from '@testing-library/react';
import ArcherContainer from '../ArcherContainer';
import ArcherElement from '../../ArcherElement/ArcherElement';

const originalConsoleWarn = console.warn;

describe('ArcherContainer', () => {
  beforeEach(() => {
    console.warn = originalConsoleWarn;
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

    it('should render an arrow with className', () => {
      const screen = render(
        <ArcherContainer startMarker>
          <ArcherElement
            id="elem-left"
            relations={[
              {
                className: 'blink',
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

    it('should render the arrows with labels', () => {
      const screen = render(
        <ArcherContainer startMarker endMarker={false}>
          <ArcherElement
            id="elem-left"
            relations={[
              {
                sourceAnchor: 'left',
                targetAnchor: 'right',
                targetId: 'elem-right',
                label: <div>this is a fine label</div>,
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

    it('should render no arrow if id is not found', () => {
      console.warn = jest.fn();

      const screen = render(
        <ArcherContainer startMarker endMarker={false}>
          <ArcherElement
            id="elem-left"
            relations={[
              {
                sourceAnchor: 'left',
                targetAnchor: 'right',
                targetId: 'oh no',
              },
            ]}
          >
            <div>element 1</div>
          </ArcherElement>
          <ArcherElement id="oops">
            <div>element 2</div>
          </ArcherElement>
        </ArcherContainer>,
      );

      expect(screen.baseElement).toMatchSnapshot();
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching('Could not find target element'),
      );
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
