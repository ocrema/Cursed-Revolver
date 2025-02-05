import { Entity } from "../Entities.js";
import { GAME_ENGINE } from "../../main.js";
import { EFFECTS_SPRITESHEET } from "../../Globals/Constants.js";

export class BurningEffect extends Entity {
  /**
   * Creates a burning effect attached to a parent entity.
   * @param {Entity} parent - The entity that this effect will follow (e.g., Tumbleweed).
   */
  constructor(parent) {
    super();
    this.parent = parent;
    this.entityOrder = parent.entityOrder + 1; // Render in front of the parent
    this.assetManager = window.ASSET_MANAGER;
    this.scale = 1.2; // Slightly larger than the object

    // Load burning animation
    this.addAnimation(
      EFFECTS_SPRITESHEET.BURNING.NAME,
      this.assetManager.getAsset(EFFECTS_SPRITESHEET.BURNING.URL),
      EFFECTS_SPRITESHEET.BURNING.FRAME_WIDTH,
      EFFECTS_SPRITESHEET.BURNING.FRAME_HEIGHT,
      EFFECTS_SPRITESHEET.BURNING.FRAME_COUNT,
      EFFECTS_SPRITESHEET.BURNING.FRAME_DURATION
    );

    this.setAnimation(EFFECTS_SPRITESHEET.BURNING.NAME, true);
  }

  update() {
    if (!this.parent || this.parent.removeFromWorld) {
      this.removeFromWorld = true; // Remove effect when parent is gone
      return;
    }

    // Follow the parent entity's position
    this.x = this.parent.x;
    this.y = this.parent.y;

    this.updateAnimation(GAME_ENGINE.clockTick);
  }
}
