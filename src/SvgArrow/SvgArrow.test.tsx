import { render } from '@testing-library/react';
import React from 'react';
import Vector2 from '../geometry/Vector2';
import SvgArrow, {
  computeArrowPointAccordingToArrowHead,
  computeEndingAnchorPosition,
  computeLabelDimensions,
  computeStartingAnchorPosition,
} from './SvgArrow';

const expectAttribute = (attributes: NamedNodeMap, key: string, expectedValue: string) => {
  expect(attributes?.getNamedItem(key)?.value).toEqual(expectedValue);
};

const getBySelector = (selector: string) => {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(`Could not find element with selector ${selector}`);
  }
  return element;
};

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
    ] as const;

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
    ] as const;

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
    ] as const;

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
    const props = {
      startingPoint: new Vector2(10, 10),
      startingAnchorOrientation: 'bottom',
      endingPoint: new Vector2(30, 30),
      endingAnchorOrientation: 'top',
      strokeColor: 'blue',
      strokeWidth: 2,
      startArrowMarkerId: 'arrow123123-start',
      endArrowMarkerId: 'arrow123123-end',
      lineStyle: 'curve',
      endShape: {
        arrow: {
          arrowLength: 10,
        },
      },
      startShape: {
        arrow: {
          arrowLength: 10,
        },
      },
      enableEndMarker: true,
    } as const;

    it('should render path with proper coordinates', () => {
      render(
        <svg>
          <SvgArrow {...props} />
        </svg>,
      );
      const path = getBySelector('path');
      const attributes = path?.attributes;
      expectAttribute(attributes, 'd', 'M10,10 C10,10 30,10 30,10');
      expectAttribute(attributes, 'marker-end', 'url(#arrow123123-end)');
      expectAttribute(attributes, 'style', 'fill: none; stroke: blue; stroke-width: 2;');
    });

    // This test is not relevant, "angle" has no effect... probably because of some jsdom mocks
    xit('should render path with no curves coordinates', () => {
      render(
        <svg>
          <SvgArrow {...props} lineStyle="angle" />
        </svg>,
      );
      const path = getBySelector('path');
      const attributes = path?.attributes;
      expectAttribute(attributes, 'd', 'M10,10 C10,10 30,10 30,10');
      expectAttribute(attributes, 'marker-end', 'url(#arrow123123-end)');
      expectAttribute(attributes, 'style', 'fill: none; stroke: blue; stroke-width: 2;');
    });

    it('should render path with straight line coordinates', () => {
      render(
        <svg>
          <SvgArrow {...props} lineStyle="straight" />
        </svg>,
      );
      const path = getBySelector('path');
      const attributes = path?.attributes;
      expectAttribute(attributes, 'd', 'M10,10 15.85786437626905,15.857864376269049');
      expectAttribute(attributes, 'marker-end', 'url(#arrow123123-end)');
      expectAttribute(attributes, 'style', 'fill: none; stroke: blue; stroke-width: 2;');
    });
  });
});
