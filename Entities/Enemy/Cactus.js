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


    // Animation
    this.assetManager = window.ASSET_MANAGER;

    this.animationLoader = new AnimationLoader(this);
    this.animationLoader.loadAnimations(CACTUS_SPRITESHEET);

    this.setAnimation("default");
    this.width = 160;
    this.height = 250;
    this.scale = 2;

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
    this.idleCooldown = [5, 7, 10, 13, 15];
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

    if (this.effects.frozen > 0 || this.effects.stun > 0) return;

    this.attackTime += GAME_ENGINE.clockTick;

    this.attemptAttack();

    if (this.health <= 0) {
      this.dead = true;
    }

    this.changeAnimation();
    }
    
    
    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  changeAnimation() {
    this.idleTimer += GAME_ENGINE.clockTick;
    var randomNumber = Util.randomInt(this.idleCooldown.length - 1);

    if (this.idleTimer > this.idleCooldown[randomNumber]) {
      this.idleTimer = 0;
      this.setAnimation("idle", false);
    }
    
    if (this.tookDamage) {
      this.idleTimer = 0;
      this.setAnimation("damage", false);
    }

    if (this.seesPlayer && this.currentAnimation != "attack" && this.currentAnimation != "damage") {
      this.idleTimer = 0;
      this.setAnimation("aggressive", false);
    }  

    if (this.dead && this.currentAnimation !== "die") {
      this.idleTimer = 0;
      this.setAnimation("die", false);
    }
  }

  attemptAttack() {
    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Player) {
        // cactus sees player
        if (
          Util.canSee(this, entity) &&
          this.attackTime > this.fireRate &&
          Util.canAttack(new Thorn(this.x, this.y, entity), entity)
        ) {     
          this.attackTime = 0;
          GAME_ENGINE.addEntity(new Thorn(this.x, this.y, entity, this.thornMaxRange));
          this.setAnimation("attack", false);
          console.log("shoot");
        } else if (Util.canSee(this, entity)) {
          this.seesPlayer = true;
        } else {
          this.seesPlayer = false;
        }
      }
    }

  }
  
  onAnimationComplete() {
    if (this.currentAnimation == "die") {
      this.removeFromWorld = true;
    }

    this.setAnimation("default");
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
    this.drawEffects(ctx);
  }
}

export class SpitterCactus extends Cactus {
 constructor ( x, y, isLeft ) {
  super( x, y );

  this.thornMaxRange = 2000;
  this.cactusOffset = 200;
  this.leftTarget = {x: this.x - this.cactusOffset, y: this.y};
  this.rightTarget = {x: this.x + this.cactusOffset, y: this.y};
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
 } 

 attemptAttack() {
  this.thornTime += GAME_ENGINE.clockTick;

  // ready to attack
  if (this.attackTime < this.activeFire && 
    this.attackTime < this.fireRate && 
    this.thornTime > this.thornCooldown) {
      this.thornTime = 0;
      this.attacking = true;
      GAME_ENGINE.addEntity(new Thorn(this.x, this.y, this.currentTarget, this.thornMaxRange));
  } else if (this.attackTime > this.activeFire && 
    this.attackTime < this.fireRate) {
      this.attacking = false;
  }

  if (this.attackTime > this.fireRate) {
    this.attackTime = 0;
  }
 }

 onAnimationComplete() {
  if (this.currentAnimation == "die") {
    this.removeFromWorld = true;
  }

  this.setAnimation("idle");
  }

}