import * as THREE from "three";
import { createCamera } from "./camera";
import { createScene } from "./scene";
import { render } from "./renderer";
import { createDice } from "./dice";
import { PentagonalTrapezohedronGeometry } from "./pentagonal_trapezohedron_geometry";

function main() {
  const canvas: HTMLCanvasElement = document.querySelector("#canvas");
  const renderer = new THREE.WebGLRenderer({ canvas });
  const camera = createCamera({ far: 5 });
  camera.position.z = 3;
  const scene = createScene();
  scene.background = new THREE.Color(0xffffff);

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-2, 3, 4);
    light.lookAt(0, 0, 0);
    scene.add(light);
  }

  const size = 0.3;
  const material = new THREE.MeshPhysicalMaterial({
    color: "teal",
    side: THREE.DoubleSide,
  });
  const d4g = new THREE.TetrahedronGeometry(size);
  const d6g = new THREE.BoxGeometry(size, size, size);
  const d8g = new THREE.OctahedronGeometry(size);
  const d10g = new PentagonalTrapezohedronGeometry(size);
  const d12g = new THREE.DodecahedronGeometry(size);
  const d20g = new THREE.IcosahedronGeometry(size);

  const d4 = createDice(d4g, material);
  const d6 = createDice(d6g, material);
  const d8 = createDice(d8g, material);
  const d10 = createDice(d10g, material);
  const d12 = createDice(d12g, material);
  const d20 = createDice(d20g, material);
  const d100 = createDice(d10g, material);
  const dices = [d4, d6, d8, d10, d12, d20, d100];
  dices.forEach((dice) => scene.add(dice));
  dices.forEach((dice, i) => (dice.position.x = -3 + i));

  const animate = (time: number) => {
    time *= 0.001;
    dices.forEach((dice, i) => {
      const speed = 1 + i * 0.1;
      const rot = time * speed;
      dice.rotation.x = rot;
      dice.rotation.y = rot;
    });

    render(renderer, scene, camera);
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
}

main();
