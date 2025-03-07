import { Entity } from "../Entities.js";
import { Camera } from "../../Core/Camera.js";
import { BACKGROUND_SPRITESHEET } from "../../Globals/Constants.js";

export class Background extends Entity {
  constructor() {
    super();
    this.scale = 4;
    this.entityOrder = -10;
    this.camera = Camera.getInstance();

    this.backgroundList = Object.values(BACKGROUND_SPRITESHEET);
    this.currentIndex = 0;
    this.isTransitioning = false;
    this.transitionPhase = null; // 'fading_out' → 'switching' → 'fading_in' → null
    this.fadeAlpha = 1; // 1 = fully visible, 0 = fully transparent
    this.transitionSpeed = 0.02; // Adjust for faster/slower fade

    this.animations = {};
    this.loadBackgroundData();
    this.setCurrentBackground();

    this.elapsedTime = 0;
    this.currentFrame = 0;
  }

  loadBackgroundData() {
    this.backgroundList.forEach((bgData) => {
      this.animations[bgData.NAME] = {
        spritesheet: new Image(),
        frameWidth: bgData.FRAME_WIDTH,
        frameHeight: bgData.FRAME_HEIGHT,
        frameCount: bgData.FRAME_COUNT,
        frameDuration: bgData.FRAME_DURATION,
      };
      this.animations[bgData.NAME].spritesheet.src = bgData.URL;
    });
  }

  setCurrentBackground() {
    const bgData = this.backgroundList[this.currentIndex];
    if (!bgData) return;

    this.currentBackground = this.animations[bgData.NAME];
    if (!this.currentBackground) return;

    this.currentFrame = 0;
    this.elapsedTime = 0;
  }

  nextBackground() {
    if (this.isTransitioning) return; // Prevent spam

    this.isTransitioning = true;
    this.transitionPhase = "fading_out"; // Start fading out
  }

  update() {
    if (this.currentBackground) {
      this.elapsedTime += GAME_ENGINE.clockTick;
      if (this.elapsedTime >= this.currentBackground.frameDuration) {
        this.elapsedTime = 0;
        this.currentFrame =
          (this.currentFrame + 1) % this.currentBackground.frameCount;
      }
    }

    // Handle Fade Transition
    if (this.transitionPhase === "fading_out") {
      this.fadeAlpha -= this.transitionSpeed;
      if (this.fadeAlpha <= 0) {
        this.fadeAlpha = 0;
        this.transitionPhase = "switching";
      }
    } else if (this.transitionPhase === "switching") {
      this.currentIndex = (this.currentIndex + 1) % this.backgroundList.length;
      this.setCurrentBackground();
      this.transitionPhase = "fading_in";
    } else if (this.transitionPhase === "fading_in") {
      this.fadeAlpha += this.transitionSpeed;
      if (this.fadeAlpha >= 1) {
        this.fadeAlpha = 1;
        this.transitionPhase = null;
        this.isTransitioning = false;
      }
    }
  }

  draw(ctx) {
    if (!this.currentBackground) return;

    ctx.save();
    ctx.globalAlpha = this.fadeAlpha; // Apply fading effect

    // Parallax Effect
    const parallaxX = -this.camera.x * 0.05;
    const parallaxY = -this.camera.y * 0.0025;
    ctx.translate(parallaxX, parallaxY);
    ctx.scale(this.scale, this.scale);

    this.drawBackground(ctx, this.currentBackground);

    ctx.restore();
  }

  drawBackground(ctx, animation) {
    if (!animation || !animation.spritesheet) return;

    const { spritesheet, frameWidth, frameHeight } = animation;
    const frameX = this.currentFrame * frameWidth;

    ctx.drawImage(
      spritesheet,
      frameX,
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
