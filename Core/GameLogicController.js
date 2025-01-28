import { Entity } from "../Entities/Entities.js";
import { Player } from "../Entities/Player.js";
import { Map1 } from "../Entities/Map1.js";

export class GameLogicController extends Entity {
  constructor() {
    super();
    // Assigns game engine from window game engine singleton
    this.GAME_ENGINE = window.GameEngine;
    this.entityOrder = -1;
    this.state = 0;
  }

  update() {
    if (this.state == 0) {
      this.state = 1;
      this.map = new Map1();
      GAME_ENGINE.addEntity(this.map);
      this.map.load();
      
    }
  }
}
