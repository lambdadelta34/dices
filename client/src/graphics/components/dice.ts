import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Dice, DiceType } from "../../types";

export const createDices = async (): Promise<Dice[]> => {
  const loader = new GLTFLoader();
  const dicesData = await loader.loadAsync("/assets/models/dices.glb");

  const d4 = {
    object: dicesData.scene.children.find(({ name }) => name === "d4"),
    diceType: DiceType.D4,
  };
  const d6 = {
    object: dicesData.scene.children.find(({ name }) => name === "d6"),
    diceType: DiceType.D6,
  };
  const d8 = {
    object: dicesData.scene.children.find(({ name }) => name === "d8"),
    diceType: DiceType.D8,
  };
  const d10 = {
    object: dicesData.scene.children.find(({ name }) => name === "d10"),
    diceType: DiceType.D10,
  };
  const d12 = {
    object: dicesData.scene.children.find(({ name }) => name === "d12"),
    diceType: DiceType.D12,
  };
  const d20 = {
    object: dicesData.scene.children.find(({ name }) => name === "d20"),
    diceType: DiceType.D20,
  };
  const d100 = {
    object: dicesData.scene.children.find(({ name }) => name === "d100"),
    diceType: DiceType.D100,
  };
  // const board = dicesData.scene.children.find(({ name }) => name === "board");
  return [d4, d6, d8, d10, d12, d20, d100];
};
