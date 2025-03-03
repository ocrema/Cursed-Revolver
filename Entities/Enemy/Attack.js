import { Entity } from "../Entities.js";
import { Player } from "../Player/Player.js";
import * as Util from "../../Utils/Util.js";
import { Collider } from "../Collider.js";
import { Tile } from "../Map/Tiles/Tile.js";
import { Spider } from "./Spider.js";

export class Thorn extends Entity {
  constructor(x, y, target, maxRange) {
    super();
    Object.assign(this, { x, y, target, maxRange });
    this.assetManager = window.ASSET_MANAGER;

    this.start = { x: this.x, y: this.y };
    this.width = 16;
    this.height = 16;

    this.isAttack = true;

    // distance the thorn has travelled
    this.travelled = 0;
    this.speed = 8;
    this.data = { damage: 20 };
    this.removeFromWorld = false;
    this.collider = new Collider(this.width, this.height);
    this.scale = 2;

    var distance = Util.getDistance(this, target);
    this.velocity = {
      x: ((this.target.x - this.x) / distance) * this.speed,
      y: ((this.target.y - this.y) / distance) * this.speed,
    };

    this.angle = Util.getAngle(this, target);

    this.addAnimation(
      "thorn",
      this.assetManager.getAsset("./assets/enemy/thorn/thorn.png"),
      64, // Frame width
      64, // Frame height
      1, // Frame count
      0.25 // Frame duration (slower for idle)
    );

    this.setAnimation("thorn");
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
        } else if (entity instanceof Tile) {
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
    this.isAttack = true;
  }

  update() {
    this.elapsedTime += GAME_ENGINE.clockTick;

    if (this.spider.removeFromWorld) {
      this.removeFromWorld = true;
    }

    // update location
    if (this.spider.flip === 0) {
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
          if (this.spider instanceof Spider) {
            window.ASSET_MANAGER.playAsset("./assets/sfx/spider_attack.wav", 1);
          }

          // Reset spider attack cooldown when attack hits
          this.spider.attackCooldown = 0;
          this.spider.jaw = null;
          this.delete();
        }
      }
    }
  }

  delete() {
    this.removeFromWorld = true;
  }
}
