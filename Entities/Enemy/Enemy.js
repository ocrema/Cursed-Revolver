import { Actor } from "../Entities.js";
import { Platform } from "../Map/Platform.js";
import { Player } from "../Player/Player.js";
import { Thorn, Jaw } from "./Attack.js";
import * as Util from "../../Utils/Util.js";
import { Collider } from "../Collider.js";

export class Cactus extends Actor {
  constructor(x, y) {
    super();
    Object.assign(this, { x, y });
    // Animation
    this.assetManager = window.ASSET_MANAGER;

    this.addAnimation(
      "placeholder",
      this.assetManager.getAsset("./assets/cactus/cactus.png"),
      320, // Frame width
      320, // Frame height
      1, // Frame count
      0.25 // Frame duration (slower for idle)
    );

    this.setAnimation("placeholder");
    this.width = 160;
    this.height = 250;

    // Health / Attack
    this.health = 50;
    this.maxHealth = 50;
    this.fireRate = 1; // max time before attack
    this.elapsedTime = 0; // time since attack

    // Movement
    this.collider = new Collider(this.width, this.height);
    this.visualRadius = 300; // pixels away from center

    // Flags
    this.isEnemy = true;
    this.dead = false;
  }

  update() {
    this.recieveEffects();
    this.elapsedTime += GAME_ENGINE.clockTick;

    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Player) {
        // cactus sees player
        if (Util.canSee(this, entity) && this.elapsedTime > this.fireRate) {
          // this.setAnimation("attack");
          this.elapsedTime = 0;
          GAME_ENGINE.addEntity(new Thorn(this.x, this.y, entity));
        }
      }
    }

    // apply attack damage
    for (let attack of this.recieved_attacks) {
      this.health -= attack.damage;
    }
    this.recieved_attacks = [];

    if (this.health <= 0) {
      this.removeFromWorld = true;
    }
  }
}

export class Spider extends Actor {
  constructor(x, y) {
    super();
    Object.assign(this, { x, y });

    // Animation

    this.assetManager = window.ASSET_MANAGER;

    this.addAnimation(
      "walk",
      this.assetManager.getAsset("./assets/spider/Walk.png"),
      320, // Frame width
      320, // Frame height
      5, // Frame count
      0.25 // Frame duration (slower for idle)
    );

    this.addAnimation(
      "attack",
      this.assetManager.getAsset("./assets/spider/Walk.png"),
      320, // Frame width
      320, // Frame height
      5, // Frame count
      0.25 // Frame duration (slower for idle)
    );

    this.addAnimation(
      "aggresive",
      this.assetManager.getAsset("./assets/spider/Walk.png"),
      320, // Frame width
      320, // Frame height
      5, // Frame count
      0.25 // Frame duration (slower for idle)
    );

    this.setAnimation("walk");
    this.width = 240;
    this.height = 120;

    // Health / Attack
    this.health = 100;
    this.maxHealth = 100;
    this.attackCooldown = 0;
    this.attackRate = 4;

    // Movement
    this.collider = new Collider(this.width, this.height);

    this.walkSpeed = 100;
    this.runSpeed = 250;
    this.climbSpeed = 3;
    this.visualRadius = 500;
    this.gravity = 800;

    this.target = { x: this.x + 200, y: this.y }; // target location of spider

    var distance = Util.getDistance(this, this.target);
    this.velocity = {
      x: ((this.target.x - this.x) / distance) * this.runSpeed,
      y: ((this.target.y - this.y) / distance) * this.runSpeed,
    };

    // Flags
    this.isEnemy = true;
    this.onGround = false;
    this.onWall = false;
  }

  update() {
    this.recieveEffects()
    this.seesPlayer = false;
    // if currently attacking, don't update attack cooldown
    this.attackCooldown +=
      this.currentAnimation === "attack" ? 0 : GAME_ENGINE.clockTick;

    // update target
    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Player && Util.canSee(this, entity)) {
        if (
          this.currentAnimation === "aggressive" ||
          this.currentAnimation === "attack"
        ) {
          this.target = { x: entity.x, y: entity.y };
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

    // apply attack damage
    for (let attack of this.recieved_attacks) {
      this.health -= attack.damage;
    }
    this.recieved_attacks = [];

    // if spider loses all health
    if (this.health <= 0) {
      this.removeFromWorld = true;
    }

    // debug statement, delete this eventually ^_^
    if (this.y > 490) {
      console.log(this);
    }
  }

  // cycles through different cases to set animation state
  setState() {
    // if cant see player and close to target location
    if (!this.seesPlayer && Math.abs(this.x - this.target.x) < 5) {
      // change animation and speed
      this.setAnimation("roam");
      this.speed = this.walkSpeed;

      if (this.velocity.x < 0) {
        // approaching target from the left
        this.target.x +=
          this.randomRoamLength[Util.randomInt(this.randomRoamLength.length)]; // run to the right
      } else {
        // approaching target from the right
        this.target.x -=
          this.randomRoamLength[Util.randomInt(this.randomRoamLength.length)]; // run to the left
      }
    }

    if (this.seesPlayer && this.attackCooldown < this.attackRate) {
      this.setAnimation("run");
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

      // if no jaw, spawn one in + reset the timer
      if (!this.jaw) {
        this.attackCooldown = 0;
        this.jaw = new Jaw(this);
        GAME_ENGINE.addEntity(this.jaw);
      }
    }

    if (
      this.currentAnimation === "run" &&
      Math.abs(this.x - this.target.x) < 5
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
      x: ((this.target.x - this.x) / distance) * this.runSpeed,
      y: 0,
    };

    // apply changes to velocity
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
          this.onGround = true;
        }

        if (collideLeft || collideRight) {
          this.target.y = eTop - this.height / 2;
          this.velocity.y =
            ((this.target.y - this.y) / distance) *
            this.runSpeed *
            this.climbSpeed;
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

    // if spider is currently on a wall
    if (this.onWall) {
      // climb up wall
      this.velocity.y =
        ((this.target.y - this.y) / distance) * this.runSpeed * this.climbSpeed;
    }

    // if spider is on the ground and trying to move down
    else if (this.onGround) {
      this.velocity.y = 0;
    }

    // if spider is floating and moving
    else if (!this.onGround && this.velocity.x !== 0) {
      this.velocity.y += this.gravity;
    }
    // update location
    this.x += this.velocity.x * GAME_ENGINE.clockTick;
    this.y += this.velocity.y * GAME_ENGINE.clockTick;

    // flip image according to velocity
    if (this.velocity.x < 0) {
      this.flip = 0;
    } else if (this.velocity.x > 0) {
      this.flip = 1;
    }

    // attempt to attack
    if (this.attackCooldown > this.attackRate) {
      this.attackCooldown = 0;
      this.setAnimation("attack");
      GAME_ENGINE.addEntity(new Jaw(this));
    }

    // apply attack damage
    for (let attack of this.recieved_attacks) {
      this.health -= attack.damage;
    }
    this.recieved_attacks = [];

    // if spider loses all health
    if (this.health <= 0) {
      this.removeFromWorld = true;
    }
  }
}
