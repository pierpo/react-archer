// @flow

function Point(x: number, y: number): PointType {
  this.x = x;
  this.y = y;
  // $FlowFixMe TODO switch to class syntax to solve this
  return this;
}

Point.prototype.add = function(point: PointType) {
  return new Point(this.x + point.x, this.y + point.y);
};

Point.prototype.substract = function(point: PointType) {
  return new Point(this.x - point.x, this.y - point.y);
};

export default Point;
