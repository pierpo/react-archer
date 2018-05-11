import React from 'react';
import { shallow } from 'enzyme';
import SvgArrow, {
  computeEndingPointAccordingToArrow,
  computeStartingAnchorPosition,
  computeEndingAnchorPosition,
} from './SvgArrow';

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

  describe('component', () => {
    let wrapper;

    const props = {
      startingPoint: { x: 10, y: 10 },
      startingAnchor: 'bottom',
      endingPoint: { x: 30, y: 30 },
      endingAnchor: 'top',
      strokeColor: 'blue',
      arrowLength: 10,
      strokeWidth: 2,
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
        markerEnd: 'url(about:blank#arrow)',
        style: {
          strokeWidth: 2,
          stroke: 'blue',
        },
      });
    });
  });
});
