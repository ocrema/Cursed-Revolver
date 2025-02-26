import { Entity } from "../../Entities.js";
import { Collider } from "../../Collider.js";
import { Player } from "../../Player/Player.js";
import { MAP_CONSTANTS } from "../../../Globals/Constants.js";

export class SpiderwebVisual extends Entity {
  constructor(x, y, scale = 1) {
    super();
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.entityOrder = -9;
    this.isSpawnPoint = true;
    this.scale = 10;

    // Add animated campfire sprite
    this.addAnimation(
      MAP_CONSTANTS.SPIDERWEB.NAME,
      window.ASSET_MANAGER.getAsset(MAP_CONSTANTS.SPIDERWEB.URL),
      MAP_CONSTANTS.SPIDERWEB.FRAME_WIDTH,
      MAP_CONSTANTS.SPIDERWEB.FRAME_HEIGHT,
      MAP_CONSTANTS.SPIDERWEB.FRAME_COUNT,
      MAP_CONSTANTS.SPIDERWEB.FRAME_DURATION
    );

    this.setAnimation(MAP_CONSTANTS.SPIDERWEB.NAME, true);
  }

  update() {
    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  draw(ctx) {
    if (!this.currentAnimation) return;

    let animation = this.animations[this.currentAnimation];
    if (!animation) return;

    let { spritesheet, frameWidth, frameHeight } = animation;
    if (!spritesheet) return;

    this.updateAnimation(GAME_ENGINE.clockTick);

    ctx.save();
    ctx.translate(this.x - GAME_ENGINE.camera.x, this.y - GAME_ENGINE.camera.y);

    ctx.drawImage(
      spritesheet,
      this.currentFrame * frameWidth,
      0,
      frameWidth,
      frameHeight,
      (-frameWidth * this.scale) / 2,
      (-frameHeight * this.scale) / 2,
      frameWidth * this.scale,
      frameHeight * this.scale
    );

    ctx.restore();
  }
}
