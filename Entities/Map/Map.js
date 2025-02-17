import { GameMap } from "../Entities.js";
import { Player } from "../Player/Player.js";
import { Background } from "./Background.js";
import { Cactus } from "../Enemy/Cactus.js";
import { Spider } from "../Enemy/Spider.js";
import { GAME_ENGINE } from "../../main.js";
import { Barrel } from "../Objects/Barrel.js";
import { Tumbleweed } from "../Objects/Tumbleweed.js";
import { CowboyEnemy } from "../Enemy/CowboyEnemy.js";
import { Crow } from "../Enemy/Crow.js";
import { Tilemap } from "./Tilemap.js";

export class Map extends GameMap {
  async load() {
    // ground level is 80
    GAME_ENGINE.addEntity(new Player(1500, -200));
    GAME_ENGINE.addEntity(new Background());

    const TILESET_IMAGE = new Image();
    TILESET_IMAGE.src = "../../assets/map/Tileset/00Atlas.png";
    const gameMap = new Tilemap(
      "./Entities/Map/MapAssets/216Map.json",
      TILESET_IMAGE
    );
    await gameMap.load();
    GAME_ENGINE.addEntity(gameMap);

    this.addEnemies();
    addObjects();
  }

  addEnemies() {
    // Crow
    GAME_ENGINE.addEntity(new Crow(2500, -500));
    GAME_ENGINE.addEntity(new Crow(4090, -200));

    // Spider
    GAME_ENGINE.addEntity(new Spider(2600, 200));
    GAME_ENGINE.addEntity(new Spider(4262, 200));

    // Cacti
    GAME_ENGINE.addEntity(new Cactus(2300, 260));
    GAME_ENGINE.addEntity(new Cactus(3000, 260));
    GAME_ENGINE.addEntity(new Cactus(4200, 260));
  }
}
