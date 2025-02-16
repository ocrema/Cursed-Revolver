import { Collider } from "./Collider.js";
import { Entity } from "./Entities.js";
import * as Util from "../Utils/Util.js";
import { GAME_ENGINE } from "../main.js";
import { Camera } from "../Core/Camera.js";

export class Fireball extends Entity {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.dir = 0; // in radians
    this.entityOrder = 3;
    this.speed = 1000;
    //this.colliders = [newCollider(50, 50, 0, 0)];
    this.collider = new Collider(50, 50);
    this.isAttack = true;
    this.experationTimer = 3;
    this.exploded = false;
    window.ASSET_MANAGER.playAsset("./assets/sfx/fireball.wav");
  }

  update() {
    if (this.exploded) {
      this.experationTimer -= GAME_ENGINE.clockTick;
      if (this.experationTimer <= 0) this.removeFromWorld = true;
      this.camera = Camera.getInstance();
      this.camera.triggerShake(25);
      return;
    }

    this.x += Math.cos(this.dir) * this.speed * GAME_ENGINE.clockTick;
    this.y += Math.sin(this.dir) * this.speed * GAME_ENGINE.clockTick;

    for (let e of GAME_ENGINE.entities) {
      if (e.isPlayer || e.isAttack) continue;

      if (this.colliding(e)) {
        this.exploded = true;
        this.collider.width = 200;
        this.collider.height = 200;

        for (let e2 of GAME_ENGINE.entities) {
          if (!e2.isActor) continue;

          if (this.colliding(e2)) {
            e2.queueAttack({
              damage: 10,
              x: this.x,
              y: this.y,
              burn: 5,
              launchMagnitude: 3000,
            });
          }
        }
        this.collider = null;
        this.experationTimer = 0.5;
        window.ASSET_MANAGER.playAsset("./assets/sfx/fireball_impact.wav");
        break;
      }
    }

    this.experationTimer -= GAME_ENGINE.clockTick;
    if (this.experationTimer <= 0) this.removeFromWorld = true;
  }
  draw(ctx) {
    ctx.fillStyle = "red";
    if (this.exploded)
      ctx.fillRect(
        this.x - 100 - GAME_ENGINE.camera.x,
        this.y - 100 - GAME_ENGINE.camera.y,
        200,
        200
      );
    else
      ctx.fillRect(
        this.x - 25 - GAME_ENGINE.camera.x,
        this.y - 25 - GAME_ENGINE.camera.y,
        50,
        50
      );
  }
}

export class CowboyBullet extends Actor {
  constructor(x, y, target) {
    super();
    Object.assign(this, { x, y, target });

    this.speed = 1500; // Faster bullet speed
    this.damage = 25;
    this.removeFromWorld = false;
    this.assetManager = window.ASSET_MANAGER;

    this.collider = new Collider(20, 10);

    // Compute bullet velocity manually
    const distance = Util.getDistance(this, target);
    this.velocity = {
      x: ((target.x - this.x) / distance) * this.speed,
      y: ((target.y - this.y) / distance) * this.speed
    };

    // Calculate rotation angle in radians
    this.rotation = Math.atan2(this.velocity.y, this.velocity.x);

    // Determine if the bullet should be flipped when moving left
    this.isFlipped = this.velocity.x < 0;

    // Load the bullet sprite
    this.bulletImage = this.assetManager.getAsset("./assets/cowboy/CowBoyBullet.png");

    this.width = 40; // Adjust based on actual sprite size
    this.height = 10; // Adjust based on actual sprite size
  }

  update() {
    // Move the bullet
    this.x += this.velocity.x * GAME_ENGINE.clockTick;
    this.y += this.velocity.y * GAME_ENGINE.clockTick;

    // Check for collision with the player
    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Player && this.colliding(entity)) {
        entity.queueAttack({ damage: this.damage });
        this.removeFromWorld = true;
      }
    }
  }

  draw(ctx) {
    if (!this.bulletImage) return; // Prevent errors if image not loaded

    ctx.save();

    // Translate to the bullet's position
    ctx.translate(this.x - GAME_ENGINE.camera.x, this.y - GAME_ENGINE.camera.y);

    // Rotate the canvas to align with the bullet's direction
    ctx.rotate(this.rotation);

    // Flip the image horizontally if moving left
    if (this.isFlipped) {
      ctx.scale(1, -1); // Flip on Y-axis to mirror the image correctly
    }

    // Draw the bullet image, centered
    ctx.drawImage(
      this.bulletImage,
      -this.width / 2, // Centering the bullet
      -this.height / 2, // Centering the bullet
      this.width,
      this.height
    );

    ctx.restore();
  }
}

