import { Actor } from "../Entities.js";
import { Player } from "../Player/Player.js";
import { Thorn } from "./Attack.js";
import * as Util from "../../Utils/Util.js";
import { Collider } from "../Collider.js";
import { ENEMY_SPRITESHEET } from "../../Globals/Constants.js";

export class Cactus extends Actor {
  constructor(x, y) {
    super();
    Object.assign(this, { x, y });
    // Animation
    this.assetManager = window.ASSET_MANAGER;

    this.addAnimation(
      "placeholder",
      this.assetManager.getAsset(ENEMY_SPRITESHEET.CACTUS.URL),
      32, // Frame width
      32, // Frame height
      1, // Frame count
      0.25 // Frame duration (slower for idle)
    );

    this.setAnimation("placeholder");
    this.width = 160;
    this.height = 250;
    this.scale = 6.5;

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
    this.dead = false;
  }

  update() {
    // apply attack damage
    this.recieveAttacks();
    this.recieveEffects();

    if (this.health <= 0) {
      this.removeFromWorld = true;
    }

    if (this.effects.frozen > 0 || this.effects.stun > 0) return;

    this.attackTime += GAME_ENGINE.clockTick;

    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Player) {
        // cactus sees player
        if (
          Util.canSee(this, entity) &&
          this.attackTime > this.fireRate &&
          Util.canAttack(new Thorn(this.x, this.y, entity), entity)
        ) {
          // this.setAnimation("attack");
          this.attackTime = 0;
          GAME_ENGINE.addEntity(new Thorn(this.x, this.y, entity));
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
