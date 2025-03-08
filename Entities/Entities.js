import { EFFECTS_SPRITESHEET } from "../Globals/Constants.js";
import { GAME_ENGINE } from "../main.js";
import * as Util from "../Utils/Util.js";

export class Entity {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.entityOrder = 0;
    this.animations = {}; // Store animations (idle, run, etc.)
    this.currentAnimation = null; // Active animation (e.g., "idle" or "run")
    this.currentFrame = 0; // Current frame in the animation
    this.elapsedTime = 0; // Time elapsed since the last frame change
    this.flip = false; // Whether to flip the sprite horizontally
    this.scale = 1; // Scale factor for drawing the sprite
  }

  update() {}

  addAnimation(
    name,
    spritesheet,
    frameWidth,
    frameHeight,
    frameCount,
    frameDuration
  ) {
    this.animations[name] = {
      spritesheet, // Reference to the spritesheet for this animation
      frameWidth,
      frameHeight,
      frameCount,
      frameDuration,
    };
  }

  setAnimation(name, loopAnimation = true) {
    if (this.currentAnimation !== name) {
      this.currentAnimation = name;
      this.currentFrame = 0;
      this.elapsedTime = 0;

      // This allows us to assign whether the animation should loop or not.
      // Put this in because death animation shouldnt loop, and we can dynamically assign if future animations should loop or not as well.
      this.currentLoop = loopAnimation;
    }
  }

  updateAnimation(clockTick) {
    const animation = this.animations[this.currentAnimation];
    if (!animation) return;

    this.elapsedTime += clockTick;

    if (this.elapsedTime > animation.frameDuration) {
      this.elapsedTime -= animation.frameDuration;

      if (this.currentLoop) {
        this.currentFrame = (this.currentFrame + 1) % animation.frameCount;
      } else {
        if (this.currentFrame < animation.frameCount - 1) {
          this.currentFrame++;
        } else {
          this.onAnimationComplete(); // Call the callback function when the animation completes
        }
      }
    }
  }

  draw(ctx) {
    if (!this.currentAnimation) return;
    
    if (this.isEnemy) {
      this.drawHealthBar(ctx);
    }

    const animation = this.animations[this.currentAnimation];
    const { spritesheet, frameWidth, frameHeight } = animation;

    if (!spritesheet) return;
    

    ctx.save(); // Save the current transformation state
    ctx.translate(-GAME_ENGINE.camera.x, -GAME_ENGINE.camera.y);
    // Apply horizontal flipping and scaling
    if (this.flip) {
      ctx.scale(-1, 1);
      ctx.translate(-this.x * 2, 0);
    }

    ctx.translate(this.x, this.y); // Move to the entity's position
    ctx.scale(this.scale, this.scale); // Apply scaling factor

    if (this.angle) {
      // if entity has an angle
      ctx.rotate(this.angle);
    }

    // Draw the current frame of the active animation
    ctx.drawImage(
      spritesheet,
      this.currentFrame * frameWidth, // Source X
      0, // Source Y (single row)
      frameWidth, // Source Width
      frameHeight, // Source Height
      -frameWidth / 2, // Destination X (centered)
      -frameHeight / 2, // Destination Y (centered)
      frameWidth, // Destination Width
      frameHeight // Destination Height
    );
    

    ctx.restore(); // Restore the transformation state
  }

  drawHealthBar(ctx) {
    if (this.health <= 0) return;

    const healthBarWidth = 200; // Doubled in size
    const healthBarHeight = 20; // Doubled in size
    const barOffsetY = this.height / 2 + 40; // Adjusted for new size

    // Convert world position to screen position
    const screenX = this.x - GAME_ENGINE.camera.x;
    const screenY = this.y - GAME_ENGINE.camera.y - barOffsetY;

    const healthRatio = Math.max(0, this.health / this.maxHealth);

    ctx.save();

    // Draw background bar (rounded edges)
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.roundRect(
      screenX - healthBarWidth / 2,
      screenY,
      healthBarWidth,
      healthBarHeight,
      8
    );
    ctx.fill();

    // Draw solid health bar (Red when low, Orange when mid, Green when high)
    ctx.fillStyle =
      healthRatio > 0.6 ? "green" : healthRatio > 0.3 ? "orange" : "red";
    ctx.beginPath();
    ctx.roundRect(
      screenX - healthBarWidth / 2,
      screenY,
      healthBarWidth * healthRatio,
      healthBarHeight,
      8
    );
    ctx.fill();

    // Draw health text (centered on bar)
    ctx.fillStyle = "white";
    ctx.font = `${healthBarHeight * 0.8}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(
      `${Math.ceil(this.health)} / ${this.maxHealth}`,
      screenX,
      screenY + healthBarHeight - 4
    );

    ctx.restore();
  }

  colliding(other) {
    if (!this.collider || !other.collider) return false;

    return this.collider.colliding(
      this.x,
      this.y,
      other.collider,
      other.x,
      other.y
    );
  }

  /**
   * moves this entity so that it is against the other entities' collider border in the x direction
   * @param {*} other
   */
  moveAgainstX(other) {
    if (this.x < other.x)
      this.x =
        other.x -
        other.collider.width / 2 -
        this.collider.width / 2 -
        other.collider.x_offset +
        this.collider.x_offset -
        1;
    else
      this.x =
        other.x +
        other.collider.width / 2 +
        this.collider.width / 2 +
        other.collider.x_offset -
        this.collider.x_offset +
        1;
  }
  /**
   * moves this entity so that it is against the other entities' collider border in the y direction
   * @param {*} other
   */
  moveAgainstY(other) {
    if (this.y < other.y)
      this.y =
        other.y -
        other.collider.height / 2 -
        this.collider.height / 2 -
        other.collider.y_offset +
        this.collider.y_offset -
        1;
    else
      this.y =
        other.y +
        other.collider.height / 2 +
        this.collider.height / 2 +
        other.collider.y_offset -
        this.collider.y_offset +
        1;
  }
}



export class GameMap extends Entity {
  constructor() {
    super();
    this.isMap = true;
  }

  update() {}
}
