import { Entity } from "./Entities.js";
import { BACKGROUND_SPRITESHEET } from "../Globals/Constants.js";

export class Background extends Entity {
  constructor() {
    super();
    this.scale = 2;
    this.entityOrder = -10;

    this.addAnimation(
      "background",
      ASSET_MANAGER.getAsset("./assets/background/background.png"),
      BACKGROUND_SPRITESHEET.FRAME_WIDTH, // Frame width
      BACKGROUND_SPRITESHEET.FRAME_HEIGHT, // Frame height
      BACKGROUND_SPRITESHEET.FRAME_COUNT, // Frame count
      BACKGROUND_SPRITESHEET.FRAME_DURATION // Frame duration
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

    ctx.translate(-GAME_ENGINE.camera.x / 3, -GAME_ENGINE.camera.y / 6);

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
