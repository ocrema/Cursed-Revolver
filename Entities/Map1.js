import { GameMap } from "./Entities.js";
import { Player } from "./Player.js";
import { Background } from "./Background.js";
import { Cactus } from "./Enemy.js";
import { Platform } from "./Platform.js";

export class Map1 extends GameMap {
  load() {
    console.log("Loading Map 1");
    GAME_ENGINE.addEntity(new Player());
    GAME_ENGINE.addEntity(new Cactus());
    GAME_ENGINE.addEntity(new Background());
    // Platform Parameters - X, Y, Width, Height
    GAME_ENGINE.addEntity(new Platform(0, 400, 80, 80));
    GAME_ENGINE.addEntity(new Platform(800, -400, 5, 160));
  }
}
