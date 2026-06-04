import { computeArrowDirectionVector } from './SvgArrow.helper';

describe('computeArrowDirectionVector', () => {
  it('points left', () => {
    expect(computeArrowDirectionVector('left')).toEqual({ arrowX: -1, arrowY: 0 });
  });

  it('points right', () => {
    expect(computeArrowDirectionVector('right')).toEqual({ arrowX: 1, arrowY: 0 });
  });

  it('points up for top', () => {
    expect(computeArrowDirectionVector('top')).toEqual({ arrowX: 0, arrowY: -1 });
  });

  it('points down for bottom', () => {
    expect(computeArrowDirectionVector('bottom')).toEqual({ arrowX: 0, arrowY: 1 });
  });

  it('returns a zero vector for middle/unknown orientations', () => {
    expect(computeArrowDirectionVector('middle')).toEqual({ arrowX: 0, arrowY: 0 });
    expect(computeArrowDirectionVector('auto')).toEqual({ arrowX: 0, arrowY: 0 });
  });
});
