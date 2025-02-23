import { Collider } from "../../Collider.js";
import { Tile } from "./Tile.js";
import { Player } from "../../Player/Player.js";

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
    this.entityOrder = -9;
    this.x = x;
    this.y = y;
    this.tileID = tileID;
    this.tilesetImage = tilesetImage;
    this.tileSize = tileSize;
    this.tilesPerRow = tilesPerRow;
    this.firstGID = firstGID;
    this.scale = scale; // Scale factor
    this.isGround = true;
    this.isSpawnPoint = true;

    this.collider = new Collider(
      this.tileSize * this.scale, // Scale width
      this.tileSize * this.scale // Scale height
    );
  }

  update() {
    for (let e of GAME_ENGINE.entities) {
      if (e instanceof Player && this.colliding(e)) {
        console.log("Player hit checkpoint at " + e.x + " " + e.y);
        e.setSpawnPoint(e.x, e.y);
      }
    }
  }

  draw(ctx) {
    if (!this.tilesetImage || this.tileID < this.firstGID) return;

    let tileIndex = this.tileID - this.firstGID;
    let tilesetX = (tileIndex % this.tilesPerRow) * this.tileSize;
    let tilesetY = Math.floor(tileIndex / this.tilesPerRow) * this.tileSize;

    // Adjust the drawing position to move it UP and RIGHT
    ctx.drawImage(
      this.tilesetImage,
      tilesetX,
      tilesetY,
      63,
      63, // Full tile size
      this.x - GAME_ENGINE.camera.x - 30 * this.scale,
      this.y - GAME_ENGINE.camera.y - 40 * this.scale, // Move up
      63 * this.scale,
      63 * this.scale // Apply scaling
    );
  }
}
