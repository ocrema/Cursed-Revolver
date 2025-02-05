import { Entity } from "../Entities.js";
import { GAME_ENGINE } from "../../main.js";
import { EFFECTS_SPRITESHEET } from "../../Globals/Constants.js";

export class BurningEffect extends Entity {
  /**
   * Creates a burning effect attached to a parent entity.
   * @param {Entity} parent - The entity that this effect will follow (e.g., Tumbleweed).
   * @param {number} xOffset - X offset of the effect.
   * @param {number} yOffset - Y offset of the effect.
   */
  constructor(parent, xOffset = 0, yOffset = 0) {
    super();
    this.parent = parent;
    this.entityOrder = parent.entityOrder + 1; // Render in front of the parent
    this.assetManager = window.ASSET_MANAGER;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.scale = 4;
    // Scales fire to parent collider scale so fire will be proportinate
    this.adjustToParentColliderScale = 1.5;

    if (parent.collider) {
      this.updateVisualScale();
    }

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

    if (this.parent.collider) {
      this.updateVisualScale();
    }

    this.spreadFire();
    this.updateAnimation(GAME_ENGINE.clockTick);

    // placed after since spreadfire needs to actually initialize the burn effect if there is any
    if (this.parent && this.parent.isEnemy && this.parent.effects.burn <= 0) {
      this.removeFromWorld = true;
      return;
    }
  }

  /**
   * Logic for spreading fires to other entities.
   * Currently only considers enemies & other tumbleweeds.
   */
  spreadFire() {
    for (let e of GAME_ENGINE.entities) {
      if (
        e !== this.parent && // Don't spread to the parent itself
        e.collider && // Must have a collider
        !e.isBurning && // Must not already be burning
        this.parent.colliding(e) // Use parent's collider for fire spread
      ) {
        // Spreads to enemies and tumbleweeds
        if (e.isEnemy && (!e.effects.burn || e.effects.burn <= 0)) {
          e.isBurning = true;
          e.effects.burn = 5; // 5 seconds of burn
          GAME_ENGINE.addEntity(new BurningEffect(e));
        } else if (e.isTumbleweed) {
          e.isBurning = true;
          GAME_ENGINE.addEntity(new BurningEffect(e));
        }
      }
    }
  }

  /**
   * Scales fire visuals. First scales fire effect to be a dynamic percentage of the parents collider so its proportinate.
   * Also adjusts y offset so the fire effect will be placed correctly.
   */
  updateVisualScale() {
    // Update scale dynamically if parent's collider changes
    this.scaleX = this.parent.collider.width * this.adjustToParentColliderScale;
    this.scaleY =
      this.parent.collider.height * this.adjustToParentColliderScale;
    this.yOffset = -this.parent.collider.height / 2;
    this.x = this.parent.x + this.xOffset;
    this.y = this.parent.y + this.yOffset;
  }

  draw(ctx) {
    if (!this.currentAnimation) return;
    const animation = this.animations[this.currentAnimation];
    const { spritesheet, frameWidth, frameHeight } = animation;

    if (!spritesheet) return;

    ctx.save();
    ctx.translate(this.x - GAME_ENGINE.camera.x, this.y - GAME_ENGINE.camera.y);
    ctx.scale(this.scaleX / frameWidth, this.scaleY / frameHeight);
    ctx.drawImage(
      spritesheet,
      this.currentFrame * frameWidth, // Source X
      0, // Source Y
      frameWidth, // Source Width
      frameHeight, // Source Height
      -frameWidth / 2, // Destination X (centered)
      -frameHeight / 2, // Destination Y (centered)
      frameWidth, // Destination Width
      frameHeight // Destination Height
    );
    ctx.restore();
  }

  /**
   * Logic for spreading fires to other entities.
   * Currently only considers enemies - ares
   */
  spreadFire() {
    for (let e of GAME_ENGINE.entities) {
      if (
        e.isEnemy &&
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
