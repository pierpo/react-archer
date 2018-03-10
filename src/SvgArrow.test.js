import { computeEndingPointAccordingToArrow } from './SvgArrow';

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
      it(`should return proper result for dataset ${data.message}`, () => {
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
});
