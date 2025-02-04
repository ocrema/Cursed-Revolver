import { Entity } from "../Entities.js";
import { Collider } from "../Collider.js";
import { GAME_ENGINE } from "../../main.js";
import { EFFECTS_SPRITESHEET } from "../../Globals/Constants.js";

export class ExplosionEffect extends Entity {
  constructor(x, y, scale = 5) {
    super();
    this.x = x;
    this.y = y;
    this.entityOrder = 3; // Ensure explosion renders above most objects
    this.assetManager = window.ASSET_MANAGER;

    // Explosion settings
    this.scale = scale;
    this.damage = 15;
    this.knockback = 2000;
    this.duration = 0.5;
    this.elapsedTime = 0;

    // Load explosion animation
    this.addAnimation(
      EFFECTS_SPRITESHEET.FIREBALL_SPRITESHEET.NAME,
      this.assetManager.getAsset(EFFECTS_SPRITESHEET.FIREBALL_SPRITESHEET.URL),
      EFFECTS_SPRITESHEET.FIREBALL_SPRITESHEET.FRAME_WIDTH,
      EFFECTS_SPRITESHEET.FIREBALL_SPRITESHEET.FRAME_HEIGHT,
      EFFECTS_SPRITESHEET.FIREBALL_SPRITESHEET.FRAME_COUNT,
      EFFECTS_SPRITESHEET.FIREBALL_SPRITESHEET.FRAME_DURATION
    );
    this.setAnimation(EFFECTS_SPRITESHEET.FIREBALL_SPRITESHEET.NAME, false);

    // Explosion hitbox (radius based on scale)
    this.collider = new Collider(
      EFFECTS_SPRITESHEET.FIREBALL_SPRITESHEET.FRAME_WIDTH * this.scale,
      EFFECTS_SPRITESHEET.FIREBALL_SPRITESHEET.FRAME_HEIGHT * this.scale
    );

    // Trigger explosion effect
    this.explode();
  }

  update() {
    this.elapsedTime += GAME_ENGINE.clockTick;

    if (this.elapsedTime >= this.duration) {
      this.removeFromWorld = true; // Remove explosion after animation
    }

    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  explode() {
    // Play explosion sound
    window.ASSET_MANAGER.playAsset("./assets/sfx/explosion.wav");

    // Apply damage & knockback to all nearby actors
    for (let e of GAME_ENGINE.entities) {
      if (e.isActor && this.colliding(e)) {
        const angle = Math.atan2(e.y - this.y, e.x - this.x);
        e.queueAttack({
          damage: this.damage,
          x: this.x,
          y: this.y,
          launchMagnitude: this.knockback,
          launchAngle: angle, // Knockback direction
        });
      }
    }
  }

  onAnimationComplete() {
    this.removeFromWorld = true;
  }
}
