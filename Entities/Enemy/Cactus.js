import { Actor } from "../Entities.js";
import { Player } from "../Player/Player.js";
import { Thorn } from "./Attack.js";
import * as Util from "../../Utils/Util.js";
import { Collider } from "../Collider.js";
import { GAME_ENGINE } from "../../main.js";

export class Cactus extends Actor {
  constructor(x, y) {
    super();
    Object.assign(this, { x, y });


    // Animation
    this.assetManager = window.ASSET_MANAGER;

    this.addAnimation(
      "aggressive",
      this.assetManager.getAsset("./assets/enemy/cactus/aggro.png"),
      160, // Frame width
      160, // Frame height
      1, // Frame count
      0.25 // Frame duration (slower for idle) 
    );
    this.addAnimation(
      "attack",
      this.assetManager.getAsset("./assets/enemy/cactus/attack.png"),
      160, // Frame width
      160, // Frame height
      3, // Frame count
      0.25 // Frame duration (slower for idle)
    );
    this.addAnimation(
      "default",
      this.assetManager.getAsset("./assets/enemy/cactus/cactus.png"),
      160, // Frame width
      160, // Frame height
      1, // Frame count
      0.25 // Frame duration (slower for idle)
    ); 
    this.addAnimation(
      "damage",
      this.assetManager.getAsset("./assets/enemy/cactus/damage.png"),
      160, // Frame width
      160, // Frame height
      1, // Frame count
      0.25 // Frame duration (slower for idle) 
    );
    this.addAnimation(
      "die",
      this.assetManager.getAsset("./assets/enemy/cactus/die.png"),
      160, // Frame width
      160, // Frame height
      4, // Frame count
      0.2 // Frame duration (slower for idle)
    );
    this.addAnimation(
      "idle",
      this.assetManager.getAsset("./assets/enemy/cactus/idle.png"),
      160, // Frame width
      160, // Frame height
      8, // Frame count
      0.25);// Frame duration (slower for idle)

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

  update() {
    if (!this.dead) {
      if (this.recieved_attacks.length == 0) {
        this.tookDamage = false;
      } else {
        for (let attack of this.recieved_attacks) {
        this.tookDamage = true;
        this.health -= attack.damage;
        }
      this.recieved_attacks = [];
      }

    this.recieveEffects();
    this.attackTime += GAME_ENGINE.clockTick;

    this.attemptAttack();

    // apply attack damage
    

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

    if (this.dead && this.currentAnimation !== "die") {
      this.idleTimer = 0;
      this.setAnimation("die", false);
    }

    else if (this.tookDamage && this.currentAnimation !== "damage") {
      this.idleTimer = 0;
      this.setAnimation("damage", false);
    }

    else if (this.attacking) {
      this.idleTimer = 0;
      this.setAnimation("attack", false);
    }

    else if (this.seesPlayer && this.currentAnimation !== "attack") {
      this.setAnimation("aggressive", false);
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
          GAME_ENGINE.addEntity(new Thorn(this.x, this.y, entity));
          this.attacking = true;
          this.seesPlayer = true;
        } else if (Util.canSee(this, entity)) {
          this.seesPlayer = true;
        } else {
          this.seesPlayer = false;
          this.attacking = false;
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
  }
}

export class SpitterCactus extends Cactus {
 constructor ( x, y, isLeft ) {
  super( x, y );

  this.cactusOffset = 200;
  this.leftTarget = {x: this.x - this.cactusOffset, y: this.y};
  this.rightTarget = {x: this.x + this.cactusOffset, y: this.y};
  this.currentTarget = isLeft ? this.leftTarget : this.rightTarget;

  this.attackTime = 0;
  // length of burstw w
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
      GAME_ENGINE.addEntity(new Thorn(this.x, this.y, this.currentTarget));
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