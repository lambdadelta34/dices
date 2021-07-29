import { Dices } from "./dices/dices";

function main() {
  const canvas: HTMLCanvasElement = document.querySelector("#scene");
  const dices = new Dices(canvas);
  dices.render();
}

main();
