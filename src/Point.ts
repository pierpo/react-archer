// @flow

class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(point: Point) {
    return new Point(this.x + point.x, this.y + point.y);
  }

  substract(point: Point) {
    return new Point(this.x - point.x, this.y - point.y);
  }
}

export default Point;
