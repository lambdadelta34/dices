import * as THREE from "three";
import * as CANNON from "cannon-es";

export interface Dice {
  diceType: DiceType;
  object: THREE.Object3D;
}

export interface DicePhysics {
  diceType: DiceType;
  object: CANNON.Body;
}

export interface PhysicsWorld {
  physics: CANNON.World;
  dices: DicePhysics[];
}

export interface World {
  renderer: THREE.Renderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  dices: Dice[];
  physicsWorld: PhysicsWorld;
}

export enum DiceType {
  D4 = "D4",
  D6 = "D6",
  D8 = "D8",
  D10 = "D10",
  D12 = "D12",
  D20 = "D20",
  D100 = "D100",
}

export type Centimeter = number;
