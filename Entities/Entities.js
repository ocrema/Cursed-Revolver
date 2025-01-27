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

  setAnimation(name) {
    if (this.currentAnimation !== name) {
      this.currentAnimation = name;
      this.currentFrame = 0;
      this.elapsedTime = 0;
    }
  }

  updateAnimation(clockTick) {
    const animation = this.animations[this.currentAnimation];
    if (!animation) return;

    this.elapsedTime += clockTick;

    if (this.elapsedTime > animation.frameDuration) {
      this.elapsedTime -= animation.frameDuration;
      this.currentFrame = (this.currentFrame + 1) % animation.frameCount;
    }
  }

  draw(ctx) {
    if (!this.currentAnimation) return;

    const animation = this.animations[this.currentAnimation];
    const { spritesheet, frameWidth, frameHeight } = animation;

    if (!spritesheet) return;

    ctx.save(); // Save the current transformation state

    // Apply horizontal flipping and scaling
    if (this.flip) {
      ctx.scale(-1, 1);
      ctx.translate(-this.x * 2, 0);
    }

    ctx.translate(this.x, this.y); // Move to the entity's position
    ctx.scale(this.scale, this.scale); // Apply scaling factor

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

  colliding(other) {
    /*
     * entities with collision will have a collection of bounding boxes
     * each bounding box has width, height, x_offset, y_offset
     * returns true if any boxes are colliding, false otherwise
     */

    if (!(this.colliders && other.colliders)) return false;

    for (let i = 0; i < this.colliders.length; i++) {
      for (let j = 0; j < other.colliders.length; j++) {
        const box1 = this.colliders[i];
        const box2 = other.colliders[j];
        const b1w = box1.width;
        const b1h = box1.height;
        const b2w = box2.width;
        const b2h = box2.height;
        const b1x = box1.x_offset + this.x;
        const b1y = box1.y_offset + this.y;
        const b2x = box2.x_offset + other.x;
        const b2y = box2.y_offset + other.y;
        const b1left = b1x - b1w / 2;
        const b1top = b1y - b1h / 2;
        const b1right = b1x + b1w / 2;
        const b1bottom = b1y + b1h / 2;
        const b2left = b2x - b2w / 2;
        const b2top = b2y - b2h / 2;
        const b2right = b2x + b2w / 2;
        const b2bottom = b2y + b2h / 2;
        // just a couple of constants

        if (
          b1right > b2left &&
          b1left < b2right &&
          b1top < b2bottom &&
          b1bottom > b2top
        )
          return true;
      }
    }
    return false;
  }
}

export class Actor extends Entity {
  constructor() {
    super();
    this.isActor = true;
    this.recieved_attacks = [];
    this.effects = [];
    this.velocityY = 0; // Vertical velocity
    this.gravityForce = 1000; // Gravity force
    this.grounded = false; // Whether the actor is on the ground
  }

  // Since actor classes might need more functionalities, we can add them here
  // Gravity, attacks, etc
  update() {}

  applyGravity(gravityAmount) {
    if (!this.grounded) {
      // Apply gravity to vertical velocity
      this.velocityY += this.gravity * GAME_ENGINE.clockTick;

      // Update position based on velocity
      this.y += this.velocityY * GAME_ENGINE.clockTick;
    }
  }

  queueAttack(data) {
    this.recieved_attacks.push(data);
  }
}

export class GameMap extends Entity {
  constructor() {
    super();
    this.isMap = true;
    this.entities = [];
    this.floorY = 400; // Y-coordinate of the floor
    this.entityOrder = -1;
  }

  update() {
      
  }

  draw(ctx) {
    
    // Draw the visible floor as a rectangle
    ctx.save();
    ctx.fillStyle = "red"; // Floor color
    ctx.fillRect(-1000, 450, 2000, 20); // Floor rectangle
    ctx.restore();
      
  }

  close() {
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].removeFromWorld = true;
    }
  }
}
