import { Entity } from "../Entities.js";
import { Collider } from "../Collider.js";
import { GAME_ENGINE } from "../../main.js";
import { EFFECTS_SPRITESHEET } from "../../Globals/Constants.js";

export class BarrelExplosionEffect extends Entity {
  constructor(x, y, scale = 5) {
    super();
    this.isEffect = true;
    this.x = x;
    this.y = y;
    this.entityOrder = 3;
    this.isAttack = true;
    this.assetManager = window.ASSET_MANAGER;

    // Explosion settings
    this.scale = scale;
    this.damage = 70;
    this.knockback = 3000;
    this.duration = 0.5;
    this.elapsedTime = 0;

    // Load explosion animation
    this.addAnimation(
      EFFECTS_SPRITESHEET.BARREL_EXPLOSION_SPRITESHEET.NAME,
      this.assetManager.getAsset(
        EFFECTS_SPRITESHEET.BARREL_EXPLOSION_SPRITESHEET.URL
      ),
      EFFECTS_SPRITESHEET.BARREL_EXPLOSION_SPRITESHEET.FRAME_WIDTH,
      EFFECTS_SPRITESHEET.BARREL_EXPLOSION_SPRITESHEET.FRAME_HEIGHT,
      EFFECTS_SPRITESHEET.BARREL_EXPLOSION_SPRITESHEET.FRAME_COUNT,
      EFFECTS_SPRITESHEET.BARREL_EXPLOSION_SPRITESHEET.FRAME_DURATION
    );

    this.setAnimation(
      EFFECTS_SPRITESHEET.BARREL_EXPLOSION_SPRITESHEET.NAME,
      false
    );

    // since we want some forgiveness with hitboxes we make the hitbox a little bit smaller than the visaul
    // just here since we want more control over hitbox scaling
    this.colliderScale = 0.9

    this.collider = new Collider(
      EFFECTS_SPRITESHEET.BARREL_EXPLOSION_SPRITESHEET.FRAME_WIDTH *
        this.scale *
        this.colliderScale,
      EFFECTS_SPRITESHEET.BARREL_EXPLOSION_SPRITESHEET.FRAME_HEIGHT *
        this.scale *
        this.colliderScale
    );

    // Trigger explosion damage
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

    for (let e of GAME_ENGINE.entities) {
      if (e.isActor && this.colliding(e)) {
        e.queueAttack({
          damage: this.damage,
          x: this.x,
          y: this.y,
          launchMagnitude: 0,
        });
      }
    }
  }

  onAnimationComplete() {
    this.removeFromWorld = true;
  }
}
