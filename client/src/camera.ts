import * as THREE from "three";
import { Centimeter } from "./types";

export const createCamera = ({
  fov = 90,
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

  return camera;
};
