import { Entity } from "../Entities.js";
import { GAME_ENGINE } from "../../main.js";
import { EFFECTS_SPRITESHEET } from "../../Globals/Constants.js";

export class BurningEffect extends Entity {
  /**
   * Creates a burning effect attached to a parent entity.
   * @param {Entity} parent - The entity that this effect will follow (e.g., Tumbleweed).
   * @param {xOffset} - x offset of which effect is displayed
   * @param {yOffset} - y offset of which effect is displayed
   */
  constructor(parent, xOffset = 0, yOffset = 0) {
    super();
    this.parent = parent;
    this.entityOrder = parent.entityOrder + 1; // Render in front of the parent
    this.assetManager = window.ASSET_MANAGER;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.scale = 5; // Slightly larger than the object

    // Load burning animation
    this.addAnimation(
      EFFECTS_SPRITESHEET.BURNING_EFFECT.NAME,
      this.assetManager.getAsset(EFFECTS_SPRITESHEET.BURNING_EFFECT.URL),
      EFFECTS_SPRITESHEET.BURNING_EFFECT.FRAME_WIDTH,
      EFFECTS_SPRITESHEET.BURNING_EFFECT.FRAME_HEIGHT,
      EFFECTS_SPRITESHEET.BURNING_EFFECT.FRAME_COUNT,
      EFFECTS_SPRITESHEET.BURNING_EFFECT.FRAME_DURATION
    );

    this.setAnimation(EFFECTS_SPRITESHEET.BURNING_EFFECT.NAME, true);
  }

  update() {
    if (!this.parent || this.parent.removeFromWorld) {
      this.removeFromWorld = true; 
      return;
    }

    // Display on parents position 
    this.x = this.parent.x + this.xOffset;
    this.y = this.parent.y + this.yOffset;

    this.updateAnimation(GAME_ENGINE.clockTick);
  }
}
