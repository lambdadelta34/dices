import * as THREE from "three";
import { PentagonalTrapezohedronGeometry } from "../../graphics/components/pentagonal_trapezohedron_geometry";
import { Dice, DiceType } from "../../types";

export const createDices = (): Dice[] => {
  const size = 20;
  const material = new THREE.MeshPhysicalMaterial({
    color: "teal",
    side: THREE.DoubleSide,
  });

  const d4 = { object: createD4(material, size), diceType: DiceType.D4 };
  d4.object.position.x = -150;
  const d6 = { object: createD6(material, size), diceType: DiceType.D6 };
  d6.object.position.x = -100;
  const d8 = { object: createD8(material, size), diceType: DiceType.D8 };
  d8.object.position.x = -50;
  const d10 = { object: createD10(material, size), diceType: DiceType.D10 };
  d10.object.position.x = 0;
  const d12 = { object: createD12(material, size), diceType: DiceType.D12 };
  d12.object.position.x = 50;
  const d20 = { object: createD20(material, size), diceType: DiceType.D20 };
  d20.object.position.x = 100;
  const d100 = { object: createD10(material, size), diceType: DiceType.D100 };
  d100.object.position.x = 150;
  return [d4, d6, d8, d10, d12, d20, d100];
};

const createDice = (
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
): THREE.Mesh => {
  return new THREE.Mesh(geometry, material);
};

const createD4 = (material: THREE.Material, size: number): THREE.Mesh => {
  const geometry = new THREE.TetrahedronGeometry(size);
  return createDice(geometry, material);
};

const createD6 = (material: THREE.Material, size: number): THREE.Mesh => {
  const geometry = new THREE.BoxGeometry(size, size, size);
  return createDice(geometry, material);
};

const createD8 = (material: THREE.Material, size: number): THREE.Mesh => {
  const geometry = new THREE.OctahedronGeometry(size);
  return createDice(geometry, material);
};

const createD10 = (material: THREE.Material, size: number): THREE.Mesh => {
  const geometry = new PentagonalTrapezohedronGeometry(size);
  return createDice(geometry, material);
};

const createD12 = (material: THREE.Material, size: number): THREE.Mesh => {
  const geometry = new THREE.DodecahedronGeometry(size);
  return createDice(geometry, material);
};

const createD20 = (material: THREE.Material, size: number): THREE.Mesh => {
  const geometry = new THREE.IcosahedronGeometry(size);
  return createDice(geometry, material);
};
