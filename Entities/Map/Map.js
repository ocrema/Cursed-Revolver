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
    //const playerSpawn = { x: 763, y: 1500 };
    // underground start
    const playerSpawn = { x: 12400, y: 4000 };
    // spider pit start
    //const playerSpawn = { x: 23532, y: 4760 };

    // Add colliders for death zones
    GAME_ENGINE.addEntity(new DeathCollider(2233, 2233, 5000, 50));
    GAME_ENGINE.addEntity(new DeathCollider(12870, 4338, 8000, 50));

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
        let stage = this.getStageFromPosition(spawn.x, spawn.y);
        const enemy = new entity(spawn.x, spawn.y + offsetY);
        enemy.stage = stage; // Associate enemy with stage
        enemy.onDeath = () => this.onEnemyDeath(enemy);

        this.stageEnemyGroups[stage].add(enemy);
        this.stageEnemyCounts[stage]++;
        this.totalEnemies++;
        GAME_ENGINE.addEntity(enemy);
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
    if (x > 11700 && y < 5000 && x < 20747) return 2;
    return 3;
  }

  spawnNextStageEnemies() {
    console.log(`Spawning enemies for stage ${this.currentStage}.`);
    const enemiesToSpawn = this.stageEnemyGroups[this.currentStage];

    if (!enemiesToSpawn) return;

    for (let enemy of enemiesToSpawn) {
      GAME_ENGINE.addEntity(enemy);
    }
  }

  onEnemyDeath(enemy) {
    if (!enemy.stage) return;

    const stageGroup = this.stageEnemyGroups[enemy.stage];
    if (stageGroup.has(enemy)) {
      stageGroup.delete(enemy);
      this.stageEnemyCounts[enemy.stage]--; // Always sync with Set size
      this.totalEnemies--;

      console.log(
        `Enemy from stage ${enemy.stage} eliminated. Remaining: ${stageGroup.size}`
      );

      if (stageGroup.size === 0) {
        this.onStageCleared(enemy.stage);
      }
    }
  }

  onStageCleared(stage) {
    console.log(`Stage ${stage} cleared.`);

    if (stage === 1) {
      const boulder = GAME_ENGINE.entities.find((e) => e instanceof Boulder);
      if (boulder) {
        console.log("Stage 1 cleared, activating boulder.");
        boulder.stageCleared();
      }
    }

    this.currentStage++;

    if (this.stageEnemyGroups[this.currentStage]) {
      this.spawnNextStageEnemies();
    } else {
      console.log("All stages cleared!");
    }
  }
}
