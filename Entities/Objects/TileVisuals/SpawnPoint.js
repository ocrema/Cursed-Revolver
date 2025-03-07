import { Entity } from "../../Entities.js";
import { Collider } from "../../Collider.js";
import { Player } from "../../Player/Player.js";
import { MAP_CONSTANTS } from "../../../Globals/Constants.js";

export class SpawnPoint extends Entity {
  constructor(x, y, scale = 1) {
    super();
    this.x = x + 2;
    this.y = y - 45;
    this.scale = scale;
    this.entityOrder = -9;
    this.isSpawnPoint = true;
    this.scale = 5;

    // Add animated campfire sprite
    this.addAnimation(
      MAP_CONSTANTS.CAMPFIRE.NAME,
      window.ASSET_MANAGER.getAsset(MAP_CONSTANTS.CAMPFIRE.URL),
      MAP_CONSTANTS.CAMPFIRE.FRAME_WIDTH,
      MAP_CONSTANTS.CAMPFIRE.FRAME_HEIGHT,
      MAP_CONSTANTS.CAMPFIRE.FRAME_COUNT,
      MAP_CONSTANTS.CAMPFIRE.FRAME_DURATION
    );

    this.addAnimation(
      MAP_CONSTANTS.ACTIVATED_CAMPFIRE.NAME,
      window.ASSET_MANAGER.getAsset(MAP_CONSTANTS.ACTIVATED_CAMPFIRE.URL),
      MAP_CONSTANTS.ACTIVATED_CAMPFIRE.FRAME_WIDTH,
      MAP_CONSTANTS.ACTIVATED_CAMPFIRE.FRAME_HEIGHT,
      MAP_CONSTANTS.ACTIVATED_CAMPFIRE.FRAME_COUNT,
      MAP_CONSTANTS.ACTIVATED_CAMPFIRE.FRAME_DURATION
    );

    this.setAnimation(MAP_CONSTANTS.CAMPFIRE.NAME, true);
  }

  update() {
    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  activateCampfire() {
    this.setAnimation(MAP_CONSTANTS.ACTIVATED_CAMPFIRE.NAME, true);
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
