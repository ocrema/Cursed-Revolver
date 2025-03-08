import { Tile } from "./Tile.js";

export class SaloonTile extends Tile {
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
    super(
      x,
      y,
      tileID,
      tilesetImage,
      tileSize,
      tilesPerRow,
      firstGID,
      solidTiles,
      scale
    );
    this.entityOrder = -9;
    this.scale = 5.5;
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
      256,
      144, // Full tile size
      this.x - GAME_ENGINE.camera.x,
      this.y - GAME_ENGINE.camera.y - 137 * this.scale, // Move up
      256 * this.scale,
      144 * this.scale // Apply scaling
    );
  }
}
