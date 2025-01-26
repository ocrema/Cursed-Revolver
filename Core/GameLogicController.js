import { Entity } from "../Entities/Entities.js";
import { Player } from "../Entities/Player.js";
import { Background } from "../Entities/Background.js";
import { GameMap } from "../Entities/Entities.js";

export class GameLogicController extends Entity {
  constructor() {
    super();
    this.GAME_ENGINE = window.GameEngine;
    this.entityOrder = -1;
    this.state = 0;
  }

  update() {
    if (this.state == 0) {
      this.state = 1;
      GAME_ENGINE.addEntity(new Player());
      GAME_ENGINE.addEntity(new Background());
      GAME_ENGINE.addEntity(new GameMap());
    }
  }
}
