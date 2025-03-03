export class AnimationLoader {
    constructor(entity) {
      Object.assign (this, {entity});
    }
  
    loadAnimations(SPRITESHEET_CONSTANT) {
      Object.values(SPRITESHEET_CONSTANT).forEach(animation => {
        this.entity.addAnimation(
          animation.NAME, 
          this.entity.assetManager.getAsset(animation.URL),
          animation.FRAME_WIDTH,
          animation.FRAME_HEIGHT,
          animation.FRAME_COUNT,
          animation.FRAME_DURATION
        );
      });
    }
  }