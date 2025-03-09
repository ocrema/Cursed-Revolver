import { Collider } from "../Collider.js";
import { Entity } from "../Entities.js";
import * as Util from "../../Utils/Util.js";
import { GAME_ENGINE } from "../../main.js";
import { Camera } from "../../Core/Camera.js";
import { FireballExplosionEffect } from "../Effects/FireballExplosionEffect.js";
import {
  EFFECTS_SPRITESHEET,
  SPELLS_SPRITESHEET,
} from "../../Globals/Constants.js";

export class Fireball extends Entity {
  constructor(pos, dir, offset) {
    super();
    this.x = pos.x + offset.x * (pos.flip ? -1 : 1);
    this.y = pos.y + offset.y;
    this.dir = dir; // in radians
    this.entityOrder = 3;
    this.speed = 1000;
    this.isAttack = true;
    this.experationTimer = 3;
    this.exploded = false;
    this.assetManager = window.ASSET_MANAGER;
    this.fireballSpriteScale = 3;

    window.ASSET_MANAGER.playAsset("./assets/sfx/fireball.wav", 0.7);

    // Load fireball animation
    this.addAnimation(
      SPELLS_SPRITESHEET.FIREBALL.NAME,
      this.assetManager.getAsset(SPELLS_SPRITESHEET.FIREBALL.URL),
      SPELLS_SPRITESHEET.FIREBALL.FRAME_WIDTH,
      SPELLS_SPRITESHEET.FIREBALL.FRAME_HEIGHT,
      SPELLS_SPRITESHEET.FIREBALL.FRAME_COUNT,
      SPELLS_SPRITESHEET.FIREBALL.FRAME_DURATION
    );

    // TODO make this automatically scale with fireball sprite etc since it doesnt match up right now
    this.collider = new Collider(35, 35);

    this.setAnimation(SPELLS_SPRITESHEET.FIREBALL.NAME, true);
  }

  update() {
    if (this.exploded) {
      this.experationTimer -= GAME_ENGINE.clockTick;
      if (this.experationTimer <= 0) this.removeFromWorld = true;
      return;
    }

    // Fireball movement
    this.x += Math.cos(this.dir) * this.speed * GAME_ENGINE.clockTick;
    this.y += Math.sin(this.dir) * this.speed * GAME_ENGINE.clockTick;

    for (let e of GAME_ENGINE.entities) {
      if (e.isPlayer || e.isAttack || e.isSpawnPoint || e.isBackgroundTrigger) continue;

      if (this.colliding(e)) {
        // ares moved explosion logic into this method
        this.explode();
        return; //
      }
    }

    this.experationTimer -= GAME_ENGINE.clockTick;
    if (this.experationTimer <= 0) this.removeFromWorld = true;

    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  explode() {
    if (this.exploded) return;
    this.exploded = true;
    this.collider.width = 200;
    this.collider.height = 200;
    this.speed = 0;

    // Spawn explosion effect
    GAME_ENGINE.addEntity(new FireballExplosionEffect(this.x, this.y));

    // Apply Damage / Effects
    for (let e2 of GAME_ENGINE.entities) {
      if (!e2.isActor) continue;
      
      if (this.colliding(e2)) {
        e2.queueAttack({
          damage: 10,
          x: this.x,
          y: this.y,
          burn: 5,
          launchMagnitude: 2500,
        });
      }
    }

    window.ASSET_MANAGER.playAsset(
      "./assets/sfx/fireball_impact.wav",
      Util.DFCVM(this)
    );

    // Remove fireball after spawning explosion
    this.removeFromWorld = true;
  }

  draw(ctx) {
    if (this.exploded) return;

    let frameWidth = SPELLS_SPRITESHEET.FIREBALL.FRAME_WIDTH;
    let frameHeight = SPELLS_SPRITESHEET.FIREBALL.FRAME_HEIGHT;

    let fireballImage = this.assetManager.getAsset(
      SPELLS_SPRITESHEET.FIREBALL.URL
    );

    // logic added by ares to draw fireball
    // draws image and orients fireball to also point in direction mouse is aiming in
    if (fireballImage) {
      ctx.save();
      ctx.translate(
        this.x - GAME_ENGINE.camera.x,
        this.y - GAME_ENGINE.camera.y
      );
      ctx.rotate(this.dir); // Rotate to match movement direction

      ctx.drawImage(
        fireballImage,
        this.currentFrame * frameWidth,
        0,
        frameWidth,
        frameHeight,
        // using specified fireball scaling
        (-frameWidth * this.fireballSpriteScale) / 2,
        (-frameHeight * this.fireballSpriteScale) / 2,
        frameWidth * this.fireballSpriteScale,
        frameHeight * this.fireballSpriteScale
      );

      ctx.restore();
    }
  }
}
