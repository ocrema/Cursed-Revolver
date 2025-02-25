import { Actor } from "../Entities.js";
import { Tile } from "../Map/Tiles/Tile.js";
import { Player } from "../Player/Player.js";
import { Collider } from "../Collider.js";
import * as Util from "../../Utils/Util.js";
import { HealingBottle } from "../Enemy/HealingBottle.js"; // Import Healing Bottle



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
      7, // Frame count
      0.15 // Frame duration
    );

    // Load Animations
    this.addAnimation(
      "smoking",
      this.assetManager.getAsset("./assets/cowboy/CowBoySmokingIdle.png"),
      48, // Frame width
      64, // Frame height
      7, // Frame count
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
      64,
      7,
      0.12
    );

    this.addAnimation(
      "shoot",
      this.assetManager.getAsset("./assets/cowboy/CowBoyShoot.png"),
      48,
      64,
      5,
      0.2
    );

    this.setAnimation("idle"); // Default animation

    this.width = 50;
    this.height = 110;
    this.scale = 3;
    this.speed = 200;
    this.health = 20;
    this.maxHealth = 20;
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
    this.attackRadius = 300; // Attack range
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
    this.drawEffects(ctx);
  }


update() {
  
  this.applyDamage();

  if (this.health <= 0) {
    this.spawnHealingBottle();
    this.removeFromWorld = true;
    this.collider = null;
  }
  
  if (this.effects.frozen > 0 || this.effects.stun > 0) return;
  
  this.attackCooldown += GAME_ENGINE.clockTick;

  let playerDetected = false;
   let playerTarget = null;

  if (!this.onGround) {
      this.velocity.y += this.gravity * GAME_ENGINE.clockTick;
  } else {
      this.velocity.y = 0;
  }

  for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Player && Util.canSee(this, entity)) {
          this.seesPlayer = true;
          playerDetected = true;
          playerTarget = entity;

          const distance = Util.getDistance(this, entity);

          if (!this.isDrawingWeapon) {
              if (distance < this.attackRadius && this.attackCooldown > this.fireRate) {
                  this.attack(entity);
              } else if (distance < this.visualRadius) {
                  this.chasePlayer(entity);
              }
          }
      }
  }

  // **If No Player Is Detected, Stop Moving**
  if (!playerDetected) {
      this.velocity.x = 0;
      this.setAnimation("idle");
  }

  this.handleCollisions();

  // **Prevent Cowboy From Sliding Past Player**
  if (Math.abs(this.velocity.x) < 5) {
      this.velocity.x = 0; 
  }

  this.x += this.velocity.x * GAME_ENGINE.clockTick;
  this.y += this.velocity.y * GAME_ENGINE.clockTick;

  
}


  spawnHealingBottle() {
    let bottle = new HealingBottle(this.x, this.y);
    GAME_ENGINE.addEntity(bottle);
    console.log(`HealingBottle spawned at (${this.x}, ${this.y})`);
  }


  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount); // Ensure health doesn't exceed max
    console.log(`Player healed for ${amount}. Current Health: ${this.health}`);
  }


  attack(player) {
    this.setAnimation("shoot");
    this.attackCooldown = 0;

    GAME_ENGINE.addEntity(new CowboyBullet(this.x, this.y, player));
  }

  attack(player) {
    // If cowboy is already drawing weapon, don't reset animation
    if (this.isDrawingWeapon) return;

    this.setAnimation("drawWeapon");
    this.isDrawingWeapon = true;

    // After "drawWeapon" finishes, switch to shooting
    setTimeout(() => {
      this.setAnimation("shoot");
      GAME_ENGINE.addEntity(new CowboyBullet(this.x, this.y, player));
      this.attackCooldown = this.fireRate;

      // Reset back to idle after shooting
      setTimeout(() => {
        this.setAnimation("idle");
        this.isDrawingWeapon = false;
      }, 200); // Adjust timing based on shoot animation duration
    }, 600); // Adjust timing based on drawWeapon animation duration
  }

  chasePlayer(player) {
    if (this.currentAnimation !== "walk" && this.velocity.x !== 0) {
        this.setAnimation("walk");
    }

    this.flip = player.x < this.x; 
    const direction = this.flip ? -1 : 1;

    // **Accurate Collider-Based Positions**
    const cowboyLeft = this.x - this.collider.width / 2;
    const cowboyRight = this.x + this.collider.width / 2;
    const playerLeft = player.x - player.collider.width / 2;
    const playerRight = player.x + player.collider.width / 2;

    const distanceToPlayer = Math.abs(Math.abs(this.x) - Math.abs(player.x));
    const stopDistance = 310; // Cowboy stops moving at this distance

    // console.log(`Cowboy Position: L=${cowboyLeft}, R=${cowboyRight}`);
    // console.log(`Player Position: L=${playerLeft}, R=${playerRight}`);
    // console.log(`Distance to Player: ${distanceToPlayer}, Stop Distance: ${stopDistance}`);

    // **If close enough, stop moving but keep shooting**
    if (distanceToPlayer <= stopDistance) {
        if (this.velocity.x !== 0) {  // Only log when stopping to avoid spam
            //console.log("Cowboy Stopping - Close Enough to Player");
        }
        this.velocity.x = 0;  
        this.setAnimation("idle");  

        // **Ensure continuous shooting**
        if (this.attackCooldown >= this.fireRate) {
            //console.log("Cowboy is attacking the player!");
            this.attack(player);
        }
        return; 
    }

    // **Only update velocity if not within stop distance**
    this.velocity.x = direction * this.speed; 

    // **Attack while moving if within attack range**
    if (distanceToPlayer <= this.attackRadius && this.attackCooldown >= this.fireRate) {
        //console.log("Cowboy is attacking while moving!");
        this.attack(player);
    }
  }


  applyDamage() {
    this.recieveAttacks();
    this.recieveEffects();
  }

  handleCollisions() {
    for (let entity of GAME_ENGINE.entities) {
        if (entity instanceof Tile && this.colliding(entity)) {
            let thisBottom = this.y + this.height / 2;
            let eTop = entity.y - entity.collider.height / 2;

            let collideBottom = 
                thisBottom > eTop &&
                this.y < eTop &&
                this.x + this.width / 2 > entity.x - entity.collider.width / 2 &&
                this.x - this.width / 2 < entity.x + entity.collider.width / 2;

            if (collideBottom) {
                this.y = eTop - this.height / 2;
                this.velocity.y = 0;
                this.onGround = true;
            }
        }
    }
  }

}

export class CowboyBullet extends Actor {
  constructor(x, y, target) {
    super();
    Object.assign(this, { x, y, target });

    this.isAttack = true;
    this.speed = 1000;
    this.damage = 5;
    this.removeFromWorld = false;
    this.assetManager = window.ASSET_MANAGER;

    this.collider = new Collider(20, 10);
    //this.velocity = Util.getDirection(this, target, this.speed);

    // **Fix: Compute bullet velocity manually**
    const distance = Util.getDistance(this, target);
    this.velocity = {
      x: ((target.x - this.x) / distance) * this.speed,
      y: ((target.y - this.y) / distance) * this.speed,
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
