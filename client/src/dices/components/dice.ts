import * as THREE from "three";
import { PentagonalTrapezohedronGeometry } from "./pentagonal_trapezohedron_geometry";

const createDice = (
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
): THREE.Mesh => {
  return new THREE.Mesh(geometry, material);
};

export const createD4 = (
  material: THREE.Material,
  size: number,
): THREE.Mesh => {
  const geometry = new THREE.TetrahedronGeometry(size);
  return createDice(geometry, material);
};

export const createD6 = (
  material: THREE.Material,
  size: number,
): THREE.Mesh => {
  const geometry = new THREE.BoxGeometry(size, size, size);
  return createDice(geometry, material);
};

export const createD8 = (
  material: THREE.Material,
  size: number,
): THREE.Mesh => {
  const geometry = new THREE.OctahedronGeometry(size);
  return createDice(geometry, material);
};

export const createD10 = (
  material: THREE.Material,
  size: number,
): THREE.Mesh => {
  const geometry = new PentagonalTrapezohedronGeometry(size);
  return createDice(geometry, material);
};

export const createD12 = (
  material: THREE.Material,
  size: number,
): THREE.Mesh => {
  const geometry = new THREE.DodecahedronGeometry(size);
  return createDice(geometry, material);
};

export const createD20 = (
  material: THREE.Material,
  size: number,
): THREE.Mesh => {
  const geometry = new THREE.IcosahedronGeometry(size);
  return createDice(geometry, material);
};
