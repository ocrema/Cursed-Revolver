import { Actor } from "../Entities.js";
import { Platform } from "../Map/Platform.js";
import { Player } from "../Player/Player.js";
import { Jaw } from "./Attack.js";
import * as Util from "../../Utils/Util.js";
import { Collider } from "../Collider.js";

export class Cowboy_Enemy extends Actor {
  constructor(x, y) {
    super();
    Object.assign(this, { x, y });

    // Animation Setup
    this.assetManager = window.ASSET_MANAGER;

    this.addAnimation(
      "walk",
      this.assetManager.getAsset("./assets/cowboy/walk.png"),
      64, // Frame width
      64, // Frame height
      8, // Frame count
      0.1 // Frame duration (smooth movement)
    );

    this.addAnimation(
      "smoking",
      this.assetManager.getAsset("./assets/spider/Walk.png"),
      64, // Frame width
      64, // Frame height
      9, // Frame count
      0.2 // Frame duration (idle animation)
    );

    this.addAnimation(
      "quickDraw",
      this.assetManager.getAsset("./assets/spider/Walk.png"),
      64, // Frame width
      64, // Frame height
      18, // Frame count
      0.08 // Frame duration (fast attack)
    );

    this.setAnimation("smoking"); // Default idle animation
    this.width = 60;
    this.height = 80;
    this.scale = 3;

    // Health & Attack
    this.health = 200;
    this.maxHealth = 200;
    this.weapon = null;
    this.attackRadius = 300;
    this.attackCooldown = 0;
    this.attackRate = 2;
    this.attackTime = 6; // Time the cowboy attempts to attack

    // Movement
    this.collider = new Collider(this.width, this.height);
    this.randomRoamLength = [300, 450, 600, 750];
    this.randomRunLength = [550, 700, 850, 1000];

    this.walkSpeed = 250;
    this.runSpeed = 650;
    this.aggroSpeed = 500;
    this.attackSpeed = 700;
    this.speed = this.walkSpeed;
    this.gravity = 800;

    this.visualRadius = 800;
    this.target = { x: this.x + 300, y: this.y }; // Cowboy moves in a range

    var distance = Util.getDistance(this, this.target);
    this.velocity = {
      x: ((this.target.x - this.x) / distance) * this.walkSpeed,
      y: ((this.target.y - this.y) / distance) * this.walkSpeed,
    };

    // Flags
    this.isEnemy = true;
    this.seesPlayer = false;
  }

  update() {
    this.attackCooldown += GAME_ENGINE.clockTick;
    this.recieveEffects();
    this.onGround = false;
    this.onWall = false;

    // Check line of sight (LOS) on player
    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Player && Util.canSee(this, entity)) {
        if (
          this.currentAnimation === "quickDraw" ||
          this.currentAnimation === "attack"
        ) {
          this.target = { x: entity.x, y: entity.y };
        }
        this.seesPlayer = true;
      }
    }

    // Updates Cowboy's state and target movement
    this.setState();

    // Moves towards target, handles platform collisions
    this.movement();

    // Flip image according to velocity
    this.flip = this.velocity.x < 0 ? 0 : 1;

    // Apply attack damage
    for (let attack of this.recieved_attacks) {
      this.health -= attack.damage;
    }
    this.recieved_attacks = [];

    // If Cowboy dies
    if (this.health <= 0) {
      this.removeFromWorld = true;
    }
  }

  // Update the Cowboy's animation states
  setState() {
    if (!this.seesPlayer && Math.abs(this.x - this.target.x) < 5) {
      this.setAnimation("smoking");
      this.speed = this.walkSpeed;

      if (this.velocity.x < 0) {
        this.target.x += this.randomRoamLength[Util.randomInt(this.randomRoamLength.length)];
      } else {
        this.target.x -= this.randomRoamLength[Util.randomInt(this.randomRoamLength.length)];
      }
    }

    if (this.seesPlayer && this.attackCooldown < this.attackRate) {
      this.setAnimation("walk");
    }

    if (
      this.seesPlayer &&
      this.attackCooldown > this.attackRate &&
      this.currentAnimation !== "quickDraw"
    ) {
      this.setAnimation("quickDraw");
      this.speed = this.aggroSpeed;
    }

    if (
      this.seesPlayer &&
      this.attackCooldown > this.attackRate &&
      Math.abs(this.x - this.target.x) < this.attackRadius
    ) {
      this.setAnimation("quickDraw");
      this.speed = this.attackSpeed;

      if (!this.weapon || this.weapon.removeFromWorld) {
        this.attackCooldown = 0;
        this.weapon = new Jaw(this);
        GAME_ENGINE.addEntity(this.weapon);
      }
    }

    if (
      this.currentAnimation === "walk" &&
      Math.abs(this.x - this.target.x) < 20
    ) {
      this.speed = this.runSpeed;
      if (this.velocity.x < 0) {
        this.target.x += this.randomRunLength[Util.randomInt(this.randomRunLength.length)];
      } else {
        this.target.x -= this.randomRunLength[Util.randomInt(this.randomRunLength.length)];
      }
    }
  }

  movement() {
    this.x += this.velocity.x * GAME_ENGINE.clockTick;
    this.y += this.velocity.y * GAME_ENGINE.clockTick;

    var distance = Util.getDistance(this, this.target);

    this.velocity = {
      x: ((this.target.x - this.x) / distance) * this.speed,
      y: this.gravity,
    };

    for (let entity of GAME_ENGINE.entities) {
      if (
        entity instanceof Platform &&
        entity.collider &&
        this.colliding(entity)
      ) {
        let thisTop = this.y - this.height / 2;
        let thisBottom = this.y + this.height / 2;
        let thisLeft = this.x - this.width / 2;
        let thisRight = this.x + this.width / 2;

        let eTop = entity.y - entity.collider.height / 2;
        let eBottom = entity.y + entity.collider.height / 2;
        let eLeft = entity.x - entity.collider.width / 2;
        let eRight = entity.x + entity.collider.width / 2;

        let collideBottom =
          thisBottom > eTop &&
          thisTop < eTop &&
          thisRight > eLeft &&
          thisLeft < eRight;

        let collideLeft = thisLeft < eRight && thisRight > eRight;
        let collideRight = thisRight > eLeft && thisLeft < eLeft;

        if (collideBottom && this.velocity.y > 0) {
          this.y = entity.y - entity.collider.height / 2 - this.height / 2;
          this.velocity.y = 0;
        }

        if (collideLeft || collideRight) {
          this.target.y = eTop - this.height / 2;
          this.velocity.y = ((this.target.y - this.y) / distance) * this.runSpeed;
          this.velocity.x = 0;
          if (collideRight && this.velocity.x > 0) {
            this.x = entity.x - entity.collider.width / 2 - this.width / 2;
          } else if (collideLeft && this.velocity.x < 0) {
            this.x = entity.x + entity.collider.width / 2 + this.width / 2;
          }
        }
      }
    }
  }
}
