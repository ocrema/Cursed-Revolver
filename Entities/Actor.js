import { EFFECTS_SPRITESHEET } from "../Globals/Constants.js";
import { GAME_ENGINE } from "../main.js";
import * as Util from "../Utils/Util.js";
import { VoidExplosion } from "./Effects/VoidExplosion.js";
import { Entity } from "./Entities.js";

export class Actor extends Entity {
  constructor() {
    super();
    this.isActor = true;
    this.recieved_attacks = [];
    this.effects = [];
    this.velocityY = 0; // Vertical velocity
    this.gravityForce = 1000; // Gravity force
    this.grounded = false; // Whether the actor is on the ground
    this.health = 100; // Actor's health
    this.validEffects = {
      burn: true,
      shock: true,
      soaked: true,
      frozen: true,
      rooted: true,
      stun: true,
      void: true,
      void_delay: true,
    };
    this.isLaunchable = false;
    this.effect_anim_timer = 0;
  }

  // Since actor classes might need more functionalities, we can add them here
  // Gravity, attacks, etc
  update() {}

  applyGravity(gravityAmount) {
    if (!this.grounded) {
      // Apply gravity to vertical velocity
      this.velocityY += this.gravity * GAME_ENGINE.clockTick;

      // Update position based on velocity
      this.y += this.velocityY * GAME_ENGINE.clockTick;
    }
  }

  queueAttack(data) {
    this.recieved_attacks.push(data);
  }

  recieveAttacks() {
    for (const a of this.recieved_attacks) {
      for (const [k, v] of Object.entries(a)) {
        if (k === "damage") {
          this.health -= v;
          window.ASSET_MANAGER.playAsset("./assets/sfx/hitsound.ogg", 1);
        } else if (k === "heal") {
          this.health += v;
        } else if (k === "launchMagnitude" && this.isLaunchable) {
          let angle;
          if (a.dir) 
            angle = a.dir;
          else
            angle = Util.getAngle({ x: a.x, y: a.y }, this);
          this.x_velocity += v * Math.cos(angle);
          this.y_velocity += v * Math.sin(angle);
        } else if (k === "x" || k === "y" || k === 'dir') {
        } else if (this.validEffects[k]) {
          this.effects[k] = Math.max(this.effects[k] || 0, v);
          if (k === "frozen")
            window.ASSET_MANAGER.playAsset(
              "./assets/sfx/frozen.wav",
              1 * Util.DFCVM(this)
            );
        }
      }
    }
    // extra logic
    if (this.effects.soaked > 0) {
      this.effects.burn = 0;
    }
    if (this.effects.frozen > 0) {
      this.effects.frozen = Math.max(this.effects.frozen, this.effects.soaked);
      this.effects.soaked = 0;
    }
    if (this.effects.burn > 0 && this.effects.frozen > 0) {
      this.effects.frozen = 0;
      this.effects.burn = 0;
      this.health -= 50;
      window.ASSET_MANAGER.playAsset(
        "./assets/sfx/temp_shock.ogg",
        1 * Util.DFCVM(this)
      );
    }
    if (
      this.effects.void > 0 &&
      (!this.effects.void_delay || this.effects.void_delay <= 0) &&
      (this.effects.burn > 0 || this.effects.shock > 0)
    ) {
      this.effects.shock = 0;
      this.effects.burn = 0;
      this.effects.void_delay = 7;
      // void explosion
      GAME_ENGINE.addEntity(new VoidExplosion(this));
    }

    this.clearQueuedAttacks();
  }
  /**
   * overwrite if you want addidional behaviors
   */
  clearQueuedAttacks() {
    this.recieved_attacks = []; // Clear the attack queue after processing
  }

  /**
   * call within the child class update method on itself
   * all active effects are applied and timers are reduced
   * params controls which effects are applied
   */
  recieveEffects() {
    if (this.validEffects.burn && this.effects.burn > 0) {
      this.health -= 5 * GAME_ENGINE.clockTick;
      this.effects.burn -= GAME_ENGINE.clockTick;
    }
    if (this.validEffects.shock && this.effects.shock > 0) {
      this.health -=
        4 * GAME_ENGINE.clockTick * (this.effects.soaked > 0 ? 5 : 1);
      this.effects.shock -= GAME_ENGINE.clockTick;
    }
    if (this.validEffects.soaked && this.effects.soaked > 0) {
      this.effects.soaked -= GAME_ENGINE.clockTick;
    }
    if (this.validEffects.frozen && this.effects.frozen > 0) {
      this.effects.frozen -= GAME_ENGINE.clockTick;
    }
    if (this.validEffects.rooted && this.effects.rooted > 0) {
      this.effects.rooted -= GAME_ENGINE.clockTick;
    }
    if (this.validEffects.stun && this.effects.stun > 0) {
      this.effects.stun -= GAME_ENGINE.clockTick;
    }
    if (this.validEffects.void && this.effects.void > 0) {
      this.health -= 5 * GAME_ENGINE.clockTick;
      this.effects.void -= GAME_ENGINE.clockTick;
    }
    if (this.validEffects.void_delay && this.effects.void_delay > 0) {
      this.effects.void_delay -= GAME_ENGINE.clockTick;
    }
  }

  drawEffects(ctx, scale = 1) {
    if (this.health <= 0) return;
    this.effect_anim_timer += GAME_ENGINE.clockTick;
    if (this.effect_anim_timer > 10000) this.effect_anim_timer = 0;

    ctx.save();
    ctx.translate(this.x - GAME_ENGINE.camera.x, this.y - GAME_ENGINE.camera.y);

    if (this.effects.frozen > 0) {
      ctx.drawImage(
        window.ASSET_MANAGER.getAsset(EFFECTS_SPRITESHEET.ICE_EFFECT.URL),
        0,
        0,
        EFFECTS_SPRITESHEET.ICE_EFFECT.FRAME_WIDTH,
        EFFECTS_SPRITESHEET.ICE_EFFECT.FRAME_HEIGHT,
        -150 * scale,
        -100 * scale,
        300 * scale,
        200 * scale
      );
    }
    if (this.effects.burn > 0) {
      ctx.drawImage(
        window.ASSET_MANAGER.getAsset(EFFECTS_SPRITESHEET.BURNING_EFFECT.URL),
        EFFECTS_SPRITESHEET.BURNING_EFFECT.FRAME_WIDTH *
          Math.floor(
            (this.effect_anim_timer * 10) %
              EFFECTS_SPRITESHEET.BURNING_EFFECT.FRAME_COUNT
          ),
        0,
        EFFECTS_SPRITESHEET.BURNING_EFFECT.FRAME_WIDTH,
        EFFECTS_SPRITESHEET.BURNING_EFFECT.FRAME_HEIGHT,
        -75 * scale,
        -75 * scale,
        150 * scale,
        150 * scale
      );
    }
    if (this.effects.soaked > 0) {
      ctx.drawImage(
        window.ASSET_MANAGER.getAsset(EFFECTS_SPRITESHEET.SOAKED_EFFECT.URL),
        EFFECTS_SPRITESHEET.SOAKED_EFFECT.FRAME_WIDTH *
          Math.floor(
            (this.effect_anim_timer * 8) %
              EFFECTS_SPRITESHEET.SOAKED_EFFECT.FRAME_COUNT
          ),
        0,
        EFFECTS_SPRITESHEET.SOAKED_EFFECT.FRAME_WIDTH,
        EFFECTS_SPRITESHEET.SOAKED_EFFECT.FRAME_HEIGHT,
        -75 * scale,
        -75 * scale,
        150 * scale,
        150 * scale
      );
    }
    if (this.effects.shock > 0) {
      ctx.drawImage(
        window.ASSET_MANAGER.getAsset(EFFECTS_SPRITESHEET.SHOCK_EFFECT.URL),
        EFFECTS_SPRITESHEET.SHOCK_EFFECT.FRAME_WIDTH *
          Math.floor(
            (this.effect_anim_timer * 10) %
              EFFECTS_SPRITESHEET.SHOCK_EFFECT.FRAME_COUNT
          ),
        0,
        EFFECTS_SPRITESHEET.SHOCK_EFFECT.FRAME_WIDTH,
        EFFECTS_SPRITESHEET.SHOCK_EFFECT.FRAME_HEIGHT,
        -75 * scale,
        -75 * scale,
        150 * scale,
        150 * scale
      );
    }
    if (this.effects.void > 0) {
      //ctx.rotate((this.effect_anim_timer * 30) % (Math.PI*2));
      ctx.shadowColor = "purple";
      ctx.shadowBlur = 20;
      ctx.drawImage(
        window.ASSET_MANAGER.getAsset(EFFECTS_SPRITESHEET.VOID_EFFECT.URL),
        EFFECTS_SPRITESHEET.VOID_EFFECT.FRAME_WIDTH *
          Math.floor(
            (this.effect_anim_timer * 5) %
              EFFECTS_SPRITESHEET.VOID_EFFECT.FRAME_COUNT
          ),
        0,
        EFFECTS_SPRITESHEET.VOID_EFFECT.FRAME_WIDTH,
        EFFECTS_SPRITESHEET.VOID_EFFECT.FRAME_HEIGHT,
        -100 * scale,
        -100 * scale,
        200 * scale,
        200 * scale
      );
    }
    ctx.restore();
  }
}
