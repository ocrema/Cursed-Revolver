import { Actor } from "../Entities.js";
import { Platform } from "../Map/Platform.js";
import { Player } from "../Player/Player.js";
import { Collider } from "../Collider.js";
import * as Util from "../../Utils/Util.js";

export class CowboyEnemy extends Actor {
  constructor(x, y) {
    super();
    Object.assign(this, { x, y });

    this.assetManager = window.ASSET_MANAGER;

    // Load Animations
    this.addAnimation(
      "idle",
      this.assetManager.getAsset("./assets/cowboy/CowBoyIdle.png"),
      48, // Frame width
      64, // Frame height
      7,   // Frame count
      0.15 // Frame duration
    );
    
    // Load Animations
    this.addAnimation(
      "smoking",
      this.assetManager.getAsset("./assets/cowboy/CowBoySmokingIdle.png"),
      48, // Frame width
      64, // Frame height
      7,   // Frame count
      0.15 // Frame duration
    );

    this.addAnimation(
      "walk",
      this.assetManager.getAsset("./assets/cowboy/CowBoyWalking.png"),
      48,
      64,
      8,
      0.1
    );

    this.addAnimation(
      "drawWeapon",
      this.assetManager.getAsset("./assets/cowboy/CowBoyDrawWeapon.png"),
      49, 
      55, 
      7,
      0.12
    );

    this.addAnimation(
      "shoot",
      this.assetManager.getAsset("./assets/cowboy/CowBoyShoot.png"),
      48,
      48,
      5,
      0.2
    );

    this.setAnimation("idle"); // Default animation

    this.width = 50;
    this.height = 120;
    this.scale = 3;
    this.speed = 200;
    this.health = 120;
    this.maxHealth = 120;
    this.fireRate = 2.5;
    this.attackCooldown = 0;
    this.isEnemy = true;
    this.flip = false;
    this.gravity = 800;

    this.collider = new Collider(this.width, this.height);
  
    // Roaming behavior
    this.randomRoamLength = [250, 400, 750, 800];
    this.target = { x: this.x + 200, y: this.y }; 
    this.velocity = { x: 0, y: this.gravity };

    this.visualRadius = 700; // Detection range
    this.attackRadius = 700; // Attack range
    this.seesPlayer = false;

    this.smokingTimer = 0;

    this.isDrawingWeapon = false;
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

  update() {
    this.attackCooldown += GAME_ENGINE.clockTick;
    this.smokingTimer -= GAME_ENGINE.clockTick;
    this.recieveEffects();
    this.onGround = false;
    this.onWall = false;

    let playerDetected = false;
    let playerTarget = null;

    // Check for player detection
    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Player && Util.canSee(this, entity)) {
        this.seesPlayer = true;
        playerDetected = true;
        playerTarget = entity;

        const distance = Util.getDistance(this, entity);


        // If currently drawing weapon, don't interrupt
        if (!this.isDrawingWeapon) {
          if (distance < this.attackRadius && this.attackCooldown > this.fireRate) {
            this.attack(entity);
          } else if (distance < this.visualRadius) {
            this.chasePlayer(entity);
          }
        }
        // // Attack when in range
        // if (distance < this.attackRadius && this.attackCooldown > this.fireRate) {
        //   this.attack(entity);
        // } 
        // // Chase if player is seen but not in range
        // else if (distance < this.visualRadius) {
        //   this.chasePlayer(entity);
        // }
      }
    }

    // if (!playerDetected) {
    //   this.seesPlayer = false;
    //   this.roam();
    // }

    // **When Player is OUT of Sight**
    if (!playerDetected) {
      this.seesPlayer = false;

      // **Idle for 1 second, then transition to smoking**
      if (this.smokingTimer <= 0) {
        this.setAnimation("smoking");
      } else {
        this.setAnimation("idle");
      }
    } else {
      // Reset smoking transition timer
      this.smokingTimer = 1.0; // 1 second before transitioning to smoking
    }

    this.applyDamage();

    if (this.health <= 0) {
      this.removeFromWorld = true;
    }
  }

  // attack(player) {
  //   this.setAnimation("shoot");
  //   this.attackCooldown = 0;
    
  //   GAME_ENGINE.addEntity(new CowboyBullet(this.x, this.y, player));
  // }

  attack(player) {
    // If cowboy is already drawing weapon, don't reset animation
    if (this.isDrawingWeapon) return;

    this.setAnimation("drawWeapon");
    this.isDrawingWeapon = true;

    // After "drawWeapon" finishes, switch to shooting
    setTimeout(() => {
      this.setAnimation("shoot");
      GAME_ENGINE.addEntity(new CowboyBullet(this.x, this.y, player));
      this.attackCooldown = 0;

      // Reset back to idle after shooting
      setTimeout(() => {
        this.setAnimation("idle");
        this.isDrawingWeapon = false;
      }, 200); // Adjust timing based on shoot animation duration

    }, 600); // Adjust timing based on drawWeapon animation duration
  }

  chasePlayer(player) {
    if (this.currentAnimation !== "walk") {
      this.setAnimation("walk");
    }

    this.flip = player.x < this.x;
    const direction = this.flip ? -1 : 1;
    this.x += direction * this.speed * GAME_ENGINE.clockTick;
  }

  roam() {
    // Switch to idle state if close to target
    if (Math.abs(this.x - this.target.x) < 5) {
      this.setAnimation("idle");

      if (this.velocity.x < 0) {
        this.target.x += this.randomRoamLength[Util.randomInt(this.randomRoamLength.length)];
      } else {
        this.target.x -= this.randomRoamLength[Util.randomInt(this.randomRoamLength.length)];
      }
    } else {
      this.setAnimation("walk");
      this.velocity.x = ((this.target.x - this.x) / Math.abs(this.target.x - this.x)) * this.speed;
      this.x += this.velocity.x * GAME_ENGINE.clockTick;
    }
  }

  applyDamage() {
    for (let attack of this.recieved_attacks) {
      this.health -= attack.damage;
    }
    this.recieved_attacks = [];
  }
}

export class CowboyBullet extends Actor {
  constructor(x, y, target) {
    super();
    Object.assign(this, { x, y, target });

    this.speed = 1000;
    this.damage = 25;
    this.removeFromWorld = false;
    this.assetManager = window.ASSET_MANAGER;

    this.collider = new Collider(20, 10);
    //this.velocity = Util.getDirection(this, target, this.speed);

     // **Fix: Compute bullet velocity manually**
     const distance = Util.getDistance(this, target);
     this.velocity = {
       x: ((target.x - this.x) / distance) * this.speed,
       y: ((target.y - this.y) / distance) * this.speed
     };

      // Calculate rotation angle in radians
    this.rotation = Math.atan2(this.velocity.y, this.velocity.x);

    // Determine if the bullet is moving left
    this.isFlipped = this.velocity.x < 0;

    this.addAnimation(
      "bullet",
      this.assetManager.getAsset("./assets/cowboy/CowBoyBullet.png"),
      30,
      40,
      1,
      0.5
    );

    this.setAnimation("bullet");
  }

  update() {
    this.x += this.velocity.x * GAME_ENGINE.clockTick;
    this.y += this.velocity.y * GAME_ENGINE.clockTick;

    //this.rotation = Math.atan2(this.velocity.y, this.velocity.x);

    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Player && this.colliding(entity)) {
        entity.queueAttack({ damage: this.damage });
        this.removeFromWorld = true;
      }
    }
  }
  
}
