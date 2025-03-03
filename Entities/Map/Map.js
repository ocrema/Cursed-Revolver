import { GameMap } from "../Entities.js";
import { Player } from "../Player/Player.js";
import { Background } from "./Background.js";
import { Cactus, SpitterCactus } from "../Enemy/Cactus.js";
import { Spider } from "../Enemy/Spider.js";
import { GAME_ENGINE } from "../../main.js";
import { Barrel } from "../Objects/Barrel.js";
import { Tumbleweed } from "../Objects/Tumbleweed.js";
import { CowboyEnemy } from "../Enemy/CowboyEnemy.js";
import { EarthGolem } from "../Enemy/EarthGolem.js";
import { StaticCowboyEnemy } from "../Enemy/StaticCowboyEnemy.js";
import { Crow } from "../Enemy/Crow.js";
import { Tilemap } from "./Tilemap.js";
import { GrowingTree } from "../Objects/GrowingTree.js";
import { HealingBottle } from "../../Entities/Enemy/HealingBottle.js";
import { BackgroundTriggerTile } from "./Tiles/BackgroundTriggerTile.js";
import { BACKGROUND_SPRITESHEET } from "../../Globals/Constants.js";

export class Map extends GameMap {
  async load() {
    const oldMap = false;
    const playerSpawn = oldMap ? { x: 1470, y: -70 } : { x: 763, y: 1500 };
    GAME_ENGINE.addEntity(new Player(playerSpawn.x, playerSpawn.y));

    GAME_ENGINE.addEntity(
      new Background(Object.values(BACKGROUND_SPRITESHEET))
    );

    const tilesetNames = [
      "Atlas.png",
      "CactusSpikes.png",
      "Saloon.png",
      "Signs.png",
      "props/tree04.png",
      "SpawnPoints/PlayerSpawnPoint.png",
      "Rock1.png",
      "SpawnPoints/CactusSpawnPoint.png",
      "SpawnPoints/CowboySpawnPoint.png",
      "SpawnPoints/BirdSpawnPoint.png",
      "SpawnPoints/BarrelSpawnPoint.png",
      "SpawnPoints/BackgroundTrigger.png",
      "SpawnPoints/TumbleweedSpawnPoint.png",
      "SpawnPoints/SpiderwebSpawnPoint.png",
      "SpawnPoints/SpiderSpawnPoint.png",
    ];

    const TILESET_IMAGES = tilesetNames.map((name) =>
      window.ASSET_MANAGER.getAsset(`./assets/map/${name}`)
    );

    const mapFilePath = oldMap
      ? "./Entities/Map/MapAssets/Map.json"
      : "./Entities/Map/MapAssets/FinalMap.json";

    const gameMap = new Tilemap(mapFilePath, TILESET_IMAGES);
    await gameMap.load();
    GAME_ENGINE.addEntity(gameMap);

    if (oldMap) {
      this.addOldMapEntities();
    } else {
      this.spawnEntities(gameMap);
    }
  }

  spawnEntities(gameMap) {
    const spawnFunctions = {
      Cactus: {
        method: gameMap.getCactusSpawnPoints,
        entity: Cactus,
        offsetY: -10,
      },
      Cowboy: {
        method: gameMap.getCowboySpawnPoints,
        entity: StaticCowboyEnemy,
        offsetY: -10,
      },
      Bird: { method: gameMap.getBirdSpawnPoints, entity: Crow, offsetY: -10 },
      Barrel: {
        method: gameMap.getBarrelSpawnPoints,
        entity: Barrel,
        offsetY: -10,
      },
      Tumbleweed: {
        method: gameMap.getTumbleweedTriggerPoints,
        entity: Tumbleweed,
        direction: "right",
      },
      BackgroundTrigger: {
        method: gameMap.getBackgroundTriggerPoints,
        entity: BackgroundTriggerTile,
      },
      Spider: {
        method: gameMap.getSpiderSpawnPoints,
        entity: Spider,
        offsetY: -10,
      },
    };

    for (const key in spawnFunctions) {
      const { method, entity, offsetY = 0, direction } = spawnFunctions[key];
      const spawnPoints = method.call(gameMap);
      for (let spawn of spawnPoints) {
        GAME_ENGINE.addEntity(
          new entity(spawn.x, spawn.y + offsetY, direction)
        );
      }
    }
  }

  addOldMapEntities() {
    const oldEnemies = [
      new Crow(2500, -500),
      new Spider(2600, 200),
      new Cactus(2300, 260),
      new SpitterCactus(3000, 260),
      new Cactus(4200, 260),
      new CowboyEnemy(4115, 1330),
      new StaticCowboyEnemy(836, 1443),
      new StaticCowboyEnemy(2190, 1375),
      new EarthGolem(4215, 1330),
    ];

    const oldObjects = [
      new Tumbleweed(3200, -100, "left"),
      new Tumbleweed(4750, -100, "right"),
      new Barrel(2569, 275),
      new Barrel(2250, 1375),
      new GrowingTree(1000, 300),
      new HealingBottle(3200, 275),
    ];

    [...oldEnemies, ...oldObjects].forEach((entity) =>
      GAME_ENGINE.addEntity(entity)
    );
  }
}
