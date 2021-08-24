import Stats from "three/examples/jsm/libs/stats.module.js";
import * as THREE from "three";
import { World } from "../types";
import CannonDebugRenderer from "../debug/debugRenderer";

export const render = (
  renderer: THREE.Renderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
): void => {
  if (resizeToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  renderer.render(scene, camera);
};

export const createRenderer = (
  container: HTMLCanvasElement,
): THREE.WebGLRenderer => {
  const renderer = new THREE.WebGLRenderer({
    canvas: container,
    // antialias: true,
    logarithmicDepthBuffer: true,
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  return renderer;
};

const resizeToDisplaySize = (renderer: THREE.Renderer): boolean => {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = (canvas.clientWidth * pixelRatio) | 0;
  const height = (canvas.clientHeight * pixelRatio) | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
};

export const animate = (world: World): void => {
  const clock = new THREE.Clock();
  const timeStep = 1 / 60;
  const stats = Stats();
  document.body.appendChild(stats.dom);

  const cannonDebugRenderer = new CannonDebugRenderer(
    world.scene,
    world.physicsWorld.physics,
  );
  const animateInner = () => {
    requestAnimationFrame(animateInner);

    cannonDebugRenderer.update();
    const delta = clock.getDelta();
    world.physicsWorld.physics.step(timeStep, delta);
    world.physicsWorld.dices.forEach((dice, i) => {
      // if (world.dices[i].object.name === "d4") {
      // console.log(dice.object.position.y);
      // console.log(world.dices[i].object.position.y);
      // }
      world.dices[i].object.position.set(
        dice.object.position.x,
        dice.object.position.y,
        dice.object.position.z,
      );
      world.dices[i].object.quaternion.set(
        dice.object.quaternion.x,
        dice.object.quaternion.y,
        dice.object.quaternion.z,
        dice.object.quaternion.w,
      );
    });
    stats.update();
    render(world.renderer, world.scene, world.camera);
  };
  requestAnimationFrame(animateInner);
};
