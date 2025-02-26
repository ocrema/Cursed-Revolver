import { PLAYER_SPRITESHEET } from "../../Globals/Constants.js";

export class PlayerAnimationLoader {
  constructor(playerObject) {
    this.playerObject = playerObject;
  }

  loadPlayerAnimations() {
    // Add animations for the player
    this.playerObject.addAnimation(
      PLAYER_SPRITESHEET.IDLE.NAME, // Name of the animation
      this.playerObject.assetManager.getAsset(PLAYER_SPRITESHEET.IDLE.URL), // URL for Idle animation
      PLAYER_SPRITESHEET.IDLE.FRAME_WIDTH, // Frame width
      PLAYER_SPRITESHEET.IDLE.FRAME_HEIGHT, // Frame height
      PLAYER_SPRITESHEET.IDLE.FRAME_COUNT, // Frame count
      PLAYER_SPRITESHEET.IDLE.FRAME_DURATION // Frame duration (slower for idle)
    );

    this.playerObject.addAnimation(
      PLAYER_SPRITESHEET.RUN.NAME, // Name of the animation
      this.playerObject.assetManager.getAsset(PLAYER_SPRITESHEET.RUN.URL), // URL for Run animation
      PLAYER_SPRITESHEET.RUN.FRAME_WIDTH, // Frame width
      PLAYER_SPRITESHEET.RUN.FRAME_HEIGHT, // Frame height
      PLAYER_SPRITESHEET.RUN.FRAME_COUNT, // Frame count
      PLAYER_SPRITESHEET.RUN.FRAME_DURATION // Frame duration (faster for running)
    );

    this.playerObject.addAnimation(
      PLAYER_SPRITESHEET.ATTACK1.NAME, // Name of the animation
      this.playerObject.assetManager.getAsset(PLAYER_SPRITESHEET.ATTACK1.URL), // URL for Attack 1 animation
      PLAYER_SPRITESHEET.ATTACK1.FRAME_WIDTH, // Frame width
      PLAYER_SPRITESHEET.ATTACK1.FRAME_HEIGHT, // Frame height
      PLAYER_SPRITESHEET.ATTACK1.FRAME_COUNT, // Frame count
      PLAYER_SPRITESHEET.ATTACK1.FRAME_DURATION // Frame duration (faster for attacking)
    );

    this.playerObject.addAnimation(
      PLAYER_SPRITESHEET.JUMP.NAME, // Name of the animation
      this.playerObject.assetManager.getAsset(PLAYER_SPRITESHEET.JUMP.URL), // URL for Jump animation
      PLAYER_SPRITESHEET.JUMP.FRAME_WIDTH, // Frame width
      PLAYER_SPRITESHEET.JUMP.FRAME_HEIGHT, // Frame height
      PLAYER_SPRITESHEET.JUMP.FRAME_COUNT, // Frame count
      PLAYER_SPRITESHEET.JUMP.FRAME_DURATION // Frame duration (faster for jumping)
    );

    this.playerObject.addAnimation(
      PLAYER_SPRITESHEET.FALL.NAME, // Name of the animation
      this.playerObject.assetManager.getAsset(PLAYER_SPRITESHEET.FALL.URL),
      PLAYER_SPRITESHEET.FALL.FRAME_WIDTH,
      PLAYER_SPRITESHEET.FALL.FRAME_HEIGHT,
      PLAYER_SPRITESHEET.FALL.FRAME_COUNT,
      PLAYER_SPRITESHEET.FALL.FRAME_DURATION
    );

    this.playerObject.addAnimation(
      PLAYER_SPRITESHEET.HIT.NAME, // Name of the animation
      this.playerObject.assetManager.getAsset(PLAYER_SPRITESHEET.HIT.URL), // URL for Hit animation
      PLAYER_SPRITESHEET.HIT.FRAME_WIDTH, // Frame width
      PLAYER_SPRITESHEET.HIT.FRAME_HEIGHT, // Frame height
      PLAYER_SPRITESHEET.HIT.FRAME_COUNT, // Frame count
      PLAYER_SPRITESHEET.HIT.FRAME_DURATION // Frame duration (for hit)
    );

    this.playerObject.addAnimation(
      PLAYER_SPRITESHEET.DEAD.NAME, // Name of the animation
      this.playerObject.assetManager.getAsset(PLAYER_SPRITESHEET.DEAD.URL), // URL for Death animation
      PLAYER_SPRITESHEET.DEAD.FRAME_WIDTH, // Frame width
      PLAYER_SPRITESHEET.DEAD.FRAME_HEIGHT, // Frame height
      PLAYER_SPRITESHEET.DEAD.FRAME_COUNT, // Frame count
      PLAYER_SPRITESHEET.DEAD.FRAME_DURATION // Frame duration (for death)
    );
  }
}
