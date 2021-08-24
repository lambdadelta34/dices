import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";
import { createWorld } from "./world";
import { animate } from "./graphics/renderer";
import { World, Dice } from "./types";

const main = async () => {
  const canvas: HTMLCanvasElement = document.querySelector("#scene");
  const world = await createWorld(canvas);

  new OrbitControls(world.camera, canvas);
  initGui(world);
  initCallbacks(world);
  animate(world);
};

const initCallbacks = (world: World) => {
  const raycaster = new THREE.Raycaster();
  const canvas = world.renderer.domElement;
  const onClick = (event: MouseEvent) => {
    findDice(canvas, raycaster, world.camera, world.dices, event);
  };
  canvas.addEventListener("click", onClick, false);
};

const findDice = (
  canvas: HTMLCanvasElement,
  raycaster: THREE.Raycaster,
  camera: THREE.PerspectiveCamera,
  dices: Dice[],
  event: MouseEvent,
) => {
  const mouse = {
    x: (event.clientX / canvas.clientWidth) * 2 - 1,
    y: -(event.clientY / canvas.clientHeight) * 2 + 1,
  };
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(
    dices.map(({ object }) => object),
    false,
  );
  if (intersects.length) {
    console.log(intersects[0].object);
    return intersects[0].object.userData;
  }
};

const initGui = (world: World) => {
  const gui = new GUI({ closed: true });
  world.dices.forEach((dice) => {
    const folder = gui.addFolder(dice.diceType);
    folder.add(dice.object.rotation, "x", 0, Math.PI * 2);
    folder.add(dice.object.rotation, "y", 0, Math.PI * 2);
    folder.add(dice.object.rotation, "z", 0, Math.PI * 2);
  });
};

main().catch((err) => {
  console.error(err);
});
