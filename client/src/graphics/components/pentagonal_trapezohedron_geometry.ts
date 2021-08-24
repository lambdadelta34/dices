import { PolyhedronGeometry } from "three";

class PentagonalTrapezohedronGeometry extends PolyhedronGeometry {
  constructor(radius = 1, detail = 0) {
    const sides = 10;
    const vertices = [
      [0, 0, 1],
      [0, 0, -1],
    ].flat();

    for (let side = 0; side < sides; ++side) {
      const b = (side * Math.PI * 2) / sides;
      vertices.push(-Math.cos(b), -Math.sin(b), 0.105 * (side % 2 ? 1 : -1));
    }

    const indices = [
      [0, 2, 3],
      [0, 3, 4],
      [0, 4, 5],
      [0, 5, 6],
      [0, 6, 7],
      [0, 7, 8],
      [0, 8, 9],
      [0, 9, 10],
      [0, 10, 11],
      [0, 11, 2],
      [1, 3, 2],
      [1, 4, 3],
      [1, 5, 4],
      [1, 6, 5],
      [1, 7, 6],
      [1, 8, 7],
      [1, 9, 8],
      [1, 10, 9],
      [1, 11, 10],
      [1, 2, 11],
    ].flat();

    super(vertices, indices, radius, detail);
    this.type = "PentagonalTrapezohedronGeometry";
    this.parameters = {
      vertices,
      indices,
      radius,
      detail,
    };
  }

  static fromJSON({
    radius,
    detail,
  }: {
    radius: number;
    detail: number;
  }): PentagonalTrapezohedronGeometry {
    return new PentagonalTrapezohedronGeometry(radius, detail);
  }
}

export {
  PentagonalTrapezohedronGeometry,
  PentagonalTrapezohedronGeometry as PentagonalTrapezohedronBufferGeometry,
};
