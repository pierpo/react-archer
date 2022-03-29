import React from 'react';
import { shallow } from 'enzyme';
import SvgArrow, {
  computeArrowPointAccordingToArrowHead,
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
        expected: {
          xPoint: 10,
          yPoint: 15,
        },
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
        expected: {
          xPoint: 10,
          yPoint: 18,
        },
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
        expected: {
          xPoint: 10,
          yPoint: 17.5,
        },
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
        expected: {
          xPoint: 10,
          yPoint: 25,
        },
      },
    ];
    dataSet.forEach((data) => {
      it(`should compute coordinates of destination point excluding the arrow [data ${data.message}]`, () => {
        const { xEnd, yEnd, arrowLength, strokeWidth, endingAnchor } = data.input;
        const result = computeArrowPointAccordingToArrowHead(
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
  describe('computeStartingAnchorOrientation', () => {
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
        expected: {
          xAnchor1: 10,
          yAnchor1: 11,
        },
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
        expected: {
          xAnchor1: 7.5,
          yAnchor1: 20,
        },
      },
    ];
    dataSet.forEach((data) => {
      it(`should compute coordinates of source element's anchor [data ${data.message}]`, () => {
        const { xStart, yStart, xEnd, yEnd, endingAnchor } = data.input;
        const result = computeStartingAnchorPosition(xStart, yStart, xEnd, yEnd, endingAnchor);
        expect(result).toEqual(data.expected);
      });
    });
  });
  describe('computeEndingAnchorOrientation', () => {
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
        expected: {
          xAnchor2: 5,
          yAnchor2: 11,
        },
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
        expected: {
          xAnchor2: 7.5,
          yAnchor2: 2,
        },
      },
    ];
    dataSet.forEach((data) => {
      it(`should compute coordinates of destination element's anchor [data ${data.message}]`, () => {
        const { xStart, yStart, xEnd, yEnd, endingAnchor } = data.input;
        const result = computeEndingAnchorPosition(xStart, yStart, xEnd, yEnd, endingAnchor);
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
          labelHeight: 18,
          labelWidth: 5,
          xLabel: 10,
          yLabel: 2,
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
          labelHeight: 8,
          labelWidth: 5,
          xLabel: 5,
          yLabel: 2,
        },
      },
    ];
    dataSet.forEach((data) => {
      it(`should compute coordinates of  label foreignObject [data ${data.message}]`, () => {
        const { xStart, yStart, xEnd, yEnd } = data.input;
        const result = computeLabelDimensions(xStart, yStart, xEnd, yEnd);
        expect(result).toEqual(data.expected);
      });
    });
  });
  describe('component', () => {
    let wrapper: ShallowWrapper<typeof SvgArrow>;
    const props = {
      startingPoint: new Point(10, 10),
      startingAnchorOrientation: 'bottom',
      endingPoint: new Point(30, 30),
      endingAnchorOrientation: 'top',
      strokeColor: 'blue',
      strokeWidth: 2,
      arrowMarkerId: 'arrow123123',
      lineStyle: 'curve',
      endShape: {
        arrow: {
          arrowLength: 10,
        },
      },
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
    it('should render path with no curves coordinates', () => {
      wrapper.setProps({
        lineStyle: 'angle',
      });
      wrapper.update();
      const path = wrapper.find('path');
      expect(path.props()).toMatchObject({
        d: 'M10,10 10,10 30,10 30,10',
        markerEnd: 'url(http://localhost/#arrow123123)',
        style: {
          strokeWidth: 2,
          stroke: 'blue',
        },
      });
    });
    it('should render path with straight line coordinates', () => {
      wrapper.setProps({
        lineStyle: 'straight',
      });
      wrapper.update();
      const path = wrapper.find('path');
      expect(path.props()).toMatchObject({
        d: 'M10,10 15.85786437626905,15.857864376269049',
        markerEnd: 'url(http://localhost/#arrow123123)',
        style: {
          strokeWidth: 2,
          stroke: 'blue',
        },
      });
    });
  });
});
