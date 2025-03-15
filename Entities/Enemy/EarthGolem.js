import { Actor } from "../Actor.js";
import { Player } from "../Player/Player.js";
import * as Util from "../../Utils/Util.js";
import { Collider } from "../Collider.js";
import { GAME_ENGINE } from "../../main.js";
import { Tile } from "../Map/Tiles/Tile.js";
import { Entity } from "../Entities.js";

export class EarthGolem extends Actor {
  constructor(x, y) {
    super();
    Object.assign(this, { x, y });

    // **Load Animations**
    this.assetManager = window.ASSET_MANAGER;

    this.addAnimation(
      "idle",
      this.assetManager.getAsset("./assets/enemy/golem/golem_idle.png"),
      128,
      90,
      5,
      0.1
    );

    this.addAnimation(
      "walk",
      this.assetManager.getAsset("./assets/enemy/golem/golem_walk.png"),
      384,
      90,
      8,
      0.1
    );

    this.addAnimation(
      "hit",
      this.assetManager.getAsset("./assets/enemy/golem/golem_hit.png"),
      384,
      77,
      19,
      0.05
    );

    this.setAnimation("idle");

    // **Golem Properties**
    this.width = 240;
    this.height = 220;
    this.scale = 4.5;
    this.collider = new Collider(this.width, this.height);

    // **Health & Combat**
    this.health = 350;
    this.maxHealth = this.health;
    this.attackRadius = 100; // Distance for attack
    this.attackCooldown = 0;
    this.attackRate = 4; // Time between attacks
    this.walkTriggerDistance = 3000; // Distance to switch to walk
    this.stompRadius = 100; // Distance to trigger stomp attack

    // **Movement**
    this.walkSpeed = 140;
    this.aggroSpeed = 140;
    this.speed = 0; // Starts stationary
    this.gravity = 1000;
    this.visualRadius = 3000;
    this.target = { x: this.x, y: this.y };

    let distance = Util.getDistance(this, this.target);
    this.velocity = {
      x: distance ? ((this.target.x - this.x) / distance) * this.speed : 0,
      y: this.gravity,
    };

    // **Flags**
    this.isEnemy = true;
    this.seesPlayer = false;
    this.isProvoked = false;
    this.isAttacking = false;
    this.isStomping = false;
    this.dead = false;

    this.idleSFXFixedDelay = 5;
    this.idleSFXRandomDelay = 10;
    this.idleSFXDelay = Math.random() * this.idleSFXRandomDelay;
  }

  update() {
    if (this.dead) return;

    this.recieveAttacks();
    this.recieveEffects();

    this.idleSFXDelay -= GAME_ENGINE.clockTick;
    if (this.idleSFXDelay <= 0) {
      this.assetManager.playAsset("./assets/sfx/golem_idle.wav", Util.DFCVM(this) * .5);
      this.idleSFXDelay = this.idleSFXFixedDelay + Math.random() * this.idleSFXRandomDelay;
    }

    if (this.effects.frozen > 0 || this.effects.stun > 0) return;

    this.attackCooldown += GAME_ENGINE.clockTick;
    this.onGround = false;

    // **Optimized Player Detection**
    const player = window.PLAYER;
    if (player) {
      let distanceToPlayer = Util.getDistance(this, player);
      this.seesPlayer = distanceToPlayer < this.visualRadius;
      if (this.seesPlayer) {
        this.target = { x: player.x, y: player.y };
      }
    } else {
      this.seesPlayer = false;
    }

    this.setState();
    this.movement();

    if (this.velocity.x !== 0) {
      this.flip = this.velocity.x < 0 ? 1 : 0;
    }
    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  clearQueuedAttacks() {
    if (this.recieved_attacks.length > 0) {
      this.setAnimation("hit", false);
    }
    this.recieved_attacks = [];
  }

  // **Handles State Switching**
  setState() {
    if (this.health <= 0) {
      this.die();
      return;
    }

    if (this.isAttacking || this.isStomping) return;

    let distanceToPlayer = Util.getDistance(this, this.target);

    if (!this.seesPlayer) {
      if (this.currentAnimation !== "idle") {
        this.setAnimation("idle");
        this.speed = 0;
      }
      return;
    }

    if (distanceToPlayer < this.attackRadius) {
      this.stompAttack();
    } else if (distanceToPlayer < this.walkTriggerDistance) {
      this.setAnimation("walk");
      this.speed = this.walkSpeed;
    } else {
      this.setAnimation("idle");
      this.speed = 0;
    }
  }

  stompAttack() {
    if (this.isStomping || this.attackCooldown < this.attackRate) return;

    this.isStomping = true;
    this.attackCooldown = 0;
    this.setAnimation("hit");

    setTimeout(() => {
      window.ASSET_MANAGER.playAsset(
        "./assets/sfx/golem_attack.wav",
        1 * Util.DFCVM(this)
      );
    }, 400);
    setTimeout(() => {
      for (let entity of GAME_ENGINE.entities) {
        if (entity instanceof Player) {
          let xDistance = Math.abs(this.x - entity.x);
          let yDistance = Math.abs(this.y - entity.y);
          if (
            xDistance < this.stompRadius * 1.5 &&
            yDistance < this.height / 2
          ) {
            entity.queueAttack({ damage: Math.min(50, entity.health) });
          }
        }
      }
    }, 400);

    setTimeout(() => {
      this.isStomping = false;
      this.setAnimation("walk");
    }, 2000);
  }

  movement() {
    if (!this.seesPlayer || this.isAttacking) return;

    let distance = Util.getDistance(this, this.target);
    if (distance > this.walkTriggerDistance) return;

    this.velocity = {
      x: distance ? ((this.target.x - this.x) / distance) * this.speed : 0,
      y: this.gravity,
    };

    this.x += this.velocity.x * GAME_ENGINE.clockTick;

    for (let entity of GAME_ENGINE.entities) {
      if (entity.isGround && this.colliding(entity)) {
        this.moveAgainstX(entity);
      }
    }

    this.y += this.velocity.y * GAME_ENGINE.clockTick;

    for (let entity of GAME_ENGINE.entities) {
      if (entity.isGround && this.colliding(entity)) {
        this.moveAgainstY(entity);
      }
    }
  }

  onAnimationComplete() {
    if (this.currentAnimation === "hit") {
      this.setAnimation("idle");
    }
  }

  draw(ctx) {
    // super.draw(ctx);

    if (!this.currentAnimation) return;

    const animation = this.animations[this.currentAnimation];
    const { spritesheet, frameWidth, frameHeight } = animation;

    if (!spritesheet) return;

    ctx.save(); // Save the current transformation state
    ctx.translate(-GAME_ENGINE.camera.x, -GAME_ENGINE.camera.y);
    // Apply horizontal flipping and scaling
    if (this.flip) {
      ctx.scale(-1, 1);
      ctx.translate(-this.x * 2, 0);
    }

    ctx.translate(this.x, this.y - 32); // Move to the entity's position
    ctx.scale(this.scale, this.scale); // Apply scaling factor

    // Draw the current frame of the active animation
    ctx.drawImage(
      spritesheet,
      this.currentFrame * frameWidth, // Source X
      0, // Source Y (single row)
      frameWidth, // Source Width
      frameHeight, // Source Height
      -frameWidth / 2, // Destination X (centered)
      -frameHeight / 2, // Destination Y (centered)
      frameWidth, // Destination Width
      frameHeight // Destination Height
    );

    ctx.restore(); // Restore the transformation state
    this.drawHealthBar(ctx);
    this.drawEffects(ctx, 2);
  }

  die() {
    this.onDeath();
    if (this.dead) return;
    this.dead = true;

    console.log("Earth Golem has died!");
    this.setAnimation("hit");
    window.ASSET_MANAGER.playAsset(
      "./assets/sfx/golem_death.wav",
      1 * Util.DFCVM(this)
    );

    setTimeout(() => {
      this.removeFromWorld = true;
    }, 30);
  }
}
