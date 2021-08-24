import { createCamera } from "./graphics/components/camera";
import { createScene } from "./graphics/components/scene";
import { createLight } from "./graphics/components/light";
import { createRenderer } from "./graphics/renderer";
import { createDices } from "./graphics/components/dice";
import { createPhysics } from "./physics/engine";
import { World, Dice } from "./types";
import { createDices as createDebugDices } from "./debug/components/dice";

export const createWorld = async (
  container: HTMLCanvasElement,
): Promise<World> => {
  const renderer = createRenderer(container);
  const camera = createCamera({ fov: 60, near: 1, far: 1000 });
  const scene = createScene();
  const light = createLight();

  let dices: Dice[];
  if (process.env.DEBUG === "true") {
    dices = createDebugDices();
  } else {
    dices = await createDices();
    // scene.add(board);
  }

  dices.forEach((dice, i) => {
    // dice.castShadow = true;
    // dice.receiveShadow = true;
    dice.object.position.y = 500;
  });
  scene.add(light, ...dices.map(({ object }) => object));
  const physicsWorld = createPhysics(dices);

  return {
    renderer,
    camera,
    scene,
    dices,
    physicsWorld,
  };
};
