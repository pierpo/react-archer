// @flow
import Point from './Point';

describe('Point', () => {
  it('should instanciate a Point', () => {
    const p = new Point(123, 456);

    expect(p.x).toEqual(123);
    expect(p.y).toEqual(456);
  });

  it('should add two point position vectors', () => {
    const p1 = new Point(1, 10);
    const p2 = new Point(1, 10);

    const result = p1.add(p2);

    expect(result.x).toEqual(2);
    expect(result.y).toEqual(20);
  });

  it('should substract two point position vectors', () => {
    const p1 = new Point(10, 20);
    const p2 = new Point(5, 13);

    const result = p1.substract(p2);

    expect(result.x).toEqual(5);
    expect(result.y).toEqual(7);
  });
});
