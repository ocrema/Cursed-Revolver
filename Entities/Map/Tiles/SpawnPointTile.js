import { Collider } from "../../Collider.js";
import { Tile } from "./Tile.js";
import { Player } from "../../Player/Player.js";
import { SpawnPoint } from "../../Objects/TileVisuals/SpawnPoint.js";
import { GAME_ENGINE } from "../../../main.js";

export class SpawnPointTile extends Tile {
  constructor(
    x,
    y,
    tileID,
    tilesetImage,
    tileSize,
    tilesPerRow,
    firstGID,
    solidTiles,
    scale = 1
  ) {
    super();
    this.entityOrder = -99999;
    this.x = x;
    this.y = y - 35;
    this.tileID = tileID;
    this.tilesetImage = tilesetImage;
    this.tileSize = tileSize;
    this.tilesPerRow = tilesPerRow;
    this.firstGID = firstGID;
    this.scale = scale;
    this.isGround = true;
    this.isSpawnPoint = true;
    this.respawnX = this.x; // Track respawn X position
    this.killedEnemies = new Set(); // Track killed enemies
    this.respawnedEnemies = new Set(); // Track enemies that have been respawned
    this.isActivated = false;
    this.isTriggered = false;

    this.collider = new Collider(
      this.tileSize * this.scale * 4,
      this.tileSize * this.scale * 3
    );

    this.map = window.MAP;

    // Spawn a SpawnPoint entity for the visual effect
    this.spawnPointEntity = new SpawnPoint(this.x, this.y, this.scale);
    GAME_ENGINE.addEntity(this.spawnPointEntity);
  }

  update() {
    const player = window.PLAYER;

    if (player) {
      if (this.colliding(player) && !this.hasTriggered) {
        this.hasTriggered = true;
        console.log("Player hit checkpoint at " + this.x + " " + this.y);
        player.setSpawnPoint(this.x, this.y - player.collider.height / 2 - 1);
        this.spawnPointEntity.activateCampfire();
      }
    }
  }

  onEnemyDeath(enemy) {
    let enemyKey = `${enemy.x}-${enemy.y}`;

    if (enemy.x > this.respawnX) {
      console.log(`Tracking enemy death at ${enemyKey}`);
      this.killedEnemies.add(enemyKey);
    }
  }

  respawnEnemies() {
    if (!this.isActivated) return; // Only respawn enemies if the spawn point was activated

    console.log("Respawning enemies ahead of checkpoint:", this.respawnX);

    for (const stage in this.map.enemySpawnData) {
      for (let spawn of this.map.enemySpawnData[stage]) {
        let enemyKey = `${spawn.x}-${spawn.y}`;

        if (spawn.x > this.respawnX && !this.respawnedEnemies.has(enemyKey)) {
          console.log(`Respawning enemy at ${spawn.x}, ${spawn.y}`);

          let enemy = new spawn.type(spawn.x, spawn.y);
          enemy.onDeath = () => this.map.onEnemyDeath(enemy);
          GAME_ENGINE.addEntity(enemy);

          this.respawnedEnemies.add(enemyKey); // Mark this enemy as respawned
        }
      }
    }
  }
}
