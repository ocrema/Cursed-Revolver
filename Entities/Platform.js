import { Entity } from "./Entities.js";
import { Collider } from "./Collider.js";
import { GROUND_TILE } from "../Globals/Constants.js";

export class Platform extends Entity {
  constructor(x, y, width, height, scale = 1) {
    super();
    this.x = x;
    this.y = y;
    this.width = width; // Number of tiles horizontally
    this.height = height; // The total height the row will stretch to
    this.scale = scale; // Scaling factor
    this.tileSize = 64 * this.scale; // Adjust tile size based on scale

    // Collider should match the actual drawn area
    this.collider = new Collider(
      this.width * this.tileSize,
      this.height * this.scale
    );
    this.assetManager = window.ASSET_MANAGER;
  }

  update() {
    this.updateAnimation(GAME_ENGINE.clockTick);
  }

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
        this.tileSize,
        this.height * this.scale // Scale properly
      );
    }
  }
}
