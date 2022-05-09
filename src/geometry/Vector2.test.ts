import Vector2 from './Vector2';

describe('Vector2', () => {
  it('should instanciate a Vector2', () => {
    const p = new Vector2(123, 456);
    expect(p.x).toEqual(123);
    expect(p.y).toEqual(456);
  });

  it('should add two position vectors', () => {
    const p1 = new Vector2(1, 10);
    const p2 = new Vector2(1, 10);
    const result = p1.add(p2);
    expect(result.x).toEqual(2);
    expect(result.y).toEqual(20);
  });

  it('should substract two position vectors', () => {
    const p1 = new Vector2(10, 20);
    const p2 = new Vector2(5, 13);
    const result = p1.substract(p2);
    expect(result.x).toEqual(5);
    expect(result.y).toEqual(7);
  });
});
