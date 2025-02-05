import { Entity } from "../Entities.js";
import { Collider } from "../Collider.js";
import { GAME_ENGINE } from "../../main.js";
import { DESTRUCTIBLE_OBJECTS_SPRITESHEET } from "../../Globals/Constants.js";

export class Tumbleweed extends Entity {
  /**
   * Creates a Tumbleweed entity that moves in a given direction.
   * @param {number} x - Initial x position.
   * @param {number} y - Initial y position.
   * @param {string} direction - "left" or "right".
   */
  constructor(x, y, direction = "right") {
    super();
    this.x = x;
    this.y = y;
    this.entityOrder = 2; // Render below spells
    this.assetManager = window.ASSET_MANAGER;
    this.direction = direction;
    this.speed = 100; // Horizontal movement speed
    this.rotation = 0; // Rotation angle
    this.rotationSpeed = 0.1; // Speed of rolling rotation
    this.scale = 0.35; // Scale the sprite
    this.isTumbleweed = true;

    // Gravity & Bouncing
    this.y_velocity = 0; // Vertical speed
    this.gravity = 1000; // Gravity acceleration
    this.bounceFactor = 0.5; // Bounce energy retention (reduced over time)
    this.minBounce = 200; // Minimum bounce height
    this.maxBounce = 400; // Maximum bounce height
    this.bounceDecay = 0.8; // Reduces bounce height after each bounce

    // Load tumbleweed animation
    this.addAnimation(
      DESTRUCTIBLE_OBJECTS_SPRITESHEET.TUMBLEWEED.NAME,
      this.assetManager.getAsset(
        DESTRUCTIBLE_OBJECTS_SPRITESHEET.TUMBLEWEED.URL
      ),
      DESTRUCTIBLE_OBJECTS_SPRITESHEET.TUMBLEWEED.FRAME_WIDTH,
      DESTRUCTIBLE_OBJECTS_SPRITESHEET.TUMBLEWEED.FRAME_HEIGHT,
      DESTRUCTIBLE_OBJECTS_SPRITESHEET.TUMBLEWEED.FRAME_COUNT,
      DESTRUCTIBLE_OBJECTS_SPRITESHEET.TUMBLEWEED.FRAME_DURATION
    );

    this.setAnimation(DESTRUCTIBLE_OBJECTS_SPRITESHEET.TUMBLEWEED.NAME);

    this.colliderScale = 0.8;
    this.collider = new Collider(
      DESTRUCTIBLE_OBJECTS_SPRITESHEET.TUMBLEWEED.FRAME_HEIGHT *
        this.scale *
        this.colliderScale,
      DESTRUCTIBLE_OBJECTS_SPRITESHEET.TUMBLEWEED.FRAME_WIDTH *
        this.scale *
        this.colliderScale
    );
  }

  update() {
    // Apply gravity
    this.y_velocity += this.gravity * GAME_ENGINE.clockTick;
    this.y += this.y_velocity * GAME_ENGINE.clockTick;

    // Apply horizontal movement
    if (this.direction === "right") {
      this.x += this.speed * GAME_ENGINE.clockTick;
    } else {
      this.x -= this.speed * GAME_ENGINE.clockTick;
    }

    // **Rotation Effect**
    this.rotation += (this.speed * GAME_ENGINE.clockTick) / 50;

    // **Ground Collision Check**
    for (let e of GAME_ENGINE.entities) {
      if (e.isGround && this.colliding(e)) {
        this.bounceOffGround(e);
        break; // Stop checking once ground is found
      }
    }

    // Check for fireball collision
    for (let e of GAME_ENGINE.entities) {
      if (e.isAttack && this.colliding(e)) {
        this.onFireballHit(e);
        e.removeFromWorld = true; // Remove fireball after impact
      }
    }

    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  /**
   * Handles bouncing when colliding with ground.
   */
  bounceOffGround(ground) {
    // Adjust Y position to sit correctly on the ground
    this.y = ground.y - ground.collider.height / 2 - this.collider.height / 2;

    // Generate a **randomized bounce height** within the min/max range
    this.y_velocity = -(
      Math.random() * (this.maxBounce - this.minBounce) +
      this.minBounce
    );
  }

  /**
   * Placeholder logic for when a fireball hits the tumbleweed.
   */
  onFireballHit(fireball) {
    console.log("🔥 Tumbleweed hit by fireball! Placeholder logic here.");
    // TODO: Implement burning/explosion effect
  }

  draw(ctx) {
    if (!this.animations[this.currentAnimation]) return;
    const animation = this.animations[this.currentAnimation];

    ctx.save();
    ctx.translate(this.x - GAME_ENGINE.camera.x, this.y - GAME_ENGINE.camera.y);
    ctx.rotate(this.rotation); // Apply rotation
    ctx.scale(this.scale, this.scale);

    // Draw sprite with rolling effect
    ctx.drawImage(
      animation.spritesheet,
      this.currentFrame * animation.frameWidth,
      0,
      animation.frameWidth,
      animation.frameHeight,
      -animation.frameWidth / 2,
      -animation.frameHeight / 2,
      animation.frameWidth,
      animation.frameHeight
    );

    ctx.restore();
  }
}
