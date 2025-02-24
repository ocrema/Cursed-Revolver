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
    let oldMap = false;

    if (oldMap) {
      GAME_ENGINE.addEntity(new Player(1470, -70));
    } else {
      GAME_ENGINE.addEntity(new Player(763, 1500));
    }

    const backgroundList = Object.values(BACKGROUND_SPRITESHEET);
    GAME_ENGINE.addEntity(new Background(backgroundList));

    const TILESET_IMAGES = [
      window.ASSET_MANAGER.getAsset("./assets/map/Atlas.png"),
      window.ASSET_MANAGER.getAsset("./assets/map/CactusSpikes.png"),
      window.ASSET_MANAGER.getAsset("./assets/map/Saloon.png"),
      window.ASSET_MANAGER.getAsset("./assets/map/Signs.png"),
      window.ASSET_MANAGER.getAsset("./assets/map/props/tree04.png"),
      window.ASSET_MANAGER.getAsset(
        "./assets/map/SpawnPoints/PlayerSpawnPoint.png"
      ),
      window.ASSET_MANAGER.getAsset("./assets/map/Rock1.png"),
      window.ASSET_MANAGER.getAsset(
        "./assets/map/SpawnPoints/CactusSpawnPoint.png"
      ),
      window.ASSET_MANAGER.getAsset(
        "./assets/map/SpawnPoints/CowboySpawnPoint.png"
      ),
      window.ASSET_MANAGER.getAsset(
        "./assets/map/SpawnPoints/BirdSpawnPoint.png"
      ),
      window.ASSET_MANAGER.getAsset(
        "./assets/map/SpawnPoints/BarrelSpawnPoint.png"
      ),
      window.ASSET_MANAGER.getAsset(
        "./assets/map/SpawnPoints/BackgroundTrigger.png"
      ),
    ];

    let gameMap;

    if (oldMap) {
      gameMap = new Tilemap(
        "./Entities/Map/MapAssets/Map.json",
        TILESET_IMAGES
      );
    } else {
      gameMap = new Tilemap(
        "./Entities/Map/MapAssets/FinalMap.json",
        TILESET_IMAGES
      );
    }

    await gameMap.load();
    GAME_ENGINE.addEntity(gameMap);
    if (oldMap) {
      this.addOldMapEnemies();
      this.addOldMapObjects();
    } else {
      this.addCactusEnemies(gameMap);
      this.addCowboyEnemies(gameMap);
      this.addBirdEnemies(gameMap);
      this.addBarrelObjects(gameMap);
      this.addBackgroundTriggerObjects(gameMap);
    }
  }

  addBackgroundTriggerObjects(gameMap) {
    const backgroundTriggerPoints = gameMap.getBackgroundTriggerPoints();
    for (let spawn of backgroundTriggerPoints) {
      const backgroundTrigger = new BackgroundTriggerTile(spawn.x, spawn.y);
      GAME_ENGINE.addEntity(backgroundTrigger);
    }
  }

  addCactusEnemies(gameMap) {
    const enemySpawnPoints = gameMap.getCactusSpawnPoints();

    for (let spawn of enemySpawnPoints) {
      const enemy = new Cactus(spawn.x, spawn.y - 10);
      GAME_ENGINE.addEntity(enemy);
    }
  }

  addCowboyEnemies(gameMap) {
    const cowboySpawnPoints = gameMap.getCowboySpawnPoints();

    for (let spawn of cowboySpawnPoints) {
      const cowboy = new StaticCowboyEnemy(spawn.x, spawn.y - 10);
      GAME_ENGINE.addEntity(cowboy);
    }
  }

  addBirdEnemies(gameMap) {
    const birdSpawnPoints = gameMap.getBirdSpawnPoints();

    for (let spawn of birdSpawnPoints) {
      const bird = new Crow(spawn.x, spawn.y - 10);
      GAME_ENGINE.addEntity(bird);
    }
  }

  addBarrelObjects(gameMap) {
    const barrelSpawnPoints = gameMap.getBarrelSpawnPoints();

    for (let spawn of barrelSpawnPoints) {
      const barrel = new Barrel(spawn.x, spawn.y - 10);
      GAME_ENGINE.addEntity(barrel);
    }
  }

  addCactusEnemies(gameMap) {
    const enemySpawnPoints = gameMap.getCactusSpawnPoints();

    for (let spawn of enemySpawnPoints) {
      const enemy = new Cactus(spawn.x, spawn.y - 10);
      GAME_ENGINE.addEntity(enemy);
    }
  }

  addCowboyEnemies(gameMap) {
    const cowboySpawnPoints = gameMap.getCowboySpawnPoints();

    for (let spawn of cowboySpawnPoints) {
      const cowboy = new StaticCowboyEnemy(spawn.x, spawn.y - 10);
      GAME_ENGINE.addEntity(cowboy);
    }
  }

  addOldMapEnemies() {
    // Crow
    GAME_ENGINE.addEntity(new Crow(2500, -500));
    //GAME_ENGINE.addEntity(new Crow(4090, -200));

    // Spider
    GAME_ENGINE.addEntity(new Spider(2600, 200));
    //GAME_ENGINE.addEntity(new Spider(4262, 200));

    // Cacti
    GAME_ENGINE.addEntity(new Cactus(2300, 260));
    GAME_ENGINE.addEntity(new SpitterCactus(3000, 260));
    GAME_ENGINE.addEntity(new Cactus(4200, 260));
    

    // Cowboy Enemy
    GAME_ENGINE.addEntity(new CowboyEnemy(4115, 1330));
    GAME_ENGINE.addEntity(new StaticCowboyEnemy(836, 1443));
    GAME_ENGINE.addEntity(new StaticCowboyEnemy(2190, 1375));

    GAME_ENGINE.addEntity(new EarthGolem(4215, 1330));
  }

  addOldMapObjects() {
    GAME_ENGINE.addEntity(new Tumbleweed(3200, -100, "left"));
    GAME_ENGINE.addEntity(new Tumbleweed(4750, -100, "right"));
    GAME_ENGINE.addEntity(new Barrel(2569, 275));
    GAME_ENGINE.addEntity(new Barrel(2250, 1375));
    GAME_ENGINE.addEntity(new GrowingTree(1000, 300));
    //healing bottle
    GAME_ENGINE.addEntity(new HealingBottle(3200, 275));
  }
}
