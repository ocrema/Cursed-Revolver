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

    // Display on parents position
    this.x = this.parent.x + this.xOffset;
    this.y = this.parent.y + this.yOffset;

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

    this.spreadFire();

    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  /**
   * Logic for spreading fires to other entities.
   * Currently only considers enemies - ares
   */
  spreadFire() {
    for (let e of GAME_ENGINE.entities) {
      if (
        e.isEnemy && // Spreads only to enemy 
        e !== this.parent && // Don't spread to the parent itself
        e.collider && // Must have a collider
        !e.isBurning && // Must not already be burning
        this.parent.colliding(e) // Use parent's collider for fire spread
      ) {
        e.isBurning = true;
        GAME_ENGINE.addEntity(new BurningEffect(e));
      }
    }
  }
}
