import { Entity } from "./Entities.js";

export class Background extends Entity {
  constructor() {
    super();
    this.scale = 2;
    this.entityOrder = -1;

    this.addAnimation(
      "background",
      ASSET_MANAGER.getAsset("./assets/background/background.png"),
      800, // Frame width
      336, // Frame height
      8, // Frame count
      0.1 // Frame duration
    );

    this.scale = 3.5; // Scale the background
    this.setAnimation("background");
  }

  update() {
    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  draw(ctx) {
    if (!this.currentAnimation) return;

    const animation = this.animations[this.currentAnimation];
    const { spritesheet, frameWidth, frameHeight } = animation;

    if (!spritesheet) return;

    ctx.save(); // Save the current transformation state

    // Scale the canvas
    ctx.scale(this.scale, this.scale);

    // Draw the background frame at (0, 0)
    ctx.drawImage(
      spritesheet,
      this.currentFrame * frameWidth, // Source X
      0, // Source Y
      frameWidth, // Source Width
      frameHeight, // Source Height
      -400, // Destination X
      -150, // Destination Y
      frameWidth, // Destination Width
      frameHeight // Destination Height
    );

    ctx.restore(); // Restore the transformation state
  }
}
