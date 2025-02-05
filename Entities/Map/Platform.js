import { Entity } from "../Entities.js";
import { Collider } from "../Collider.js";
import { GROUND_SPRITESHEET } from "../../Globals/Constants.js";

/**
 * Represents a platform with separate top and base layers.
 * - If `rows === 1`, only the top tile is used.
 * - Otherwise, top uses `GROUND_TOP`, and bottom layers use `GROUND_BOTTOM`.
 */
export class Platform extends Entity {
  /**
   * Creates a new platform.
   * @param {number} x - The X-coordinate of the platform (centered).
   * @param {number} y - The Y-coordinate of the platform (centered).
   * @param {number} cols - The number of tiles horizontally.
   * @param {number} rows - The number of tiles vertically.
   */
  constructor(x, y, cols, rows) {
    super();
    this.x = x;
    this.y = y;
    this.cols = cols; // Number of tiles horizontally
    this.rows = rows; // Number of tiles vertically
    this.tileSize = 64; // Each tile will be scaled to 64x64
    this.isGround = true;

    // Fix Collider to Match Drawn Tile Size
    this.collider = new Collider(
      this.cols * this.tileSize, // Correct width
      this.rows * this.tileSize // Correct height
    );

    this.assetManager = window.ASSET_MANAGER;
  }

  /**
   * Updates the platform (currently static).
   */
  update() {
    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  /**
   * Draws the platform with correctly scaled tiles.
   * - Top layer uses `GROUND_TOP`.
   * - Base layers use `GROUND_BOTTOM`.
   * @param {CanvasRenderingContext2D} ctx - The rendering context.
   */
  draw(ctx) {
    const topTile = this.assetManager.getAsset(
      GROUND_SPRITESHEET.GROUND_TOP.URL
    );
    const baseTile = this.assetManager.getAsset(
      GROUND_SPRITESHEET.GROUND_BOTTOM.URL
    );

    if (!topTile || !baseTile) {
      console.error("Ground tiles not loaded for Platform");
      return;
    }

    ctx.imageSmoothingEnabled = false; // Prevents blurry tiles

    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        const isTopRow = row === 0; // First row is grass, others are dirt
        const tileImage = isTopRow ? topTile : baseTile;

        ctx.drawImage(
          tileImage,
          0,
          0,
          16,
          16, // Source tile size (16x16)
          this.x -
            GAME_ENGINE.camera.x +
            col * this.tileSize -
            (this.cols * this.tileSize) / 2,
          this.y -
            GAME_ENGINE.camera.y +
            row * this.tileSize -
            (this.rows * this.tileSize) / 2,
          this.tileSize,
          this.tileSize
        );
      }
    }
  }
}
