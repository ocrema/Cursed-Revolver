import { SpiderwebVisual } from "../../Objects/TileVisuals/SpiderwebVisual.js";
import { Collider } from "../../Collider.js";
import { Tile } from "./Tile.js";

export class SpiderwebTile extends Tile {
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
    this.scale = scale;
    this.isGround = true;
    this.isSpawnPoint = true;

    // Spawn a SpawnPoint entity for the visual effect
    this.spiderwebVisual = new SpiderwebVisual(this.x, this.y, this.scale);
    GAME_ENGINE.addEntity(this.spiderwebVisual);
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
      32,
      32,
      this.x - GAME_ENGINE.camera.x,
      this.y - GAME_ENGINE.camera.y,
      32 * this.scale,
      32 * this.scale // Apply scaling
    );
  }
}
6;
