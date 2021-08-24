import * as CANNON from "cannon-es";
import * as THREE from "three";
import { Dice, DiceType, PhysicsWorld, DicePhysics } from "../types";
import { PentagonalTrapezohedronGeometry } from "../graphics/components/pentagonal_trapezohedron_geometry";

export const createPhysics = (dices: Dice[]): PhysicsWorld => {
  const physics = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82 * 800, 0),
  });
  const planeShape = new CANNON.Plane();
  const planeBody = new CANNON.Body({ mass: 0 });
  const diceBodies: DicePhysics[] = [];

  planeBody.addShape(planeShape);
  planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  Object.keys(diePhysics).forEach((key) => {
    const physicsSettings = diePhysics[key];

    console.log({ physicsSettings });
    const shape = createShape(physicsSettings);
    const { position, quaternion } = dices.find(
      // const meshasdafasfkljalksfjlakjsflkajsf = dices.find(
      ({ diceType }) => diceType === key,
    ).object;

    // console.log({ meshasdafasfkljalksfjlakjsflkajsf });
    // const shape = createShape({
    //   mesh: meshasdafasfkljalksfjlakjsflkajsf.geometry,
    // });

    const diceBody = new CANNON.Body({ ...physicsSettings, shape });
    diceBody.position.set(position.x, position.y, position.z);
    diceBody.quaternion.set(
      quaternion.x,
      quaternion.y,
      quaternion.z,
      quaternion.w,
    );
    diceBodies.push({ object: diceBody, diceType: DiceType[key] });
    physics.addBody(diceBody);
  });

  physics.addBody(planeBody);
  return { physics, dices: diceBodies };
};

const createShape = ({ mesh }): CANNON.Shape => {
  console.log({ mesh });
  const dots = mesh.attributes.position.array;
  const vertices: CANNON.Vec3[] = [];
  for (let i = 0; i < dots.length; i += 3) {
    vertices.push(new CANNON.Vec3(dots[i], dots[i + 1], dots[i + 2]));
  }
  const faces: number[][] = [];
  for (let i = 0; i < dots.length / 3; i += 3) {
    faces.push([i, i + 1, i + 2]);
  }
  const shape = new CANNON.ConvexPolyhedron({
    vertices,
    faces,
  });
  return shape;
};

const dSize = 20;
const diePhysics = {
  [DiceType.D4]: {
    mass: 300,
    inertia: 5,
    radiusFactor: 1.2,
    marginFactor: null,
    mesh: new THREE.TetrahedronGeometry(dSize),
  },
  [DiceType.D6]: {
    mass: 300,
    inertia: 13,
    radiusFactor: 0.9,
    marginFactor: 1,
    shape: null,
    mesh: new THREE.BoxGeometry(dSize, dSize, dSize),
  },
  [DiceType.D8]: {
    mass: 340,
    inertia: 10,
    radiusFactor: 1,
    marginFactor: 1,
    shape: null,
    mesh: new THREE.OctahedronGeometry(dSize),
  },
  [DiceType.D10]: {
    mass: 340,
    inertia: 10,
    radiusFactor: 0.9,
    marginFactor: 1,
    shape: null,
    mesh: new PentagonalTrapezohedronGeometry(dSize),
  },
  [DiceType.D12]: {
    mass: 340,
    inertia: 10,
    radiusFactor: 0.9,
    marginFactor: 1,
    shape: null,
    mesh: new THREE.DodecahedronGeometry(dSize),
  },
  [DiceType.D20]: {
    mass: 340,
    inertia: 10,
    radiusFactor: 1,
    marginFactor: 1,
    shape: null,
    mesh: new THREE.IcosahedronGeometry(dSize),
  },
  [DiceType.D100]: {
    mass: 340,
    inertia: 10,
    radiusFactor: 0.9,
    marginFactor: 1.5,
    shape: null,
    mesh: new PentagonalTrapezohedronGeometry(dSize),
  },
};
