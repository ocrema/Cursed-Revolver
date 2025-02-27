import { Actor } from "../Actor.js";
//import { Platform } from "../Map/Platform.js";
import { Player } from "../Player/Player.js";
import { Jaw } from "./Attack.js";
import * as Util from "../../Utils/Util.js";
import { Collider } from "../Collider.js";
import { GAME_ENGINE } from "../../main.js";
import { Tile } from "../Map/Tiles/Tile.js";

export class Spider extends Actor {
  constructor(x, y) {
    super();
    Object.assign(this, { x, y });

    // Animation

    this.assetManager = window.ASSET_MANAGER;

    this.addAnimation(
      "run",
      this.assetManager.getAsset("./assets/enemy/spider/Walk.png"),
      64, // Frame width
      64, // Frame height
      5, // Frame count
      0.5 // Frame duration (slower for idle)
    );

    this.addAnimation(
      "roam",
      this.assetManager.getAsset("./assets/enemy/spider/Walk.png"),
      64, // Frame width
      64, // Frame height
      5, // Frame count
      0.5 // Frame duration (slower for idle)
    );

    this.addAnimation(
      "aggressive",
      this.assetManager.getAsset("./assets/enemy/spider/Walk.png"),
      64, // Frame width
      64, // Frame height
      5, // Frame count
      0.5 // Frame duration (slower for idle)
    );

    this.addAnimation(
      "attack",
      this.assetManager.getAsset("./assets/enemy/spider/Walk.png"),
      64, // Frame width
      64, // Frame height
      5, // Frame count
      0.5 // Frame duration (slower for idle)
    );

    this.setAnimation("roam");
    this.width = 60;
    this.height = 40;
    this.scale = 3;

    // Health / Attack
    this.health = 30;
    this.maxHealth = 30;
    this.jaw = null;
    this.attackRadius = 200;
    this.attackCooldown = 0;
    this.attackTime = 8; // time that spider attempts to attack
    this.attackRate = 2;

    // Movement
    this.collider = new Collider(this.width, this.height);
    this.randomRoamLength = [250, 400, 750, 800];
    this.randomRunLength = [550, 600, 700, 750];

    this.walkSpeed = 500;
    this.runSpeed = 900;
    this.aggroSpeed = 700;
    this.attackSpeed = 800;
    this.speed = this.walkSpeed;
    this.climbSpeed = 2000;
    this.gravity = 1000;

    this.visualRadius = 700;
    this.target = { x: this.x + 200, y: this.y }; // target location of spider

    var distance = Util.getDistance(this, this.target);
    this.velocity = {
      x: ((this.target.x - this.x) / distance) * this.walkSpeed,
      y: ((this.target.y - this.y) / distance) * this.walkSpeed,
    };

    // Flags
    this.isEnemy = true;
    this.seesPlayer = false;

    this.isSpider = true;
  }

  update() {
    // apply attack damage
    this.recieveAttacks();
    this.recieveEffects();

    // if spider loses all health
    if (this.health <= 0) {
      this.removeFromWorld = true;
    }

    if (this.effects.frozen > 0 || this.effects.stun > 0) return;

    this.attackCooldown += GAME_ENGINE.clockTick;
    
    this.onGround = false;
    this.onWall = false;

    // check LOS on player
    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Player) {
        if (Util.canSee(this, entity)) {
          this.seesPlayer = true;
          if (
            (this.currentAnimation === "aggressive" ||
            this.currentAnimation === "attack")
          ) {
            this.target = { x: entity.x, y: entity.y };
          }
        } else {
          this.seesPlayer = false;
        }
      }
    }

    // updates what state the spider is in and moves target when state changes
    this.setState();

    // moves to target, deals with platform collision
    this.movement();

    // flip image according to velocity
    if (this.velocity.x < 0) {
      this.flip = 0;
    } else if (this.velocity.x > 0) {
      this.flip = 1;
    }

    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  // cycles through different cases to set animation state
  setState() {
    // if cant see player and close to target location
    if (!this.seesPlayer && Math.abs(this.x - this.target.x) < 20) {
      // change animation and speed
      this.setAnimation("roam");
      this.speed = this.walkSpeed;

      if (this.velocity.x < 0) {
        // approaching target from the left
        this.target.x -=
          this.randomRoamLength[Util.randomInt(this.randomRoamLength.length)]; // run to the right
      } else {
        // approaching target from the right
        this.target.x +=
          this.randomRoamLength[Util.randomInt(this.randomRoamLength.length)]; // run to the left
      }
    }

    if (this.seesPlayer && this.attackCooldown < this.attackRate) {
      this.setAnimation("run");
      if (this.jaw) {
        this.jaw.delete();
        this.jaw = null;
      }
    }

    // if can see player and can attack
    if (
      this.seesPlayer &&
      this.attackCooldown > this.attackRate &&
      this.currentAnimation !== "aggressive"
    ) {
      this.setAnimation("aggressive");
      this.speed = this.aggroSpeed;
    }

    // if can see player, can attack, and is in attack radius
    if (
      this.seesPlayer &&
      this.attackCooldown > this.attackRate &&
      Math.abs(this.x - this.target.x) < this.attackRadius
    ) {
      // change animation and speed
      this.setAnimation("attack");
      this.speed = this.attackSpeed;
    }

    if (
      this.currentAnimation === "run" &&
      Math.abs(this.x - this.target.x) < 20
    ) {
      this.speed = this.runSpeed;
      if (this.velocity.x < 0) {
        // approaching target from the left
        this.target.x +=
          this.randomRunLength[Util.randomInt(this.randomRunLength.length)]; // run to the right
      } else {
        // approaching target from the right
        this.target.x -=
          this.randomRunLength[Util.randomInt(this.randomRunLength.length)]; // run to the left
      }
    }
  }

  movement() {
    // update location
    this.x += this.velocity.x * GAME_ENGINE.clockTick;
    this.y += this.velocity.y * GAME_ENGINE.clockTick;

    // update velocity
    var distance = Util.getDistance(this, this.target);

    this.velocity = {
      x: ((this.target.x - this.x) / distance) * this.speed,
      y: this.gravity,
    };

    // apply changes to velocity
    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Tile && entity.collider && this.colliding(entity)) {
        let thisTop = this.y - this.height / 2;
        let thisBottom = this.y + this.height / 2;
        let thisLeft = this.x - this.width / 2;
        let thisRight = this.x + this.width / 2;

        let eTop = entity.y - entity.collider.height / 2;
        let eBottom = entity.y + entity.collider.height / 2;
        let eLeft = entity.x - entity.collider.width / 2;
        let eRight = entity.x + entity.collider.width / 2;

        let collideRight = thisRight > eLeft && thisLeft < eLeft; // platform is on right of spider
        let collideLeft = thisLeft < eRight && thisRight > eRight; // platform is on the left of spider

        let collideBottom =
          thisBottom > eTop &&
          thisTop < eTop &&
          thisRight > eLeft &&
          thisLeft < eRight;
        let collideTop =
          thisTop > eBottom &&
          thisBottom < eBottom &&
          thisRight > eLeft &&
          thisLeft < eRight;

        if (collideBottom && this.velocity.y > 0) {
          // if colliding ground and moving down
          this.y = entity.y - entity.collider.height / 2 - this.height / 2;
          this.velocity.y = 0;
        }

        if (collideLeft || collideRight) {
          this.target.y = eTop - this.height / 2;
          this.velocity.y =
            ((this.target.y - this.y) / distance) * this.climbSpeed;
          this.velocity.x = 0;
          if (collideRight && this.velocity.x > 0) {
            // if colliding with wall on right and moving right
            this.x = entity.x - entity.collider.width / 2 - this.width / 2;
          } else if (collideLeft && this.velocity.x < 0) {
            // if colliding with wall on left and moving left
            this.x = entity.x + entity.collider.width / 2 + this.width / 2;
          }
        }
      }
    }
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
