import * as THREE from "three";
import { createCamera } from "./components/camera";
import { createScene } from "./components/scene";
import { createLight } from "./components/light";
import { render } from "./renderer";
import {
  createD4,
  createD6,
  createD8,
  createD10,
  createD12,
  createD20,
} from "./components/dice";

let renderer: THREE.Renderer;
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let _dices: THREE.Mesh[];

class Dices {
  constructor(container: HTMLCanvasElement) {
    renderer = new THREE.WebGLRenderer({
      canvas: container,
      logarithmicDepthBuffer: true,
    });
    camera = createCamera({ fov: 35, near: 1, far: 20 });
    scene = createScene();
    const light = createLight();
    scene.add(light);
    const size = 0.3;
    const material = new THREE.MeshPhysicalMaterial({
      color: "teal",
      side: THREE.DoubleSide,
    });

    const d4 = createD4(material, size);
    const d6 = createD6(material, size);
    const d8 = createD8(material, size);
    const d10 = createD10(material, size);
    const d12 = createD12(material, size);
    const d20 = createD20(material, size);
    const d100 = createD10(material, size);
    _dices = [d4, d6, d8, d10, d12, d20, d100];
    _dices.forEach((dice) => scene.add(dice));
    _dices.forEach((dice, i) => (dice.position.x = -3 + i));
  }

  render = (): void => {
    const animate = (time: number) => {
      time *= 0.001;
      _dices.forEach((dice, i) => {
        const speed = 1 + i * 0.1;
        const rot = time * speed;
        dice.rotation.x = rot;
        dice.rotation.y = rot;
      });

      render(renderer, scene, camera);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  };
}

export { Dices };