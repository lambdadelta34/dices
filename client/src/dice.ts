import * as THREE from "three";

export const createDice = (
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
): THREE.Mesh => {
  return new THREE.Mesh(geometry, material);
};
