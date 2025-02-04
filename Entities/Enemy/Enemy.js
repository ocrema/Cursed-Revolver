import { Actor } from "../Entities.js";
import { Platform } from "../Map/Platform.js";
import { Player } from "../Player/Player.js";
import { Thorn, Jaw } from "./Attack.js";
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
      "run",
      this.assetManager.getAsset("./assets/spider/Walk.png"),
      320, // Frame width
      320, // Frame height
      5, // Frame count
      0.25 // Frame duration (slower for idle)
    );

    this.addAnimation(
      "roam",
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

    this.addAnimation(
      "attack",
      this.assetManager.getAsset("./assets/spider/Walk.png"),
      320, // Frame width
      320, // Frame height
      5, // Frame count
      0.25 // Frame duration (slower for idle)
    );

    this.setAnimation("roam");
    this.width = 150;
    this.height = 90;

    // Health / Attack
    this.health = 100;
    this.maxHealth = 100;
    this.jaw = null;
    this.attackRadius = 200;
    this.attackCooldown = 0;
    this.attackTime = 8; // time that spider attempts to attack
    this.attackRate = 4;

    // Movement
    this.collider = new Collider(this.width, this.height);
    this.randomRoamLength = [250, 400, 750, 800];
    this.randomRunLength = [200, 300, 400, 450];

    
    this.walkSpeed = 300;
    this.runSpeed = 900;
    this.aggroSpeed = 400;
    this.attackSpeed = 500;
    this.speed = this.walkSpeed;
    this.climbSpeed = 5;
    this.gravity = 800;

    this.visualRadius = 500;
    this.target = { x: this.x + 200, y: this.y }; // target location of spider

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
    this.seesPlayer = false;
    // if currently attacking, don't update attack cooldown
    this.attackCooldown += this.currentAnimation === "attack" ? 0 : GAME_ENGINE.clockTick;

    // check LOS on player
    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Player && Util.canSee(this, entity)) {
        if (this.currentAnimation === "aggresive" || this.currentAnimation === "attack") {
          this.target = { x: entity.x, y: entity.y };
        }
        this.seesPlayer = true;
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
  }

  // cycles through different cases to set animation state 
  setState() {
    // if cant see player and close to target location
    if (!this.seesPlayer && (Math.abs(this.x - this.target.x) < 10)) {
      this.setAnimation("roam");
      this.speed = this.walkSpeed;
      if (this.velocity.x < 0) { // approaching target from the left
        this.target.x += this.randomRoamLength[Util.randomInt(this.randomRoamLength.length)]; // run to the right
      } else { // approaching target from the right
        this.target.x -= this.randomRoamLength[Util.randomInt(this.randomRoamLength.length)] // run to the left
      }
    } 
    // if can see player but cannot attack
    // if (this.seesPlayer && this.attackCooldown < this.attackRate) {
    //   this.setAnimation("run");
    //   this.speed = this.runSpeed;
      // if (Math.abs(this.x - this.target.x) < 10) {
      //   if (this.velocity.x > 0) { // approaching target from the left
      //     this.target.x += this.randomRoamLength[Util.randomInt(this.randomRoamLength.length)]; // run to the right
      //   } else if (this.velocity.x < 0) { // approaching target from the right
      //     this.target.x -= this.randomRoamLength[Util.randomInt(this.randomRoamLength.length)] // run to the left
      //   }
      // }
    // }

    // if can see player and can attack
    if (this.seesPlayer && this.attackCooldown > this.attackRate && this.currentAnimation !== "aggressive") {
      this.setAnimation("aggresive");
      this.speed = this.aggroSpeed;
    }

    // if can see player, can attack, and is in attack radius
    if (this.seesPlayer && 
    this.attackCooldown > this.attackRate && 
    (Math.abs(this.x - this.target.x) < this.attackRadius)) {
      this.setAnimation("attack");
      this.speed = this.attackSpeed;
      if (!this.jaw) {
        this.attackCooldown = 0;
        this.jaw = new Jaw(this);
        GAME_ENGINE.addEntity(this.jaw);
      }
    }

    if (this.currentAnimation === "run" && Math.abs(this.x - this.target.x) < 10) {
      if (this.velocity.x < 0) { // approaching target from the left
        this.target.x += this.randomRunLength[Util.randomInt(this.randomRunLength.length)]; // run to the right
      } else { // approaching target from the right
        this.target.x -= this.randomRunLength[Util.randomInt(this.randomRunLength.length)]; // run to the left
      }
    }
  }

  moveInOppositeDirection() {
    if (this.velocity.x < 0) { // approaching target from the left
      this.target.x += this.randomRoamLength[Util.randomInt(this.randomRoamLength.length)]; // run to the right
    } else { // approaching target from the right
      this.target.x -= this.randomRoamLength[Util.randomInt(this.randomRoamLength.length)] // run to the left
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

        if (collideBottom && this.velocity.y > 0) { // if colliding ground and moving down
          this.y = entity.y - entity.collider.height / 2 - this.height / 2;
          this.velocity.y = 0;
        }

        if (collideLeft || collideRight) {
          this.target.y = eTop - this.height / 2;
          this.velocity.y = ((this.target.y - this.y) / distance) * this.runSpeed * this.climbSpeed;
          this.velocity.x = 0;
            if (collideRight && this.velocity.x > 0) { // if colliding with wall on right and moving right
            this.x = entity.x - (entity.collider.width / 2) - (this.width / 2); 
          } else if (collideLeft && this.velocity.x < 0) { // if colliding with wall on left and moving left
            this.x = entity.x + (entity.collider.width / 2) + (this.width / 2);
          }
        }
      }
    }
  }
}
