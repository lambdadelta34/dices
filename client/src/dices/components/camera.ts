import * as THREE from "three";
import { Centimeter } from "../types";

export const createCamera = ({
  fov = 75,
  aspect = 2,
  near = 0.1,
  far = 1,
}: {
  aspect?: number;
  fov?: number;
  near?: Centimeter;
  far?: Centimeter;
}): THREE.PerspectiveCamera => {
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  camera.position.z = 15;
  camera.lookAt(0, 0, 0);
  return camera;
};
