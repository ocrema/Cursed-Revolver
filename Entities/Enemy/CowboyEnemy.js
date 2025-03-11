import { Actor } from "../Actor.js";
import { Tile } from "../Map/Tiles/Tile.js";
import { Player } from "../Player/Player.js";
import { Collider } from "../Collider.js";
import * as Util from "../../Utils/Util.js";
import { HealingBottle } from "../Enemy/HealingBottle.js"; // Import Healing Bottle
import { GAME_ENGINE } from "../../main.js";

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
      "holsterWeapon",
      this.assetManager.getAsset("./assets/cowboy/CowBoyHolsterWeapon.png"),
      48,
      64,
      8,
      0.1
    );

    this.addAnimation(
      "shoot",
      this.assetManager.getAsset("./assets/cowboy/CowBoyShoot.png"),
      48,
      64,
      5,
      0.2
    );

    this.addAnimation(
      "death",
      this.assetManager.getAsset("./assets/cowboy/CowBoyDeath.png"),
      48,
      64,
      5,
      0.2
    );

    this.addAnimation(
      "hurt",
      this.assetManager.getAsset("./assets/cowboy/CowBoyHurt.png"),
      48,
      64,
      2,
      0.2
    );

    this.setAnimation("idle"); // Default animation

    this.width = 50;
    this.height = 110;
    this.scale = 3.25;
    this.speed = 200;
    this.health = 80;
    this.maxHealth = this.health;
    this.fireRate = 2.5;
    this.attackCooldown = 0;
    this.isEnemy = true;
    this.flip = false;
    this.gravity = 800;

    this.collider = new Collider(this.width, this.height - 20);

    // Roaming behavior
    this.randomRoamLength = [250, 400, 750, 800];
    this.target = { x: this.x + 200, y: this.y };
    this.velocity = { x: 0, y: this.gravity };

    this.visualRadius = 700; // Detection range
    this.attackRadius = 500; // Attack range
    this.seesPlayer = false;

    this.smokingTimer = 0;
    this.hitTimer = 0;

    this.isDrawingWeapon = false;
    this.isShooting = false; // Ensure this is initialized
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
    if (!this.dead) {
      this.applyDamage();

      if (this.health <= 0) {
        this.setAnimation("death", false);
        this.dead = true;
        //this.onDeath();
        return;
      }

      if (this.effects.frozen > 0 || this.effects.stun > 0) return;

      this.attackCooldown += GAME_ENGINE.clockTick;

      let playerDetected = false;
      let playerTarget = null;

      const player = window.PLAYER;
      if (player && Util.canSee(this, player)) {
        this.seesPlayer = true;
        playerDetected = true;
        playerTarget = player;

        const distance = Util.getDistance(this, player);
        this.flip = player.x < this.x; // Flip to face the player

        // **If in attack range, stop moving and shoot**
        if (distance < this.attackRadius) {
          this.velocity.x = 0; // Stop moving
          if (this.attackCooldown >= this.fireRate) {
            this.attack(player);
          }
        }
        // **Else, move towards the player**
        else if (distance < this.visualRadius) {
          this.chasePlayer(player);
        }
      }

      // **Only reset to idle when no player is detected and not currently shooting**
      if (!playerDetected && !this.isShooting) {
        this.velocity.x = 0;
        this.setAnimation("idle");
      }

      this.newHandleCollisions();

      // **Prevent Cowboy From Sliding**
      if (Math.abs(this.velocity.x) < 5) {
        this.velocity.x = 0;
      }

      this.x += this.velocity.x * GAME_ENGINE.clockTick;
      this.y += this.velocity.y * GAME_ENGINE.clockTick;
    } else {
      this.setAnimation("death", false);
    }

    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  onAnimationComplete() {
    if (this.currentAnimation == "death") {
      this.spawnHealingBottle();

      this.onDeath();
      this.removeFromWorld = true;
      this.collider = null;
    }
  }

  spawnHealingBottle() {
    let bottle = new HealingBottle(this.x, this.y);
    GAME_ENGINE.addEntity(bottle);
    console.log(`HealingBottle spawned at (${this.x}, ${this.y})`);
  }

  attack(player) {
    if (this.isShooting) return; // Prevent attacking multiple times at once

    this.isShooting = true;
    this.setAnimation("shoot", true); // Loop the shooting animation
    this.attackCooldown = 0; // Reset attack cooldown

    GAME_ENGINE.addEntity(new CowboyBullet(this.x, this.y, player));
    window.ASSET_MANAGER.playAsset("./assets/sfx/revolver_shot.ogg", 1);

    setTimeout(() => {
      this.isShooting = false; // Allow attacking again
    }, this.fireRate * 1000); // Adjust timing based on shooting speed
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
      if (this.velocity.x !== 0) {
        // Only log when stopping to avoid spam
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
    if (
      distanceToPlayer <= this.attackRadius &&
      this.attackCooldown >= this.fireRate
    ) {
      //console.log("Cowboy is attacking while moving!");
      this.attack(player);
    }
  }

  applyDamage() {
    this.recieveAttacks();
    this.recieveEffects();
  }

  //unused now
  handleCollisions() {
    for (let entity of GAME_ENGINE.entities) {
      if (entity.isGround && this.colliding(entity)) {
        let thisBottom = this.y + this.height / 2;
        let eTop = entity.y - entity.collider.height / 2;

        let thisLeft = this.x - this.width / 2;
        let thisRight = this.x + this.width / 2;
        let eLeft = entity.x - entity.collider.width / 2;
        let eRight = entity.x + entity.collider.width / 2;

        // **Bottom Collision (Ground)**
        let collideBottom =
          thisBottom > eTop &&
          this.y < eTop &&
          thisRight > eLeft &&
          thisLeft < eRight;

        if (collideBottom) {
          this.y = eTop - this.height / 2;
          this.velocity.y = 0;
          this.onGround = true;
        }

        // **Side Collision (Left or Right)**
        let collideLeft =
          thisRight > eLeft &&
          thisLeft < eLeft &&
          this.y + this.height / 2 > eTop;
        let collideRight =
          thisLeft < eRight &&
          thisRight > eRight &&
          this.y + this.height / 2 > eTop;

        if (collideLeft) {
          this.x = eLeft - this.width / 2;
          this.velocity.x = 0;
        } else if (collideRight) {
          this.x = eRight + this.width / 2;
          this.velocity.x = 0;
        }
      }
    }
  }

  newHandleCollisions() {
    // **Check the tiles at different points**
    let bottomTile = window.TILEMAP.getTileAt(this.x, this.y + this.height / 2); // Bottom center
    let leftTile = window.TILEMAP.getTileAt(this.x - this.width / 2, this.y); // Left side
    let rightTile = window.TILEMAP.getTileAt(this.x + this.width / 2, this.y); // Right side

    let tile = bottomTile || leftTile || rightTile; // Pick the most relevant tile
    if (!tile) return;

    if (this.colliding(tile)) {
      let thisBottom = this.y + this.height / 2;
      let eTop = tile.y - tile.collider.height / 2;

      let thisLeft = this.x - this.width / 2;
      let thisRight = this.x + this.width / 2;
      let eLeft = tile.x - tile.collider.width / 2;
      let eRight = tile.x + tile.collider.width / 2;

      // **Bottom Collision (Ground)**
      let collideBottom =
        thisBottom > eTop &&
        this.y < eTop &&
        thisRight > eLeft &&
        thisLeft < eRight;

      if (collideBottom) {
        this.y = eTop - this.height / 2;
        this.velocity.y = 0;
        this.onGround = true;
      }

      // **Side Collision (Left or Right)**
      let collideLeft =
        thisRight > eLeft &&
        thisLeft < eLeft &&
        this.y + this.height / 2 > eTop;
      let collideRight =
        thisLeft < eRight &&
        thisRight > eRight &&
        this.y + this.height / 2 > eTop;

      if (collideLeft) {
        this.x = eLeft - this.width / 2;
        this.velocity.x = 0;
      } else if (collideRight) {
        this.x = eRight + this.width / 2;
        this.velocity.x = 0;
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

    // **Compute initial direction ONCE and store it**
    const angle = Math.atan2(target.y - y, target.x - x);
    this.velocity = {
      x: Math.cos(angle) * this.speed,
      y: Math.sin(angle) * this.speed,
    };

    // **Store rotation angle (in radians)**
    this.rotation = angle;

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
    // Move the bullet in its fixed direction
    this.x += this.velocity.x * GAME_ENGINE.clockTick;
    this.y += this.velocity.y * GAME_ENGINE.clockTick;

    // Check collision with player
    const player = window.PLAYER;

    // **Quick AABB Bounding Box Check First**
    if (Math.abs(this.x - player.x) < 50 && Math.abs(this.y - player.y) < 50) {
      // **Only call `colliding()` if player is near**
      if (this.colliding(player)) {
        player.queueAttack({ damage: this.damage });
        this.removeFromWorld = true;
      }
    }

    for (let entity of window.SOLID_TILES) {
      if (entity.collider && this.colliding(entity)) {
        this.removeFromWorld = true;
      }
    }
  }

  draw(ctx) {
    ctx.save();

    // Move to bullet's position and rotate to match trajectory
    ctx.translate(this.x - GAME_ENGINE.camera.x, this.y - GAME_ENGINE.camera.y);
    ctx.rotate(this.rotation);

    // Draw the bullet rotated in its initial direction
    ctx.drawImage(
      this.assetManager.getAsset("./assets/cowboy/CowBoyBullet.png"),
      -15, // Center rotation
      -10,
      30,
      20
    );

    ctx.restore();
  }
}
