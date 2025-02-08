import { Entity } from "../Entities.js";
import { Platform } from "../Map/Platform.js";
import { Player } from "../Player/Player.js";
import * as Util from "../../Utils/Util.js";
import { Collider } from "../Collider.js";

export class Thorn extends Entity {
  constructor(x, y, target) {
    super();
    Object.assign(this, { x, y, target });
    this.assetManager = window.ASSET_MANAGER;

    this.start = { x: this.x, y: this.y };
    this.width = 16;
    this.height = 16;

    this.isAttack = true;

    // distance the thorn has travelled
    this.travelled = 0;
    this.maxRange = 300;
    this.speed = 4;
    this.data = { damage: 20 };
    this.removeFromWorld = false;
    this.collider = new Collider(this.width, this.height);

    var distance = Util.getDistance(this, target);
    this.velocity = {
      x: ((this.target.x - this.x) / distance) * this.speed,
      y: ((this.target.y - this.y) / distance) * this.speed,
    };

    this.addAnimation(
      "placeholder",
      this.assetManager.getAsset("./assets/thorn/thorn.png"),
      32, // Frame width
      32, // Frame height
      1, // Frame count
      0.25 // Frame duration (slower for idle)
    );

    this.setAnimation("placeholder");
  }

  update() {
    // if distance is too big --> remove
    if (this.travelled > this.maxRange) {
      this.removeFromWorld = true;
      return;
    }
    // update x/y using velocity
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // use x/y to update distance travelled
    this.travelled = Util.getDistance(this, this.start);

    // check if colliding with player --> if yes, remove, deal damage
    for (let entity of GAME_ENGINE.entities) {
      if (entity.collider && this.colliding(entity)) {
        if (entity instanceof Player) {
          entity.queueAttack({ damage: 20 });
          this.removeFromWorld = true;
        } else if (entity instanceof Platform) {
          this.removeFromWorld = true;
        }
      }
    }
  }
}

export class Jaw extends Entity {
  constructor(spider) {
    super();
    Object.assign(this, { spider });

    this.x = this.spider.x;
    this.y = this.spider.y;
    this.collider = new Collider(100, 95);
    this.elapsedTime = 0;
    this.attackDuration = 1;
    this.isAttack = true;
  }

  update() {
    this.elapsedTime += GAME_ENGINE.clockTick;

    // remove after duration
    if (this.elapsedTime > this.attackDuration || this.spider.removeFromWorld) {
      this.removeFromWorld = true;
    }

    // update location
    if (this.facing === 0) {
      // if facing right
      this.x = this.spider.x - this.spider.width / 2;
    } else {
      this.x = this.spider.x + this.spider.width / 2;
    }
    this.y = this.spider.y;

    for (let entity of GAME_ENGINE.entities) {
      if (this.colliding(entity)) {
        // If jaw attack collides with player
        if (entity instanceof Player) {
          entity.queueAttack({
            damage: 20,
            x: this.x,
            y: this.y,
            launchMagnitude: 100,
          });

          // Reset spider attack cooldown when attack hits
          this.spider.attackCooldown = 0;
          this.spider.currentAnimation = "run";
          this.spider.jaw = null;
          this.removeFromWorld = true;
        }
      }
    }
  }
}
