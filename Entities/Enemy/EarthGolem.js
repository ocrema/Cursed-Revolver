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
      128, 90, 5, 0.4
    );

    this.addAnimation(
      "walk",
      this.assetManager.getAsset("./assets/enemy/golem/golem_walk.png"),
      384, 90, 8, 0.2
    );

    this.addAnimation(
      "hit",
      this.assetManager.getAsset("./assets/enemy/golem/golem_hit.png"),
      384, 77, 19, 0.05
    );

    this.setAnimation("idle");

    // **Golem Properties**
    this.width = 140;
    this.height = 220;
    this.scale = 2.5;
    this.collider = new Collider(this.width, this.height);

    // **Health & Combat**
    this.health = 350;
    this.maxHealth = this.health;
    this.attackRadius = 100; // Distance for attack
    this.attackCooldown = 0;
    this.attackRate = 4; // Time between attacks
    this.walkTriggerDistance = 1000; // Distance to switch to walk
    this.stompRadius = 100; // Distance to trigger stomp attack

    // **Movement**
    this.walkSpeed = 80;
    this.aggroSpeed = 120;
    this.speed = 0; // Starts stationary
    this.gravity = 1000;
    this.visualRadius = 1000;
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
  }

  update() {
    if (this.dead) return;

    this.recieveAttacks();
    this.recieveEffects();

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
      window.ASSET_MANAGER.playAsset("./assets/sfx/golem_attack.wav", 1 * Util.DFCVM(this));
    }, 400); 
    setTimeout(() => {
      for (let entity of GAME_ENGINE.entities) {
        if (entity instanceof Player) {
          let xDistance = Math.abs(this.x - entity.x);
          let yDistance = Math.abs(this.y - entity.y);
          if (xDistance < this.stompRadius * 1.5 && yDistance < this.height / 2) {
            entity.queueAttack({ damage: Math.min(80, entity.health) });
          }
        }
      }
    }, 600);

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
      if (entity instanceof Tile && this.colliding(entity)) {
        this.moveAgainstX(entity);
      }
    }

    this.y += this.velocity.y * GAME_ENGINE.clockTick;

    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Tile && this.colliding(entity)) {
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
    super.draw(ctx);

    // ctx.font = "bold 20px Arial";
    // ctx.fillStyle = "white";
    // ctx.textAlign = "center";

    // if (!this.isStomping) {
    //   let stateText = this.seesPlayer ? "GRRRR" : "Zzz...";
    //   ctx.fillText(stateText, this.x - GAME_ENGINE.camera.x + this.width / 2, this.y - GAME_ENGINE.camera.y - 10);
    // }

    // if (this.isStomping) {
    //   ctx.font = "bold 30px Arial";
    //   ctx.fillStyle = "red";
    //   ctx.fillText("STOMP!", this.x - GAME_ENGINE.camera.x + this.width / 2, this.y - GAME_ENGINE.camera.y - 30);
    // }
  }

  die() {
    if (this.dead) return;
    this.dead = true;


    console.log("Earth Golem has died!");
    this.setAnimation("hit");
    window.ASSET_MANAGER.playAsset("./assets/sfx/golem_death.wav", 1 * Util.DFCVM(this));

    setTimeout(() => {
      this.removeFromWorld = true;
    }, 30);
  }
}

