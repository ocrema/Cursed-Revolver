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
import { BackgroundTriggerTile } from "./Tiles/BackgroundTriggerTile.js";
import { Boulder } from "../Objects/Boulder.js";
import { WebObstacle } from "../Objects/WebObstacle.js";
import { DeathCollider } from "./DeathCollider.js";

export class Map extends GameMap {
  constructor() {
    super();
    if (!window.MAP) {
      window.MAP = this;
    }

    this.currentStage = 1;
    this.totalEnemies = 0;

    this.stageEnemyGroups = { 1: new Set(), 2: new Set(), 3: new Set() };
    this.stageEnemyCounts = { 1: 0, 2: 0, 3: 0 };
    this.enemySpawnData = { 1: [], 2: [], 3: [] };

    return MAP;
  }

  async load() {
    const playerSpawn = { x: 763, y: 1500 };

    // Add colliders for death zones
    GAME_ENGINE.addEntity(new DeathCollider(2233, 2233, 5000, 50));
    GAME_ENGINE.addEntity(new DeathCollider(12870, 4338, 8000, 50));

    // Add static objects
    GAME_ENGINE.addEntity(new Boulder(23532, 5000));
    GAME_ENGINE.addEntity(new WebObstacle(23532, 4760));

    // Add player
    const player = GAME_ENGINE.addEntity(
      new Player(playerSpawn.x, playerSpawn.y)
    );

    // Add background
    GAME_ENGINE.addEntity(new Background(player));

    // Load map and tilesets
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
      "SpawnPoints/BoulderSpawnPoint.png",
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
    const enemyTypes = {
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

    const objectTypes = {
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
      Boulder: {
        method: gameMap.getBoulderSpawnPoints,
        entity: Boulder,
        offsetY: -50,
      },
    };

    // Spawn enemies
    for (const key in enemyTypes) {
      const { method, entity, offsetY = 0 } = enemyTypes[key];
      const spawnPoints = method.call(gameMap);

      for (let spawn of spawnPoints) {
        const enemy = new entity(spawn.x, spawn.y + offsetY);
        this.totalEnemies++;

        let stage = this.getStageFromPosition(spawn.x, spawn.y);
        this.enemySpawnData[stage].push({
          type: entity,
          x: spawn.x,
          y: spawn.y + offsetY,
        });

        this.stageEnemyGroups[stage].add(enemy);
        this.stageEnemyCounts[stage]++;

        enemy.onDeath = () => this.onEnemyDeath(enemy);
      }
    }

    // Spawn objects
    for (const key in objectTypes) {
      const { method, entity, offsetY = 0, direction } = objectTypes[key];
      const spawnPoints = method.call(gameMap);

      for (let spawn of spawnPoints) {
        const obj = new entity(spawn.x, spawn.y + offsetY, direction);
        GAME_ENGINE.addEntity(obj);
      }
    }

    this.spawnNextStageEnemies();
  }

  getStageFromPosition(x, y) {
    if (x < 11700 && y < 3000) return 1;
    if (x > 11700 && y < 5000) return 2;
    return 3;
  }

  spawnNextStageEnemies() {
    if (!this.enemySpawnData[this.currentStage]) return;

    console.log(`Spawning enemies for stage ${this.currentStage}.`);
    let spawnedCount = 0;
    for (let spawnData of this.enemySpawnData[this.currentStage]) {
      let enemy = new spawnData.type(spawnData.x, spawnData.y);
      spawnedCount++;
      enemy.onDeath = () => this.onEnemyDeath(enemy);
      GAME_ENGINE.addEntity(enemy);
    }

    console.log(`Stage ${this.currentStage} enemies spawned: ${spawnedCount}`);
  }

  onEnemyDeath(enemy) {
    for (const stage in this.enemySpawnData) {
      let index = this.enemySpawnData[stage].findIndex(
        (spawn) => spawn.x === enemy.x && spawn.y === enemy.y
      );
      if (index !== -1) {
        this.enemySpawnData[stage].splice(index, 1);
        this.stageEnemyCounts[stage]--;

        console.log(
          `Enemy at (${enemy.x}, ${enemy.y}) removed from stage ${stage}. Remaining: ${this.stageEnemyCounts[stage]}`
        );

        if (this.stageEnemyCounts[stage] === 0) {
          this.onStageCleared(stage);
        }
        return;
      }
    }
  }

  onStageCleared(stage) {
    console.log(`Stage ${stage} cleared.`);

    if (this.currentStage === 1) {
      const boulder = GAME_ENGINE.entities.find((e) => e instanceof Boulder);
      if (boulder) {
        console.log("Stage 1 cleared, activating boulder.");
        boulder.stageCleared();
      }
    }

    this.currentStage++;

    if (this.currentStage <= Object.keys(this.stageEnemyGroups).length) {
      this.spawnNextStageEnemies();
    } else {
      console.log("All stages cleared!");
    }
  }
}
