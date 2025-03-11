import { Actor } from "../Actor.js";
import { Player } from "../Player/Player.js";
import { Thorn } from "./Attack.js";
import * as Util from "../../Utils/Util.js";
import { Collider } from "../Collider.js";
import { GAME_ENGINE } from "../../main.js";
import { CACTUS_SPRITESHEET } from "../../Globals/Constants.js";
import { AnimationLoader } from "../../Core/AnimationLoader.js";

export class Cactus extends Actor {
  constructor(x, y) {
    super();
    Object.assign(this, { x, y });
    this.spawnX = x;
    this.spawnY = y;

    // Animation
    this.assetManager = window.ASSET_MANAGER;

    this.animationLoader = new AnimationLoader(this);
    this.animationLoader.loadAnimations(CACTUS_SPRITESHEET);

    this.setAnimation(CACTUS_SPRITESHEET.DEFAULT.NAME);
    this.width = 140;
    this.height = 180;
    this.scale = 1.65;

    this.tookDamage = false;
    this.dead = false;

    // Health / Attack
    this.health = 50;
    this.maxHealth = 50;
    this.fireRate = 1; // max time before attack
    this.attackTime = 0; // time since attack
    this.thornMaxRange = 500; // distance thorn travels

    // Movement
    this.collider = new Collider(this.width, this.height);
    this.visualRadius = 400; // pixels away from center

    // Flags
    this.isEnemy = true;

    // For Animation
    this.tookDamage = false;
    this.dead = false;
    this.seesPlayer = false;
    this.attacking = true;
    this.idleTimer = 0;
    this.randomIdleCooldown = [2, 3, 4, 5, 6, 7];
    this.updateIdleCooldown();
  }

  respawn() {
    this.health = this.maxHealth; // Restore full health
    this.dead = false;
    this.x = this.spawnX;
    this.y = this.spawnY;
    console.log(`Enemy respawned at ${this.x}, ${this.y}`);
  }

  clearQueuedAttacks() {
    if (this.recieved_attacks.length > 0) {
      this.tookDamage = true;
    } else {
      this.tookDamage = false;
    }
    this.recieved_attacks = [];
  }

  update() {
    if (!this.dead) {
      // apply attack damage
      this.recieveAttacks();
      this.recieveEffects();

      if (this.health <= 0) {
        this.dead = true;
        this.setAnimation(CACTUS_SPRITESHEET.DIE.NAME, false);
        this.onDeath();
        return;
      }

      if (this.effects.frozen > 0 || this.effects.stun > 0) return;

      this.attackTime += GAME_ENGINE.clockTick;

      this.attemptAttack();
      this.changeAnimation();
    }

    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  updateIdleCooldown() {
    var randomNumber = Util.randomInt(this.randomIdleCooldown.length - 1);
    this.idleCooldown = this.randomIdleCooldown[randomNumber];
  }

  changeAnimation() {
    this.idleTimer += GAME_ENGINE.clockTick;

    if (this.dead && this.currentAnimation !== CACTUS_SPRITESHEET.DIE.NAME) {
      this.idleTimer = 0;
      this.setAnimation(CACTUS_SPRITESHEET.DIE.NAME, false);
    }

    if (this.idleTimer > this.idleCooldown) {
      this.idleTimer = 0;
      this.updateIdleCooldown();
      this.setAnimation(CACTUS_SPRITESHEET.IDLE.NAME, false);
    }

    if (this.tookDamage) {
      this.idleTimer = 0;
      this.setAnimation(CACTUS_SPRITESHEET.DAMAGE.NAME, false);
    }

    if (
      this.seesPlayer &&
      this.currentAnimation != CACTUS_SPRITESHEET.ATTACK.NAME &&
      this.currentAnimation != CACTUS_SPRITESHEET.DAMAGE.NAME
    ) {
      this.idleTimer = 0;
      this.setAnimation(CACTUS_SPRITESHEET.AGGRESSIVE.NAME, false);
    }
  }

  attemptAttack() {
    // for (let entity of GAME_ENGINE.entities) {
    //   if (entity instanceof Player) {
    //     // cactus sees player
    //     if (
    //       Util.canSee(this, entity) &&
    //       this.attackTime > this.fireRate &&
    //       Util.canAttack(new Thorn(this.x, this.y, entity), entity)
    //     ) {
    //       this.attackTime = 0;
    //       GAME_ENGINE.addEntity(
    //         new Thorn(this.x, this.y, entity, this.thornMaxRange)
    //       );
    //       this.setAnimation(CACTUS_SPRITESHEET.ATTACK.NAME, false);
    //       window.ASSET_MANAGER.playAsset(
    //         "./assets/sfx/cactus_shoot.ogg",
    //         1 * Util.DFCVM(this)
    //       );
    //     } else if (Util.canSee(this, entity)) {
    //       this.seesPlayer = true;
    //     } else {
    //       this.seesPlayer = false;
    //     }
    //   }
    // }

    // cactus sees player

    const player = window.PLAYER;
    if (player) {
      if (
        this.attackTime > this.fireRate &&
        Util.canSee(this, player) &&
        Util.canAttack(new Thorn(this.x, this.y, player, this.thornMaxRange), player)
      )
       {
        this.attackTime = 0;
        GAME_ENGINE.addEntity(
          new Thorn(this.x, this.y, player, this.thornMaxRange)
        );
        this.setAnimation(CACTUS_SPRITESHEET.ATTACK.NAME, false);
        window.ASSET_MANAGER.playAsset(
          "./assets/sfx/cactus_shoot.ogg",
          1 * Util.DFCVM(this)
        );
      } else if (Util.canSee(this, player)) {
        this.seesPlayer = true;
      } else {
        this.seesPlayer = false;
      }
    }
  }

  onAnimationComplete() {
    if (this.currentAnimation == CACTUS_SPRITESHEET.DIE.NAME) {
      this.removeFromWorld = true;
    }

    this.setAnimation(CACTUS_SPRITESHEET.DEFAULT.NAME);
  }

  draw(ctx) {
    if (GAME_ENGINE.debug_colliders) {
      super.draw(ctx);
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(
        this.x - GAME_ENGINE.camera.x,
        this.y - GAME_ENGINE.camera.y,
        this.visualRadius,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    } else {
      super.draw(ctx);
    }
    if (!this.dead) {
      this.drawEffects(ctx);
    }
  }
}

export class SpitterCactus extends Cactus {
  constructor(x, y, isLeft) {
    super(x, y);

    this.thornMaxRange = 2000;
    this.cactusXOffset = 200;
    // spread of thorns (higher is wider)
    this.cactusYOffest = 30;
    //number of thorns (>1 --> fan pattern)
    this.numberOfThorns = 1;
    this.leftTarget = { x: this.x - this.cactusXOffset, y: this.y - this.cactusYOffest};
    this.rightTarget = { x: this.x + this.cactusXOffset, y: this.y - this.cactusYOffest};
    this.currentTarget = isLeft ? this.leftTarget : this.rightTarget;

    this.attackTime = 0;
    // length of burst
    this.activeFire = 2;
    // time between first thorn short between bursts
    this.fireRate = this.activeFire + 2;
    // time between thorn shots
    this.thornCooldown = 0.25;
    // time since last thorn shot
    this.thornTime = 0;
    this.attacking = false;
  }

  attemptAttack() {
    this.thornTime += GAME_ENGINE.clockTick;

    // ready to attack
    if (
      this.attackTime < this.activeFire &&
      this.attackTime < this.fireRate &&
      this.thornTime > this.thornCooldown
    ) {
      this.thornTime = 0;
      this.attacking = true;

      for (let i = 1; i <= this.numberOfThorns; i++) {
        let nextTarget = {x: this.currentTarget.x, y: this.currentTarget.y + (this.cactusYOffest * i / this.numberOfThorns)};
        GAME_ENGINE.addEntity(
        new Thorn(this.x, this.y, nextTarget, this.thornMaxRange)
      );
      }
      
      // this.topTarget = {x: this.currentTarget.x, y: this.currentTarget.y + this.cactusYOffest};
      // GAME_ENGINE.addEntity(
      //   new Thorn(this.x, this.y, this.topTarget, this.thornMaxRange)
      // );
      // this.bottomTarget = {x: this.currentTarget.x, y: this.currentTarget.y - this.cactusYOffest};
      // GAME_ENGINE.addEntity(
      //   new Thorn(this.x, this.y, this.bottomTarget, this.thornMaxRange)
      // );
    } else if (
      this.attackTime > this.activeFire &&
      this.attackTime < this.fireRate
    ) {
      this.attacking = false;
    }

    if (this.attackTime > this.fireRate) {
      this.attackTime = 0;
    }
  }

  onAnimationComplete() {
    if (this.currentAnimation == CACTUS_SPRITESHEET.DIE.NAME) {
      this.removeFromWorld = true;
    }

    this.setAnimation(CACTUS_SPRITESHEET.DEFAULT.NAME);
  }
}

