import { Entity } from "./Entities.js";
import { Collider } from "./Collider.js";
import { GROUND_SPRITESHEET } from "../Globals/Constants.js";
/**
 * Represents a platform with a two-layer tile system (top & base).
 * - Top layer (e.g., grass, stone top) uses a different tile.
 * - Base layers (e.g., dirt, underground) use another tile.
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
    this.height = height; // Number of tiles vertically
    this.scale = scale; // Scaling factor for the platform
    this.tileSize = 42 * this.scale; // New tile size based on extracted tile

    // Create a collider that matches the drawn area of the platform
    this.collider = new Collider(
      this.width * this.tileSize, // Collider width matches platform width
      this.height * this.tileSize // Collider height matches platform height
    );

    this.assetManager = window.ASSET_MANAGER;
  }

  /**
   * Updates the platform's animation (if any).
   */
  update() {
    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  /**
   * Draws the platform with two distinct layers.
   * - Top layer uses row 1, column 8 from the tileset.
   * - Base layers use row 2, column 8 from the tileset.
   * @param {CanvasRenderingContext2D} ctx - The rendering context.
   */
  draw(ctx) {
    const tileset = this.assetManager.getAsset(
      GROUND_SPRITESHEET.GROUND_TILESET.URL
    );
    if (!tileset) {
      console.error("Tileset not loaded for Platform");
      return;
    }

    // Define the source tile positions
    const tileWidth = 16;
    const tileHeight = 17;
    const topTileX = 112; // Column 8, Row 1
    const topTileY = 0;
    const baseTileX = 112; // Column 8, Row 2
    const baseTileY = 17;

    for (let col = 0; col < this.width; col++) {
      for (let row = 0; row < this.height; row++) {
        const sourceX = row === 0 ? topTileX : baseTileX; // Use grass for top row, dirt for others
        const sourceY = row === 0 ? topTileY : baseTileY;

        ctx.drawImage(
          tileset,
          sourceX,
          sourceY,
          tileWidth,
          tileHeight, // Source tile
          this.x -
            GAME_ENGINE.camera.x +
            col * this.tileSize -
            (this.width * this.tileSize) / 2, // X position
          this.y -
            GAME_ENGINE.camera.y +
            row * this.tileSize -
            (this.height * this.tileSize) / 2, // Y position
          this.tileSize * 2, // Scaled width
          this.tileSize * 2 // Scaled height
        );
      }
    }
  }
}
