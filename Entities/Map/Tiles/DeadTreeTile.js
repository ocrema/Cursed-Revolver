import { Tile } from "./Tile.js";

export class DeadTreeTile extends Tile {
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
    this.entityOrder = -8;
    this.scale = 8;
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
      48, // Full tile size
      this.x - GAME_ENGINE.camera.x - 30 * this.scale,
      this.y - GAME_ENGINE.camera.y - 44 * this.scale,
      32 * this.scale,
      48 * this.scale // Apply scaling
    );
  }
}
