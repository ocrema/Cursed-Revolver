import { GameMap } from "../Entities.js";
import { Player } from "../Player/Player.js";
import { Background } from "./Background.js";
import { Cactus } from "../Enemy/Cactus.js";
import { Spider } from "../Enemy/Spider.js";
import { GAME_ENGINE } from "../../main.js";
import { Barrel } from "../Objects/Barrel.js";
import { Tumbleweed } from "../Objects/Tumbleweed.js";
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
  }
}
