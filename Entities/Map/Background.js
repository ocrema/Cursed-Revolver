import { Entity } from "../Entities.js";
import { BACKGROUND_SPRITESHEET } from "../../Globals/Constants.js";
import { Camera } from "../../Core/Camera.js";

export class Background extends Entity {
  constructor() {
    super();
    this.scale = 4; // Scale the background
    this.entityOrder = -10; // Background should be behind everything
    this.camera = Camera.getInstance();
    this.player = this.camera.player;

    // Define the height threshold for underground transition
    this.undergroundThreshold = 750;

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

    // Set the initial state
    this.aboveAnimation = BACKGROUND_SPRITESHEET.ABOVE.NAME;
    this.underAnimation = BACKGROUND_SPRITESHEET.UNDER.NAME;

    this.transitionAlpha = 0; // Opacity for transition
    this.transitionSpeed = 1.5; // Speed of fade transition
    this.isGoingUnderground = false; // Track if transitioning downward
  }

  update() {
    this.updateAnimation(GAME_ENGINE.clockTick);

    if (!this.camera.player) return;

    // Determine if player is going underground or back up
    const isPlayerUnderground =
      this.camera.player.y > this.undergroundThreshold;

    if (isPlayerUnderground !== this.isGoingUnderground) {
      // Start transition when state changes
      this.isGoingUnderground = isPlayerUnderground;
    }

    // Handle fade transition
    if (this.isGoingUnderground) {
      this.transitionAlpha += this.transitionSpeed * GAME_ENGINE.clockTick;
      if (this.transitionAlpha > 1) this.transitionAlpha = 1;
      this.setAnimation(BACKGROUND_SPRITESHEET.UNDER.NAME)
    } else {
      this.transitionAlpha -= this.transitionSpeed * GAME_ENGINE.clockTick;
      if (this.transitionAlpha < 0) this.transitionAlpha = 0;
      this.setAnimation(BACKGROUND_SPRITESHEET.ABOVE.NAME);
    }
  }

  draw(ctx) {
    if (
      !this.animations[this.aboveAnimation] ||
      !this.animations[this.underAnimation]
    )
      return;

    ctx.save();

    // Parallax effect
    const parallaxX = -this.camera.x * 0.05;
    const parallaxY = -this.camera.y * 0.0025;
    ctx.translate(parallaxX, parallaxY);
    ctx.scale(this.scale, this.scale);

    // **Draw the above ground background (fading out when underground)**
    ctx.globalAlpha = 1 - this.transitionAlpha;
    this.drawBackground(ctx, this.aboveAnimation);

    // **Draw the underground background (fading in)**
    ctx.globalAlpha = this.transitionAlpha;
    this.drawBackground(ctx, this.underAnimation);

    // Restore alpha
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  drawBackground(ctx, animationName) {
    const animation = this.animations[animationName];
    const { spritesheet, frameWidth, frameHeight } = animation;

    if (!spritesheet) return;

    ctx.drawImage(
      spritesheet,
      this.currentFrame * frameWidth,
      0,
      frameWidth,
      frameHeight,
      -frameWidth / 2,
      -frameHeight / 2,
      frameWidth,
      frameHeight
    );
  }
}
