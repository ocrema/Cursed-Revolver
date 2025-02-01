import { Entity } from "./Entities.js";
import { Collider } from "./Collider.js";
import { GROUND_TILE } from "../Globals/Constants.js";
import { BACKGROUND_SPRITESHEET } from "../Globals/Constants.js";

export class Platform extends Entity {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width; // Number of tiles horizontally
    this.height = height; // The total height the row will stretch to
    this.tileSize = 64; // Each tile's width remains 64px
    this.collider = new Collider(this.width * this.tileSize, this.height); // Collider fits the entire area
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
          (this.width * this.tileSize) / 2, // Adjust X to align top-left
        this.y - GAME_ENGINE.camera.y - this.height / 2, // Adjust Y to align top-left
        this.tileSize,
        this.height // Scale to stretch vertically
      );
    }
  }
}

