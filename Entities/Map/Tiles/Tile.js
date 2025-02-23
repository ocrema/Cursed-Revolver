import { Entity } from "../../Entities.js";
import { Collider } from "../../Collider.js";

export class Tile extends Entity {
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

    // 6 is the like internal block
    // 74 is where the like grass blocks start
    // 100 is where other external tilesets start from
    if (this.tileID !== 6 && this.tileID < 74) {
      this.collider = new Collider(
        this.tileSize * this.scale, // Scale width
        this.tileSize * this.scale // Scale height
      );
    }

    if (this.tileID < 74 && this.tileID >= 87) {
      this.entityOrder = -8;
    }
  }

  draw(ctx) {
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
      this.x -
        GAME_ENGINE.camera.x -
        ((this.scale - 1) * this.tileSize) / 2 -
        1 * this.scale,
      this.y -
        GAME_ENGINE.camera.y -
        ((this.scale - 1) * this.tileSize) / 2 -
        1 * this.scale,
      this.tileSize * this.scale,
      this.tileSize * this.scale // Apply scaling
    );
  }
}
