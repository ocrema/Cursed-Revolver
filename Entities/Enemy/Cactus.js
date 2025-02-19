import { Actor } from "../Entities.js";
import { Player } from "../Player/Player.js";
import { Thorn } from "./Attack.js";
import * as Util from "../../Utils/Util.js";
import { Collider } from "../Collider.js";
import { ENEMY_SPRITESHEET } from "../../Globals/Constants.js";
import { GAME_ENGINE } from "../../main.js";

export class Cactus extends Actor {
  constructor(x, y) {
    super();
    Object.assign(this, { x, y });

    // Animation
    this.assetManager = window.ASSET_MANAGER;

    this.addAnimation(
      "aggressive",
      this.assetManager.getAsset("./assets/enemy/cactus/aggro.png"),
      160, // Frame width
      160, // Frame height
      1, // Frame count
      0.25, // Frame duration (slower for idle)
      false 
    );
    this.addAnimation(
      "attack",
      this.assetManager.getAsset("./assets/enemy/cactus/attack.png"),
      160, // Frame width
      160, // Frame height
      3, // Frame count
      0.25, // Frame duration (slower for idle)
      false 
    );
    this.addAnimation(
      "default",
      this.assetManager.getAsset("./assets/enemy/cactus/cactus.png"),
      160, // Frame width
      160, // Frame height
      1, // Frame count
      0.25, // Frame duration (slower for idle)
      false 
    ); 
    this.addAnimation(
      "damage",
      this.assetManager.getAsset("./assets/enemy/cactus/damage.png"),
      160, // Frame width
      160, // Frame height
      2, // Frame count
      0.25, // Frame duration (slower for idle)
      false 
    );
    this.addAnimation(
      "die",
      this.assetManager.getAsset("./assets/enemy/cactus/die.png"),
      160, // Frame width
      160, // Frame height
      4, // Frame count
      0.25, // Frame duration (slower for idle)
      false 
    );
    this.addAnimation(
      "idle",
      this.assetManager.getAsset("./assets/enemy/cactus/idle.png"),
      160, // Frame width
      160, // Frame height
      8, // Frame count
      0.25, // Frame duration (slower for idle)
      false
    );

    this.setAnimation("default");
    this.width = 160;
    this.height = 250;
    this.scale = 1;

    this.tookDamage = false;
    this.dead = false;

    // Health / Attack
    this.health = 50;
    this.maxHealth = 50;
    this.fireRate = 1; // max time before attack
    this.attackTime = 0; // time since attack

    // Movement
    this.collider = new Collider(this.width, this.height);
    this.visualRadius = 400; // pixels away from center

    // Flags
    this.isEnemy = true;

      // For Animation
    this.tookDamage = false;
    this.dead = false;
    this.seesPlayer = false;
    this.attack = true;
    this.idleTimer = 0;
    this.idleCooldown = [5, 7, 10, 13, 15];
  }

  update() {
    this.recieveEffects();

    this.attackTime += GAME_ENGINE.clockTick;
    this.idleTimer += GAME_ENGINE.clockTick;

    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Player) {
        // cactus sees player
        if (
          Util.canSee(this, entity) &&
          this.attackTime > this.fireRate &&
          Util.canAttack(new Thorn(this.x, this.y, entity), entity)
        ) {
          this.attacking = true;
          this.attackTime = 0;
          GAME_ENGINE.addEntity(new Thorn(this.x, this.y, entity));
        } else if (Util.canSee(this, entity)) {
          this.seesPlayer = true;
        }
      }
    }

    // apply attack damage
    for (let attack of this.recieved_attacks) {
      this.tookDamage = true;
      this.health -= attack.damage;
    }
    this.recieved_attacks = [];

    if (this.health <= 0) {
      this.removeFromWorld = true;
    }

    this.changeAnimation();
  }

  changeAnimation() {
    if (this.seesPlayer && this.currentAnimation !== "aggressive") {
      this.setAnimation("aggressive");
    }

    if (this.attacking) {
      this.setAnimation("attack");
    }

    if (this.tookDamage && this.currentAnimation !== "damage") {
      this.setAnimation("damage");
    }

    if (this.dead && this.currentAnimation !== "die") {
      this.setAnimation("die");
    }

    console.log(this.currentAnimation);
  }
  
  onAnimationComplete() {
    this.setAnimation("default");
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
}
