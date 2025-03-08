import { Entity } from "../../Entities.js";
import { Collider } from "../../Collider.js";
import { Player } from "../../Player/Player.js";

export class WaterTile extends Entity {
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
    this.isWater = true;

    this.collider = new Collider(
      this.tileSize * this.scale, // Scale width
      this.tileSize * this.scale // Scale height
    );
  }

  draw(ctx) {
    if (
      Math.abs(this.x - GAME_ENGINE.camera.x) > 1200 ||
      Math.abs(this.y - GAME_ENGINE.camera.y) > 700
    )
      return;
    if (!this.tilesetImage || this.tileID < this.firstGID) return;

    let tileIndex = this.tileID - this.firstGID;
    let tilesetX = (tileIndex % this.tilesPerRow) * this.tileSize;
    let tilesetY = Math.floor(tileIndex / this.tilesPerRow) * this.tileSize;

    // DO NOT TOUCH THESE VALUES - ARES
    ctx.drawImage(
      this.tilesetImage,
      tilesetX,
      tilesetY,
      16,
      16, // Source tile size (16x16)
      this.x - GAME_ENGINE.camera.x - (this.scale * this.tileSize) / 2,
      this.y - GAME_ENGINE.camera.y - (this.scale * this.tileSize) / 2,
      this.tileSize * this.scale + 1,
      this.tileSize * this.scale + 1 // Apply scaling
    );
  }
}
