import { Actor } from "../Actor.js";
//import { Platform } from "../Map/Platform.js";
import { Player } from "../Player/Player.js";
import { Jaw } from "./Attack.js";
import * as Util from "../../Utils/Util.js";
import { Collider } from "../Collider.js";
import { GAME_ENGINE } from "../../main.js";
import { Tile } from "../Map/Tiles/Tile.js";
import { AnimationLoader } from "../../Core/AnimationLoader.js";
import { SPIDER_SPRITESHEET } from "../../Globals/Constants.js";

export class Spider extends Actor {
  constructor(x, y) {
    super();
    Object.assign(this, { x, y });

    // Animation

    this.assetManager = window.ASSET_MANAGER;
    this.animationLoader = new AnimationLoader(this);
    this.animationLoader.loadAnimations(SPIDER_SPRITESHEET);
    
    this.setAnimation(SPIDER_SPRITESHEET.ROAM.NAME);

    this.width = 60;
    this.height = 40;
    this.scale = 0.25;

    // Health / Attack
    this.health = 30;
    this.maxHealth = this.health;
    this.jaw = null;
    this.attackRadius = 200;
    this.attackCooldown = 0;
    this.attackTime = 8; // time that spider attempts to attack
    this.attackRate = 2;

    // Movement
    this.collider = new Collider(this.width, this.height);
    this.randomRoamLength = [600, 800, 900, 1000, 1200, 1300];
    this.randomRunLength = [200, 550, 600, 700, 750];

    this.walkSpeed = 350;
    this.runSpeed = 900;
    this.aggroSpeed = 700;
    this.attackSpeed = 800;
    this.speed = this.walkSpeed;
    this.gravity = 1300;
    this.turnTimer = 0;
    this.turnBuffer = 1;

    this.visualRadius = 700;
    this.target = { x: this.x - 2000, y: this.y - 200}; // target location of spider

    var distance = Util.getDistance(this, this.target);
    this.velocity = {
      x: distance ? ((this.target.x - this.x) / distance) * this.speed : 0,
      y: distance ? ((this.target.y - this.y) / distance) * this.speed : 0,
    };

    // Flags
    this.isEnemy = true;
    this.seesPlayer = false;
    this.dead = false;
  }

  update() {
    if (!this.dead) {

      // apply attack damage
      this.recieveAttacks();
      this.recieveEffects();

      if (this.effects.frozen > 0 || this.effects.stun > 0) return;

      this.attackCooldown += GAME_ENGINE.clockTick;
      
      this.onGround = false;
      this.onWall = false;

      // check LOS on player
      for (let entity of GAME_ENGINE.entities) {
        if (entity instanceof Player) {
          if (Util.canSee(this, entity) && Util.canAttack(this.entity)) {
            this.seesPlayer = true;
            if (
              (this.currentAnimation === SPIDER_SPRITESHEET.AGGRESSIVE.NAME ||
              this.currentAnimation === SPIDER_SPRITESHEET.ATTACK.NAME)
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
      if (this.currentAnimation !== SPIDER_SPRITESHEET.IDLE.NAME) {
        this.movement();

        // flip image according to velocity
        if (this.velocity.x < 0) {
          this.flip = 1;
        } else if (this.velocity.x > 0) {
          this.flip = 0;
        }
      }
    }
    
    this.angle = this.onWall ? Math.PI * 3 / 2 : 0;
    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  clearQueuedAttacks() {
    if (this.recieved_attacks.length > 0) {
      this.setAnimation(SPIDER_SPRITESHEET.HURT.NAME, false);
    } 
    this.recieved_attacks = [];
  }

  // cycles through different cases to set animation state
  setState() {
    if (this.health < 0) {
      this.dead = true;
      this.setAnimation(SPIDER_SPRITESHEET.DEATH.NAME, false);
      window.ASSET_MANAGER.playAsset("./assets/sfx/spider_death.wav", 1 * Util.DFCVM(this));
      return;
    }

    if(this.currentAnimation === SPIDER_SPRITESHEET.HURT.NAME) {
      return;
    }

    // if cant see player and close to target location
    if (!this.seesPlayer && Math.abs(this.x - this.target.x) < 20) {

      if (this.turnTimer < this.turnBuffer) {
        this.turnTimer += GAME_ENGINE.clockTick;
        this.setAnimation(SPIDER_SPRITESHEET.IDLE.NAME);
        return;
      }

      this.turnTimer = 0;

      // change animation and speed
      this.setAnimation(SPIDER_SPRITESHEET.ROAM.NAME);
      this.speed = this.walkSpeed;

      if (this.velocity.x > 0) {
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
      this.setAnimation(SPIDER_SPRITESHEET.RUN.NAME);
      this.turnTimer = this.turnBuffer;
      if (this.jaw) {
        this.jaw.delete();
        this.jaw = null;
      }
    }

    // if can see player and can attack
    if (
      this.seesPlayer &&
      this.attackCooldown > this.attackRate &&
      this.currentAnimation !== SPIDER_SPRITESHEET.AGGRESSIVE.NAME
    ) {
      this.setAnimation(SPIDER_SPRITESHEET.AGGRESSIVE.NAME);
      this.speed = this.aggroSpeed;
      this.turnTimer = this.turnBuffer;
      
      // if no jaw, spawn one in + reset the timer
      if (!this.jaw || this.jaw.removeFromWorld) {
        this.jaw = new Jaw(this);
        GAME_ENGINE.addEntity(this.jaw);
      }
    }

    // if can see player, can attack, and is in attack radius
    if (
      this.seesPlayer &&
      this.attackCooldown > this.attackRate &&
      Math.abs(this.x - this.target.x) < this.attackRadius
    ) {
      // change animation and speed
      this.setAnimation(SPIDER_SPRITESHEET.ATTACK.NAME);
      this.speed = this.attackSpeed;
    }

    if (
      this.currentAnimation === SPIDER_SPRITESHEET.RUN.NAME &&
      Math.abs(this.x - this.target.x) < 20
    ) {

      this.speed = this.runSpeed;

      // run away in random direction
      if (Util.randomInt(2) > 0) {
        this.target.x +=
          this.randomRunLength[Util.randomInt(this.randomRunLength.length)]; 
      } else {
        this.target.x -=
          this.randomRunLength[Util.randomInt(this.randomRunLength.length)]; 
      }
    }
  }

  onAnimationComplete() {
    if (this.currentAnimation === SPIDER_SPRITESHEET.DEATH.NAME) {
      this.removeFromWorld = true;
    }

    if (this.currentAnimation === SPIDER_SPRITESHEET.HURT.NAME) {
      this.setAnimation(SPIDER_SPRITESHEET.ROAM.NAME);
    }
  }

  movement() {
    var distance = Util.getDistance(this, this.target);

    this.velocity = {
      x: distance ? ((this.target.x - this.x) / distance) * this.speed : 0,
      y: distance ? ((this.target.y - this.y) / distance) * this.speed : 0,
    };

    // update location

    this.y += this.velocity.y * GAME_ENGINE.clockTick;

    this.onGround = false;
    this.onWall = false;
    let hitHead = false;

    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Tile && this.colliding(entity)) {

        if (this.velocity.y < 0 ) {
          this.y = entity.y + (entity.collider.height / 2) + (this.height / 2);
          hitHead = true;
        }

        if (this.velocity.y > 0) {
          this.y = entity.y - (entity.collider.height / 2) - (this.height / 2);
          this.onGround = true;
        }
      }
      
    }

    this.x += this.velocity.x * GAME_ENGINE.clockTick;

    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Tile && this.colliding(entity)) {
        let isSimilarY = (this.y > (entity.y - entity.collider.height) && this.y < (entity.y + entity.collider.height));
        this.onWall = true;
        if (isSimilarY) {
          if (this.velocity.x < 0 && isSimilarY) {
          this.x = entity.x + (entity.collider.width / 2) + (this.width / 2);
          }

          if (this.velocity.x > 0 && isSimilarY) {
            this.x = entity.x - (entity.collider.width / 2) - (this.width / 2);
          }

          if (!hitHead) {
            this.target.y -= 100;
          } else {
            this.target.x = this.x * 2 - this.target.x;
          }
        }
      }
    }

    if (!this.onGround && !this.onWall) {
      this.y += this.gravity * GAME_ENGINE.clockTick;

      for (let entity of GAME_ENGINE.entities) {
        if (entity instanceof Tile && this.colliding(entity)) {
          this.y = entity.y - (entity.collider.height / 2) - (this.height / 2);
          this.target.y = this.y;
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