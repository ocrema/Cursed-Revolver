import { Entity } from "./Entities.js";
import { BACKGROUND_SPRITESHEET } from "../Globals/Constants.js";
import { Camera } from "../Core/Camera.js";

export class Background extends Entity {
  constructor() {
    super();
    this.scale = 3.5; // Scale the background
    this.entityOrder = -10; // Background should be behind everything
    this.camera = Camera.getInstance();

    this.addAnimation(
      "background",
      ASSET_MANAGER.getAsset(BACKGROUND_SPRITESHEET.URL), // Spritesheet
      BACKGROUND_SPRITESHEET.FRAME_WIDTH, // Frame width
      BACKGROUND_SPRITESHEET.FRAME_HEIGHT, // Frame height
      BACKGROUND_SPRITESHEET.FRAME_COUNT, // Frame count
      BACKGROUND_SPRITESHEET.FRAME_DURATION // Frame duration
    );

    this.setAnimation("background");
  }

  /**
   * Updates the background position based on player movement.
   * Uses parallax scrolling where the background moves slower than the foreground.
   */
  update() {
    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  /**
   * Draws the parallax background relative to the player's movement.
   * @param {CanvasRenderingContext2D} ctx - The rendering context.
   */
  draw(ctx) {
    if (!this.currentAnimation) return;

    const animation = this.animations[this.currentAnimation];
    const { spritesheet, frameWidth, frameHeight } = animation;

    if (!spritesheet) return;

    ctx.save(); // Save the current transformation state

    // Parallax effect: Background moves at a fraction of the camera movement
    const parallaxX = -this.camera.x * 0.05; // Moves slower than foreground
    const parallaxY = -this.camera.y * 0.0025; // Moves even slower vertically

    ctx.translate(parallaxX, parallaxY);
    ctx.scale(this.scale, this.scale);

    // Draw the background image
    ctx.drawImage(
      spritesheet,
      this.currentFrame * frameWidth, // Source X
      25, // Source Y
      frameWidth, // Source Width
      frameHeight, // Source Height
      -frameWidth / 2, // Center the background
      -frameHeight / 2, // Center the background
      frameWidth * 1.25, // Destination Width
      frameHeight // Destination Height
    );

    ctx.restore(); // Restore the transformation state
  }
}
