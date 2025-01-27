import { Entity } from "../Entities/Entities.js";
import { Player } from "../Entities/Player.js";
import { Background } from "../Entities/Background.js";
import { GameMap } from "../Entities/Entities.js";
import { newCollider } from "../Utils/Util.js";

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
      GAME_ENGINE.addEntity(new Player());
      GAME_ENGINE.addEntity(new Background());
      //GAME_ENGINE.addEntity(new GameMap());
      const floor = new Entity();
      floor.x = 0;
      floor.y = 400;
      floor.draw = (ctx) => {
        ctx.fillStyle = "lightgray";
        ctx.fillRect(floor.x - 1000 - GAME_ENGINE.camera.x, floor.y - 50 - GAME_ENGINE.camera.y, 2000, 100);
      }
      floor.colliders = [newCollider(2000, 100, 0, 0)];
      GAME_ENGINE.addEntity(floor);
    }
  }
}
