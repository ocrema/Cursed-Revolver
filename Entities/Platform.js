import { Entity } from "./Entities.js";
import { Collider } from "./Collider.js";
import { GROUND_TILE } from "../Globals/Constants.js";

/**
 * Represents a platform entity in the game.
 * Platforms serve as static structures that the player can stand on or interact with.
 * They can be scaled and tiled horizontally to create larger surfaces.
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
  constructor(x, y, width, height, scale = 1) {
    super();
    this.x = x;
    this.y = y;
    this.width = width; // Number of tiles horizontally
    this.height = height; // The total height the row will stretch to
    this.scale = scale; // Scaling factor for the platform
    this.tileSize = 64 * this.scale; // Adjust tile size based on scale

    // Create a collider that matches the drawn area of the platform
    this.collider = new Collider(
      this.width * this.tileSize, // Collider width matches platform width
      this.height * this.scale // Collider height matches scaled height
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
   * Draws the platform on the canvas, repeating the tile texture across its width.
   * @param {CanvasRenderingContext2D} ctx - The rendering context.
   */
  draw(ctx) {
    const sprite = this.assetManager.getAsset(GROUND_TILE.URL);
    if (!sprite) {
      console.error("Sprite not loaded for Platform");
      return;
    }

    // Number of tiles to draw horizontally
    const cols = this.width;

    for (let col = 0; col < cols; col++) {
      ctx.drawImage(
        sprite,
        0,
        0,
        16,
        16, // Source: original 16x16 tile
        this.x -
          GAME_ENGINE.camera.x +
          col * this.tileSize -
          (this.width * this.tileSize) / 2, // X position (starts from the actual left)
        this.y - GAME_ENGINE.camera.y - this.height / 2, // Y position starts from the actual top
        this.tileSize, // Width of each tile (scaled)
        this.height * this.scale // Height is stretched based on the scale
      );
    }
  }
}
