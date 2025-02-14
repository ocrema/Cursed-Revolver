import { Stampede } from "../Entities/Environment.js";
import { GAME_ENGINE } from "../main.js";

export class Events {
  static instance = null;
  constructor() {
    if (Events.instance) {
      return Events.instance;
    }
    Events.instance = this;

    this.time = 0;

    this.horseCooldown = 30;
  }

  update() {
    this.time += GAME_ENGINE.clockTick;

    if (this.time > this.horseCooldown) {
        this.time = 0;
        GAME_ENGINE.addEntity(new Stampede());
    }

  }

  // no need to draw
  draw() { 
  }

  static getInstance() {
    if (!Events.instance) {
      Events.instance = new Events();
    }
    return Events.instance;
  }
}
