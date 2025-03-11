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
import { DeathCollider } from "./DeathCollider.js";
import { SpiderWebObstacle } from "../Objects/SpiderWebObstacle.js";
import { Wizard } from "../Enemy/Wizard.js";
import { Camera } from "../../Core/Camera.js";

export class Map extends GameMap {
  constructor() {
    super();
    if (!window.MAP) {
      window.MAP = this;
    }

    this.currentStage = 1;
    this.totalEnemies = 0;
    this.stageEnemyGroups = {
      1: new Set(),
      2: new Set(),
      3: new Set(),
      4: new Set(),
      5: new Set(),
    };
    this.wizardTeleportPoints = [];
    this.stageEnemyCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    this.enemySpawnData = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    this.spiderwebList = [];
    this.spiderwebListIndex = 0;

    return MAP;
  }

  async load() {
    let playerSpawn;
    // saloon start
    playerSpawn = { x: 763, y: 1500 };

    //second campfire on stage 1
    //playerSpawn = { x: 8001, y: 1104 };
    // underground start
    //playerSpawn = { x: 12400, y: 4000 };

    // right before underground campfire at the end
    //playerSpawn = { x: 21000, y: 3000 };

    // spider pit start
    // playerSpawn = { x: 23532, y: 4760 };

    // GAME_ENGINE.addEntity(new Spider(23532, 4760));
    // GAME_ENGINE.addEntity(new Spider(23542, 4760));
    // GAME_ENGINE.addEntity(new Spider(23600, 4765));
    // GAME_ENGINE.addEntity(new Spider(23700, 4770));
    // GAME_ENGINE.addEntity(new Spider(23800, 4785));
    // GAME_ENGINE.addEntity(new Cactus(28025, 5153));
    // GAME_ENGINE.addEntity(new Spider(23532, 4760));
    // GAME_ENGINE.addEntity(new Spider(23542, 4760));
    // GAME_ENGINE.addEntity(new Spider(23600, 4765));
    // GAME_ENGINE.addEntity(new Spider(23700, 4770));
    // GAME_ENGINE.addEntity(new Spider(23800, 4785));
    // GAME_ENGINE.addEntity(new Cactus(28025, 5153));

    // second spider pit start
    //playerSpawn = { x: 23532, y: 6000 };

    // ascend start
    //playerSpawn = { x: 25918, y: 5100 };
    // boss arena spawn
    //playerSpawn = { x: 29000, y: 3015 };

    //GAME_ENGINE.addEntity(new Crow(26423, 2557));

    // Add colliders for death zones
    GAME_ENGINE.addEntity(new DeathCollider(2233, 2233, 5000, 50));
    GAME_ENGINE.addEntity(new DeathCollider(12870, 4338, 8000, 50));
    GAME_ENGINE.addEntity(new DeathCollider(25028, 6914, 4000, 50));

    // Add player
    const player = new Player(playerSpawn.x, playerSpawn.y);
    GAME_ENGINE.addEntity(player);

    // Add background
    const background = new Background(player);
    GAME_ENGINE.addEntity(background);

    window.PLAYER = player;

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
      "SpawnPoints/SpiderwebObstacleSpawnPoint.png",
      "SpawnPoints/MovingCowboySpawnPoint.png",
      "props/tree02.png",
      "Skull1.png",
      "Skull2.png",
      "SpawnPoints/WizardTeleportPoint.png",
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
        offsetY: -30,
      },
      Cowboy: {
        method: gameMap.getCowboySpawnPoints,
        entity: StaticCowboyEnemy,
        offsetY: -15,
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
      MovingCowboy: {
        method: gameMap.getMovingCowboySpawnPoints,
        entity: CowboyEnemy,
        offsetY: -15,
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
        offsetY: -25,
      },
      GrowingTree: {
        method: gameMap.getGrowingTreeSpawnPoints,
        entity: GrowingTree,
        offsetY: 50,
      },
      Boulder: {
        method: gameMap.getBoulderSpawnPoints,
        entity: Boulder,
        offsetY: -50,
      },
      SpiderwebObstacle: {
        method: gameMap.getSpiderwebObstacleSpawnPoints,
        entity: SpiderWebObstacle,
        offsetY: -50,
      },
    };

    const points = gameMap.getWizardTeleportPoints();
    for (let i = 0; i < points.length; i++) {
      this.wizardTeleportPoints.push(points[i]);
    }

    GAME_ENGINE.addEntity(new Wizard(31437, 2698));

    // Spawn enemies
    for (const key in enemyTypes) {
      const { method, entity, offsetY = 0 } = enemyTypes[key];
      const spawnPoints = method.call(gameMap);

      for (let spawn of spawnPoints) {
        let stage = this.getStageFromPosition(spawn.x, spawn.y);

        // Store enemy spawn data but only spawn stage 1 initially
        const enemy = new entity(spawn.x, spawn.y + offsetY);
        enemy.stage = stage;
        enemy.onDeath = () => this.onEnemyDeath(enemy);
        this.stageEnemyGroups[stage].add(enemy);
        this.stageEnemyCounts[stage]++;

        if (stage === 1) {
          this.totalEnemies++;
          GAME_ENGINE.addEntity(enemy);
        }
      }
    }

    // Spawn objects
    for (const key in objectTypes) {
      const { method, entity, offsetY = 0, direction } = objectTypes[key];
      const spawnPoints = method.call(gameMap);

      for (let spawn of spawnPoints) {
        const obj = new entity(spawn.x, spawn.y + offsetY, direction);

        if (obj instanceof SpiderWebObstacle) {
          this.spiderwebList.push(obj);
        }

        GAME_ENGINE.addEntity(obj);
      }
    }

    this.spawnNextStageEnemies();
  }

  getStageFromPosition(x, y) {
    if (x < 12000) return 1; // Before Boulder
    if (x > 11700 && y < 5000 && x < 20747) return 2; // After Boulder, before SpiderWeb 1
    if (x > 21095 && x < 24000 && y < 5000) return 3; // After SpiderWeb 1, before SpiderWeb 2
    if (x > 21095 && x < 24000 && y > 5000) return 4; // After SpiderWeb 2, before SpiderWeb 3
    return 5;
  }

  spawnNextStageEnemies() {
    let spawnCounter = 0;
    console.log(`Spawning enemies for stage ${this.currentStage}.`);
    const enemiesToSpawn = this.stageEnemyGroups[this.currentStage];

    if (!enemiesToSpawn) return;

    for (let enemy of enemiesToSpawn) {
      spawnCounter++;
      console.log(`Spawning enemy at ${enemy.x}, ${enemy.y}`);
      GAME_ENGINE.addEntity(enemy);
    }
    console.log(`Total Spawned Enemy for stage: ${spawnCounter}`);
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
    } else {
      console.log(this.spiderwebList[this.spiderwebListIndex]);
      this.spiderwebList[this.spiderwebListIndex].stageCleared();
      this.spiderwebListIndex++;
    }

    this.currentStage++;

    if (this.stageEnemyGroups[this.currentStage]) {
      this.spawnNextStageEnemies();
    } else {
      console.log("All stages cleared!");
    }
  }
}
