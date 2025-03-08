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
import { Wizard } from "../Enemy/Wizard.js";

export class Map extends GameMap {
  constructor() {
    super();

    this.firstStageCleared = false;
    this.firstStageEnemies = new Set();

    this.secondStageCleared = false;
    this.secondStageEnemies = new Set();

    this.currentStage = 1;
    this.totalEnemies = 0;
  }

  async load() {
    const playerSpawn = { x: 763, y: 1500 };
    // first stage spawn point = { x: 763, y: 1500 }
    // second stage spawn point = { x: 12400, y: 4000 }
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
      "SpawnPoints/GrowingTreeSpawnPoint.png",
    ];

    const TILESET_IMAGES = tilesetNames.map((name) =>
      window.ASSET_MANAGER.getAsset(`./assets/map/${name}`)
    );

    const mapFilePath = "./Entities/Map/MapAssets/FinalMap.json";

    const gameMap = new Tilemap(mapFilePath, TILESET_IMAGES);
    await gameMap.load();
    GAME_ENGINE.addEntity(gameMap);
    this.spawnEntities(gameMap);
    GAME_ENGINE.addEntity(new Wizard());
  }

  spawnEntities(gameMap) {
    const enemySpawnFunctions = {
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

      Spider: {
        method: gameMap.getSpiderSpawnPoints,
        entity: Spider,
        offsetY: -10,
      },
    };

    const objectSpawnFunctions = {
      Tumbleweed: {
        method: gameMap.getTumbleweedTriggerPoints,
        entity: Tumbleweed,
        direction: "right",
      },
      BackgroundTrigger: {
        method: gameMap.getBackgroundTriggerPoints,
        entity: BackgroundTriggerTile,
      },
      Barrel: {
        method: gameMap.getBarrelSpawnPoints,
        entity: Barrel,
        offsetY: -10,
      },
      GrowingTree: {
        method: gameMap.getGrowingTreeSpawnPoints,
        entity: GrowingTree,
      },
    };

    for (const key in enemySpawnFunctions) {
      const {
        method,
        entity,
        offsetY = 0,
        direction,
      } = enemySpawnFunctions[key];
      const spawnPoints = method.call(gameMap);
      for (let spawn of spawnPoints) {
        const e = new entity(spawn.x, spawn.y + offsetY, direction);
        this.totalEnemies++;

        if (spawn.x < 11700 && spawn.y < 3000) {
          this.totalFirstStageEnemies++;
          console.log("Adding enemy to first stage enemy list.");
          this.firstStageEnemies.add(e);
        } else if (
          spawn.x > 11700 &&
          spawn.y > 3000 &&
          spawn.x < 30000 &&
          spawn.y < 5000
        ) {
          this.totalSecondStageEnemies++;
          console.log("Adding enemy to second stage enemy list.");
          this.secondStageEnemies.add(e);
        }

        e.onDeath = () => this.onEnemyDeath(e);

        GAME_ENGINE.addEntity(e);
      }
    }

    for (const key in objectSpawnFunctions) {
      const {
        method,
        entity,
        offsetY = 0,
        direction,
      } = objectSpawnFunctions[key];
      const spawnPoints = method.call(gameMap);
      for (let spawn of spawnPoints) {
        const e = new entity(spawn.x, spawn.y + offsetY, direction);
        GAME_ENGINE.addEntity(e);
      }
    }
  }

  onEnemyDeath(enemy) {
    if (this.firstStageEnemies.has(enemy)) {
      this.firstStageEnemies.delete(enemy);
      this.totalFirstStageEnemies--;
      console.log(
        `Enemy removed from firstStageEnemy list. Remaining: ${this.firstStageEnemies.size}`
      );

      if (this.firstStageEnemies.size === 0) {
        this.onFirstStageCleared();
      }
    }

    if (this.secondStageEnemies.has(enemy)) {
      this.secondStageEnemies.delete(enemy);
      this.totalSecondStageEnemies--;
      console.log(
        `Enemy removed from secondStageEnemy list. Remaining: ${this.secondStageEnemies.size}`
      );

      if (this.secondStageEnemies.size === 0) {
        this.onSecondStageCleared();
      }
    }
  }

  // put logic for breakable objects here - spiderweb, boulder etc
  onFirstStageCleared() {
    this.firstStageCleared = true; // Used to trigger events in the future
    console.log("All enemies on first stage cleared.");
    this.currentStage = 2;
  }

  onSecondStageCleared() {
    this.secondStageCleared = true; // Used to trigger events in the future
    this.currentStage = 3;
    console.log("All enemies on second stage cleared.");
  }
}
