import { Entity } from "./Entities.js";
import { Collider } from "./Collider.js";
import { GROUND_SPRITESHEET } from "../Globals/Constants.js";

/**
 * Represents a platform entity in the game.
 * Platforms have two layers:
 * - A top layer (grass, stone top, etc.).
 * - A base layer (dirt, underground, etc.).
 */
export class Platform extends Entity {
  /**
   * Creates a new platform.
   * @param {number} x - The X-coordinate of the platform (centered).
   * @param {number} y - The Y-coordinate of the platform (centered).
   * @param {number} width - The number of tile units in width.
   * @param {number} height - The total height of the platform (scaled per tile).
   * @param {number} [scale=1] - The scaling factor for the platform's tile size.
   */
  constructor(x, y, width, height, scale = 0.25) {
    super();
    this.x = x;
    this.y = y;
    this.width = width; // Number of tiles horizontally
    this.height = height; // Number of tiles vertically
    this.scale = scale; // Scaling factor for the platform
    this.tileSize = 64 * this.scale; // Adjust tile size based on scale

    // Create a collider that matches the drawn area of the platform
    this.collider = new Collider(
      this.width * this.tileSize, // Collider width matches platform width
      this.height * this.tileSize // Collider height matches platform height
    );

    this.assetManager = window.ASSET_MANAGER;
  }

  /**
   * Updates the platform's animation (if any).
   * Platforms are typically static, but this method allows future dynamic behavior.
   */
  update() {
    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  /**
   * Draws the platform on the canvas with two distinct layers.
   * - Top layer uses `GROUND_TOP` texture.
   * - Base layers use `GROUND_BASE` texture.
   * @param {CanvasRenderingContext2D} ctx - The rendering context.
   */
  draw(ctx) {
    const topSprite = this.assetManager.getAsset(
      GROUND_SPRITESHEET.GROUND_TOP.URL
    );
    const baseSprite = this.assetManager.getAsset(
      GROUND_SPRITESHEET.GROUND_BOTTOM.URL
    );

    if (!topSprite || !baseSprite) {
      console.error("Sprite not loaded for Platform");
      return;
    }

    for (let col = 0; col < this.width; col++) {
      for (let row = 0; row < this.height; row++) {
        const sprite = row === 0 ? topSprite : baseSprite; // Top layer uses grass, others use dirt

        ctx.drawImage(
          sprite,
          0,
          0,
          16,
          16, // Source: original 16x16 tile
          this.x -
            GAME_ENGINE.camera.x +
            col * this.tileSize -
            (this.width * this.tileSize) / 2, // X position
          this.y -
            GAME_ENGINE.camera.y +
            row * this.tileSize -
            (this.height * this.tileSize) / 2, // Y position
          this.tileSize, // Width of each tile (scaled)
          this.tileSize // Height of each tile (scaled)
        );
      }
    }
  }
}
