// @flow
import React from 'react';
import { type ShallowWrapper, shallow } from 'enzyme';
import SvgArrow, {
  computeEndingPointAccordingToArrow,
  computeStartingAnchorPosition,
  computeEndingAnchorPosition,
  computeLabelDimensions,
} from './SvgArrow';
import Point from './Point';

describe('SvgArrow', () => {
  describe('computeEndingPointAccordingToArrow', () => {
    const dataSet = [
      {
        message: 1,
        input: {
          xEnd: 10,
          yEnd: 20,
          arrowLength: 5,
          strokeWidth: 2,
          endingAnchor: 'top',
        },
        expected: { xe: 10, ye: 15 },
      },
      {
        message: 2,
        input: {
          xEnd: 10,
          yEnd: 20,
          arrowLength: 2,
          strokeWidth: 2,
          endingAnchor: 'top',
        },
        expected: { xe: 10, ye: 18 },
      },
      {
        message: 3,
        input: {
          xEnd: 10,
          yEnd: 20,
          arrowLength: 5,
          strokeWidth: 1,
          endingAnchor: 'top',
        },
        expected: { xe: 10, ye: 17.5 },
      },
      {
        message: 4,
        input: {
          xEnd: 10,
          yEnd: 20,
          arrowLength: 5,
          strokeWidth: 2,
          endingAnchor: 'bottom',
        },
        expected: { xe: 10, ye: 25 },
      },
    ];

    dataSet.forEach(data => {
      it(`should compute coordinates of destination point excluding the arrow [data ${
        data.message
      }]`, () => {
        const {
          xEnd,
          yEnd,
          arrowLength,
          strokeWidth,
          endingAnchor,
        } = data.input;
        const result = computeEndingPointAccordingToArrow(
          xEnd,
          yEnd,
          arrowLength,
          strokeWidth,
          endingAnchor,
        );
        expect(result).toEqual(data.expected);
      });
    });
  });

  describe('computeStartingAnchorPosition', () => {
    const dataSet = [
      {
        message: 1,
        input: {
          xStart: 10,
          yStart: 20,
          xEnd: 5,
          yEnd: 2,
          endingAnchor: 'top',
        },
        expected: { xa1: 10, ya1: 11 },
      },
      {
        message: 2,
        input: {
          xStart: 10,
          yStart: 20,
          xEnd: 5,
          yEnd: 2,
          endingAnchor: 'left',
        },
        expected: { xa1: 7.5, ya1: 20 },
      },
    ];

    dataSet.forEach(data => {
      it(`should compute coordinates of source element's anchor [data ${
        data.message
      }]`, () => {
        const { xStart, yStart, xEnd, yEnd, endingAnchor } = data.input;
        const result = computeStartingAnchorPosition(
          xStart,
          yStart,
          xEnd,
          yEnd,
          endingAnchor,
        );
        expect(result).toEqual(data.expected);
      });
    });
  });

  describe('computeEndingAnchorPosition', () => {
    const dataSet = [
      {
        message: 1,
        input: {
          xStart: 10,
          yStart: 20,
          xEnd: 5,
          yEnd: 2,
          endingAnchor: 'top',
        },
        expected: { xa2: 5, ya2: 11 },
      },
      {
        message: 2,
        input: {
          xStart: 10,
          yStart: 20,
          xEnd: 5,
          yEnd: 2,
          endingAnchor: 'left',
        },
        expected: { xa2: 7.5, ya2: 2 },
      },
    ];

    dataSet.forEach(data => {
      it(`should compute coordinates of destination element's anchor [data ${
        data.message
      }]`, () => {
        const { xStart, yStart, xEnd, yEnd, endingAnchor } = data.input;
        const result = computeEndingAnchorPosition(
          xStart,
          yStart,
          xEnd,
          yEnd,
          endingAnchor,
        );
        expect(result).toEqual(data.expected);
      });
    });
  });

  describe('computeLabelDimensions', () => {
    const dataSet = [
      {
        message: 1,
        input: {
          xStart: 10,
          yStart: 20,
          xEnd: 15,
          yEnd: 2,
          endingAnchor: 'top',
        },
        expected: {
          hl: 18,
          wl: 5,
          xl: 10,
          yl: 2,
        },
      },
      {
        message: 2,
        input: {
          xStart: 10,
          yStart: 2,
          xEnd: 5,
          yEnd: 10,
          endingAnchor: 'left',
        },
        expected: {
          hl: 8,
          wl: 5,
          xl: 5,
          yl: 2,
        },
      },
    ];

    dataSet.forEach(data => {
      it(`should compute coordinates of  label foreignObject [data ${
        data.message
      }]`, () => {
        const { xStart, yStart, xEnd, yEnd } = data.input;
        const result = computeLabelDimensions(xStart, yStart, xEnd, yEnd);
        expect(result).toEqual(data.expected);
      });
    });
  });

  describe('component', () => {
    let wrapper: ShallowWrapper;

    const props = {
      startingPoint: new Point(10, 10),
      startingAnchor: 'bottom',
      endingPoint: new Point(30, 30),
      endingAnchor: 'top',
      strokeColor: 'blue',
      arrowLength: 10,
      strokeWidth: 2,
      arrowMarkerId: 'arrow123123',
    };

    beforeEach(() => {
      wrapper = shallow(<SvgArrow {...props} />);
    });

    it('should render path with proper coordinates', () => {
      // The functions should be mocked otherwise the test is not a unit test
      // But they need to become component instance functions
      // For now, let's not mock them
      const path = wrapper.find('path');

      expect(path.props()).toMatchObject({
        d: 'M10,10 C10,10 30,10 30,10',
        markerEnd: 'url(http://localhost/#arrow123123)',
        style: {
          strokeWidth: 2,
          stroke: 'blue',
        },
      });
    });
  });
});
