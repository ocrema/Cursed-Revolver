import { Actor } from "../Actor.js";
import { Player } from "../Player/Player.js";
import { Collider } from "../Collider.js";
import * as Util from "../../Utils/Util.js";
import { CowboyBullet } from "./CowboyEnemy.js"; // Import Cowboy Bullet
import { HealingBottle } from "../Enemy/HealingBottle.js"; // Ensure this is the correct path
import { GAME_ENGINE } from "../../main.js";

export class StaticCowboyEnemy extends Actor {
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
      48,
      5,
      0.2
    );

    this.setAnimation("idle"); // Default animation

    this.width = 50;
    this.height = 110;
    this.scale = 3.25;
    this.health = 20;
    this.maxHealth = 20;
    this.fireRate = 2.5;
    this.attackCooldown = 0;
    this.isEnemy = true;
    this.flip = false; // False = facing right, True = facing left

    this.collider = new Collider(this.width, this.height);

    this.visualRadius = 700; // Detection range
    this.attackRadius = 700; // Attack range (Same as visual range since it only shoots)
    this.seesPlayer = false;
    this.dead = false;
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
    if (!this.dead) {
      this.drawEffects(ctx);
    }
  }

  update() {
    if (!this.dead) {
      this.applyDamage();

      // **Check if the cowboy dies**
      if (this.health <= 0) {
        //console.log("Static Cowboy has died!");
        this.dead = true;
        this.setAnimation("death", false);
        this.onDeath();
        return;
      }

      if (this.effects.frozen > 0 || this.effects.stun > 0) return;
      this.attackCooldown += GAME_ENGINE.clockTick;

      let playerDetected = false;
      let playerTarget = null;

      const player = window.PLAYER;
      if (player && Util.canSee(this, player) && Util.canAttack(this, player)) {
        this.seesPlayer = true;
        playerDetected = true;
        playerTarget = player;

        // **Flip the cowboy based on player's position**
        this.flip = player.x < this.x; // Flip if player is on the left

        if (this.attackCooldown >= this.fireRate) {
          this.attack(player);
        }
      }

      // const player = window.PLAYER;
      // if (player && Util.canSee(this, player) && Util.canAttack(this, player)) {
      //   this.seesPlayer = true;
      //   playerDetected = true;
      //   playerTarget = player;

      //   // **Flip the cowboy based on player's position**
      //   this.flip = player.x < this.x; // Flip if player is on the left

      //   if (this.attackCooldown >= this.fireRate) {
      //     this.attack(player);
      //   }
      // }

      // **If no player is detected and not currently shooting, return to idle**
      if (!playerDetected && !this.isShooting) {
        this.setAnimation("idle");
      }
    }

    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  onAnimationComplete() {
    if (this.currentAnimation == "death") {
      this.spawnHealingBottle();

      this.removeFromWorld = true;
      this.collider = null;
    }
  }

  attack(player) {
    if (this.isShooting) return; // Prevent spamming attack

    this.isShooting = true; // Set shooting flag
    this.setAnimation("shoot", true); // Play shooting animation once
    this.attackCooldown = 0;

    GAME_ENGINE.addEntity(new CowboyBullet(this.x, this.y, player));
    window.ASSET_MANAGER.playAsset("./assets/sfx/revolver_shot.ogg", 1);

    // **Wait for the shooting animation to complete before switching back to idle**
    setTimeout(() => {
      this.isShooting = false; // Reset shooting flag
      if (!Util.canSee(this, player)) {
        // Ensure the player is truly out of range
        this.setAnimation("idle");
      }
    }, 1000); // Adjust timing to match shoot animation duration
  }

  applyDamage() {
    this.recieveAttacks(); // Fixed typo from `recieveAttacks()`
    this.recieveEffects(); // Fixed typo from `recieveEffects()`
  }

  spawnHealingBottle() {
    let bottle = new HealingBottle(this.x, this.y); // Spawn at cowboy's position
    GAME_ENGINE.addEntity(bottle);
    console.log(`HealingBottle spawned at (${this.x}, ${this.y})`);
  }
}
