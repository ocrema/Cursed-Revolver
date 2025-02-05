import { GameMap } from "../Entities.js";
import { Player } from "../Player/Player.js";
import { Background } from "./Background.js";
import { Cactus, Spider } from "../Enemy/Enemy.js";
import { Structure } from "./Structure.js";
import { GAME_ENGINE } from "../../main.js";
import { Platform } from "./Platform.js";
import { Barrel } from "../Objects/Barrel.js";
import { Tumbleweed } from "../Objects/Tumbleweed.js";

export class Map1 extends GameMap {
  load() {
    console.log("Loading Map 1");
    GAME_ENGINE.addEntity(new Player());
    GAME_ENGINE.addEntity(new Cactus(500, 380));
    GAME_ENGINE.addEntity(new Cactus(1000, 380));
    GAME_ENGINE.addEntity(new Cactus(-750, 380));
    GAME_ENGINE.addEntity(new Spider(800, 370));
    GAME_ENGINE.addEntity(new Background());

    // Ground
    GAME_ENGINE.addEntity(new Platform(0, 800, 100, 10));

    // Vertical Platform
    GAME_ENGINE.addEntity(new Platform(150, 400, 1, 6));

    // Horizontal Platform
    GAME_ENGINE.addEntity(new Platform(-300, 20, 10, 1));
    GAME_ENGINE.addEntity(new Platform(600, -160, 10, 1));

    // Destructible Objects
    GAME_ENGINE.addEntity(new Barrel(-300, 20));
    GAME_ENGINE.addEntity(new Barrel(1000, 0));
    GAME_ENGINE.addEntity(new Barrel(0, -40));

    GAME_ENGINE.addEntity(new Tumbleweed(100, 30, "right"));
  }
}
