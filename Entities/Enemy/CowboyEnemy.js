import { Actor } from "../Entities.js";
import { Player } from "../Player/Player.js";
import { Collider } from "../Collider.js";
import * as Util from "../../Utils/Util.js";

export class CowboyEnemy extends Actor {
  constructor(x, y) {
    super();
    Object.assign(this, { x, y });
    console.log(` Cowboy added at (${this.x}, ${this.y})`);

    this.assetManager = window.ASSET_MANAGER;
    this.width = 100;
    this.height = 180;
    this.scale = 3;
    this.speed = 250;
    this.health = 120;
    this.maxHealth = 120;
    this.fireRate = 2.5; // Attack cooldown in seconds
    this.attackCooldown = 0;
    this.isEnemy = true;
    this.seesPlayer = false;
    this.flip = false; // Flip sprite based on direction

    this.collider = new Collider(this.width, this.height);
    this.state = "idle"; // Initial state

    // Load Animations
    this.addAnimation(
      "idle",
     //this.assetManager.getAsset("./assets/cowboy/CowBoyIdle.png"),
      this.assetManager.getAsset("./assets/cowboy/CB.png"),
      64, // Frame width
      64, // Frame height
      7,  // Frame count
      0.15 // Frame duration
    );

    this.addAnimation(
      "walk",
      this.assetManager.getAsset("./assets/cowboy/CowBoyWalking.png"),
      64,
      64,
      8,
      0.1
    );

    this.addAnimation(
      "drawWeapon",
      this.assetManager.getAsset("./assets/cowboy/CowBoyDrawWeapon.png"),
      64,
      64,
      6,
      0.12
    );

    this.addAnimation(
      "shoot",
      this.assetManager.getAsset("./assets/cowboy/CowBoyShoot.png"),
      64,
      64,
      5,
      0.1
    );

    this.addAnimation(
      "rapidFire",
      this.assetManager.getAsset("./assets/cowboy/CowBoyRapidFire.png"),
      64,
      64,
      11,
      0.1
    );

    this.addAnimation(
      "quickDraw",
      this.assetManager.getAsset("./assets/cowboy/CowBoyQuickDrawShot.png"),
      64,
      64,
      18,
      0.08
    );

    this.addAnimation(
      "smoking",
      this.assetManager.getAsset("./assets/cowboy/CowBoySmokingIdle.png"),
      64,
      64,
      9,
      0.2
    );

    this.setAnimation("idle"); // Start in idle
    console.log(" Cowboy animations loaded:", this.animations);

    console.log(`Cowboy spawned at (${this.x}, ${this.y})`);

  }

  update() {
    console.log(`Cowboy update running at (${this.x}, ${this.y}), HP: ${this.health}`);
    
    this.attackCooldown += GAME_ENGINE.clockTick;

    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Player) {
        const distance = Util.getDistance(this, entity);
        const canSeePlayer = Util.canSee(this, entity);

        if (canSeePlayer) {
          this.seesPlayer = true;
          if (distance < 400 && this.attackCooldown > this.fireRate) {
            this.attack(entity);
          } else if (distance < 800) {
            this.chasePlayer(entity);
          }
        }
      }
    }

    this.applyDamage(); // Process attacks received
    this.handleStateChanges(); // Manage animations

    if (this.health <= 0) {
      console.log("Cowboy removed due to 0 HP");
      this.removeFromWorld = true;
      console.log("Cowboy was removed from world!");
    }
  }

  draw(ctx) {
    console.log(`Drawing Cowboy at (${this.x}, ${this.y}) with animation: ${this.currentAnimation}`);
    
    if (!this.currentAnimation) {
        console.log(`Cowboy at (${this.x}, ${this.y}) has no active animation!`);
        return;
    }

    super.draw(ctx);
}


  attack(player) {
    this.setAnimation("shoot");
    this.attackCooldown = 0;
    
    // Fire bullet toward player
    GAME_ENGINE.addEntity(new CowboyBullet(this.x, this.y, player));
  }

  chasePlayer(player) {
    this.setAnimation("walk");
    this.flip = player.x < this.x;
    
    const direction = this.flip ? -1 : 1;
    this.x += direction * this.speed * GAME_ENGINE.clockTick;
  }

  handleStateChanges() {
    if (!this.seesPlayer && this.attackCooldown < 1) {
      this.setAnimation("smoking");
    } else if (this.attackCooldown < this.fireRate) {
      this.setAnimation("drawWeapon");
    }
  }

  applyDamage() {
    for (let attack of this.recieved_attacks) {
        console.log(` Cowboy took damage: ${attack.damage}`);
        this.health -= attack.damage;
    }
    console.log(`Cowboy health after damage: ${this.health}`);
    this.recieved_attacks = [];
  }
}


export class CowboyBullet extends Actor {
  constructor(x, y, target) {
    super();
    Object.assign(this, { x, y, target });

    this.speed = 500;
    this.damage = 25;
    this.removeFromWorld = false;
    this.assetManager = window.ASSET_MANAGER;

    this.collider = new Collider(20, 10);
    this.velocity = Util.getDirection(this, target, this.speed);

    this.addAnimation(
      "bullet",
      this.assetManager.getAsset("./assets/cowboy/CowBoyBullet.png"),
      20,
      10,
      1,
      0.1
    );

    this.setAnimation("bullet");
  }

  update() {
    this.x += this.velocity.x * GAME_ENGINE.clockTick;
    this.y += this.velocity.y * GAME_ENGINE.clockTick;

    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Player && this.colliding(entity)) {
        entity.queueAttack({ damage: this.damage });
        this.removeFromWorld = true;
      }
    }
    if (this.removeFromWorld) {
        console.log(` Cowboy at (${this.x}, ${this.y}) is marked for removal!`);
    }
    
  }

  draw(ctx) {
    if (!this.currentAnimation) {
        console.log(`Cowboy at (${this.x}, ${this.y}) has no active animation`);
        return;
    }

    console.log(`Drawing Cowboy at (${this.x}, ${this.y}) with animation: ${this.currentAnimation}`);

    super.draw(ctx);
}

}
