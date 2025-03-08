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
import { SpawnPointTile } from "./Tiles/SpawnPointTile.js";
import { Boulder } from "../Objects/Boulder.js";
import { WebObstacle } from "../Objects/WebObstacle.js";
import { Collider } from "../Collider.js";
import { DeathCollider } from "./DeathCollider.js";

export class Map extends GameMap {
  constructor() {
    super();
    if (!window.MAP) {
      window.MAP = this;
    }

    this.firstStageCleared = false;
    this.firstStageEnemies = new Set();

    this.secondStageCleared = false;
    this.secondStageEnemies = new Set();

    this.currentStage = 1;
    this.totalEnemies = 0;

    // Track enemies per stage
    this.stageEnemyGroups = {
      1: new Set(),
      2: new Set(),
      3: new Set(),
    };

    // Track enemy counts per stage
    this.stageEnemyCounts = {
      1: 0,
      2: 0,
      3: 0,
    };

    this.enemySpawnData = {
      1: [], // Store enemy data for each stage
      2: [],
      3: [],
    };

    this.gameMap = null; // Store reference to game map
    return MAP;
  }

  async load() {
    const playerSpawn = { x: 763, y: 1500 };

    //const playerSpawn = { x: 12400, y: 4000 };
    // spider pit
    //const playerSpawn = { x: 23532, y: 4760 };
    // first level death collider
    GAME_ENGINE.addEntity(new DeathCollider(2233, 2233, 5000, 50));
    GAME_ENGINE.addEntity(new DeathCollider(12870, 4338, 8000, 50));
    GAME_ENGINE.addEntity(new Boulder(23532, 5000));
    GAME_ENGINE.addEntity(new WebObstacle(23532, 4760));
    // first stage spawn point = { x: 763, y: 1500 }
    // second stage spawn point = { x: 12400, y: 4000 }

    const player = GAME_ENGINE.addEntity(
      new Player(playerSpawn.x, playerSpawn.y)
    );

    GAME_ENGINE.addEntity(new Background(player));

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
      "SpawnPoints/GolemSpawnPoint.png",
    ];

    const TILESET_IMAGES = tilesetNames.map((name) =>
      window.ASSET_MANAGER.getAsset(`./assets/map/${name}`)
    );

    const mapFilePath = "./Entities/Map/MapAssets/FinalMap.json";

    const gameMap = new Tilemap(mapFilePath, TILESET_IMAGES);
    await gameMap.load();
    GAME_ENGINE.addEntity(gameMap);
    this.spawnEntities(gameMap);
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
      Golem: {
        method: gameMap.getGolemSpawnPoints,
        entity: EarthGolem,
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
      const { method, entity, offsetY = 0 } = enemySpawnFunctions[key];
      const spawnPoints = method.call(gameMap);

      for (let spawn of spawnPoints) {
        const e = new entity(spawn.x, spawn.y + offsetY);
        this.totalEnemies++;

        let stage = this.getStageFromPosition(spawn.x, spawn.y);
        console.log(`Adding enemy to stage ${stage}.`);

        this.enemySpawnData[stage].push({
          type: entity,
          x: spawn.x,
          y: spawn.y + offsetY,
        });

        this.stageEnemyGroups[stage].add(e);
        this.stageEnemyCounts[stage]++;

        e.onDeath = () => this.onEnemyDeath(e);
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

    this.spawnNextStageEnemies();
  }

  getStageFromPosition(x, y) {
    if (x < 11700 && y < 3000) {
      return 1;
    } else if (x > 11700 && y < 5000) {
      return 2;
    } else {
      return 3;
    }
  }

  spawnNextStageEnemies() {
    if (!this.enemySpawnData[this.currentStage]) return;

    console.log(`Spawning enemies for stage ${this.currentStage}.`);

    for (let spawnData of this.enemySpawnData[this.currentStage]) {
      let enemy = new spawnData.type(spawnData.x, spawnData.y);
      enemy.onDeath = () => this.onEnemyDeath(enemy);
      GAME_ENGINE.addEntity(enemy);
    }
  }

  onEnemyDeath(enemy) {
    for (const stage in this.enemySpawnData) {
      for (let spawn of this.enemySpawnData[stage]) {
        if (spawn.x === enemy.x && spawn.y === enemy.y) {
          console.log(`Enemy removed from stage ${stage}.`);

          // Simply remove from the world (not tracked for respawn anymore)
          enemy.removeFromWorld = true;

          if (this.enemySpawnData[stage].length === 0) {
            this.onStageCleared(stage);
          }
          return;
        }
      }
    }
  }

  onStageCleared(stage) {
    console.log(
      `Stage ${stage} cleared. Total enemies eliminated: ${
        this.totalEnemies - this.stageEnemyCounts[stage]
      }`
    );

    this.currentStage++;

    if (this.currentStage <= Object.keys(this.stageEnemyGroups).length) {
      this.spawnNextStageEnemies();
    } else {
      console.log("All stages cleared!");
    }
  }
}
