import { Entity } from "../Entities.js";
import { BACKGROUND_SPRITESHEET } from "../../Globals/Constants.js";
import { Camera } from "../../Core/Camera.js";

export class Background extends Entity {
  constructor() {
    super();
    this.scale = 3.5; // Scale the background
    this.entityOrder = -10; // Background should be behind everything
    this.camera = Camera.getInstance();
    this.player = this.camera.player;

    // Define the height threshold for underground transition
    this.undergroundThreshold = 500; // Adjust this based on your map

    // Load both backgrounds
    this.backgrounds = {
      aboveGround: ASSET_MANAGER.getAsset(BACKGROUND_SPRITESHEET.ABOVE.URL),
      underground: ASSET_MANAGER.getAsset(BACKGROUND_SPRITESHEET.UNDER.URL),
    };

    // Add both animations at the start
    this.addAnimation(
      BACKGROUND_SPRITESHEET.ABOVE.NAME,
      this.backgrounds.aboveGround,
      BACKGROUND_SPRITESHEET.ABOVE.FRAME_WIDTH,
      BACKGROUND_SPRITESHEET.ABOVE.FRAME_HEIGHT,
      BACKGROUND_SPRITESHEET.ABOVE.FRAME_COUNT,
      BACKGROUND_SPRITESHEET.ABOVE.FRAME_DURATION
    );

    this.addAnimation(
      BACKGROUND_SPRITESHEET.UNDER.NAME,
      this.backgrounds.underground,
      BACKGROUND_SPRITESHEET.UNDER.FRAME_WIDTH,
      BACKGROUND_SPRITESHEET.UNDER.FRAME_HEIGHT,
      BACKGROUND_SPRITESHEET.UNDER.FRAME_COUNT,
      BACKGROUND_SPRITESHEET.UNDER.FRAME_DURATION
    );

    // Set initial animation
    this.setAnimation(BACKGROUND_SPRITESHEET.ABOVE.NAME);
  }

  update() {
    this.updateAnimation(GAME_ENGINE.clockTick);

    // Check if the player exists
    if (!this.camera.player) return;

    // Determine which background should be active
    const newAnimation =
      this.camera.player.y > this.undergroundThreshold
        ? BACKGROUND_SPRITESHEET.UNDER.NAME
        : BACKGROUND_SPRITESHEET.ABOVE.NAME;

    // Only change animation if it's different from the current one
    if (this.currentAnimation !== newAnimation) {
      this.setAnimation(newAnimation);
    }
  }

  draw(ctx) {
    if (!this.currentAnimation) return;

    const animation = this.animations[this.currentAnimation];
    const { spritesheet, frameWidth, frameHeight } = animation;

    if (!spritesheet) return;

    ctx.save();

    // Parallax effect
    const parallaxX = -this.camera.x * 0.05;
    const parallaxY = -this.camera.y * 0.0025;

    ctx.translate(parallaxX, parallaxY);
    ctx.scale(this.scale, this.scale);

    // Draw background
    ctx.drawImage(
      spritesheet,
      this.currentFrame * frameWidth,
      25,
      frameWidth,
      frameHeight,
      -frameWidth / 2,
      -frameHeight / 2,
      frameWidth,
      frameHeight
    );

    ctx.restore();
  }
}
