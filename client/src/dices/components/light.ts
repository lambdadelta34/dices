import * as THREE from "three";

export const createLight = (): THREE.Light => {
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-2, 3, 4);
  light.lookAt(0, 0, 0);
  return light;
};
