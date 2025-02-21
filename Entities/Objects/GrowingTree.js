class GrowingTree extends Entity {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.entityOrder = 0;
    this.image = window.ASSET_MANAGER.getAsset("./assets/objects/growing_tree.png");
    this.scale = 3;
    this.growth = 0;
  }
  update() {
    
  }
  draw(ctx) {
    /*
    const frame = Math.floor((this.time / this.end) * 8);
    ctx.save();
    ctx.translate(
      this.x - GAME_ENGINE.camera.x,
      this.y - GAME_ENGINE.camera.y
    );
    if (this.flip) {
      ctx.scale(-1, 1);
      //ctx.translate(-this.x * 2, 0);
    }

    ctx.drawImage(
      this.image,
      frame * 48,
      0,
      48,
      32,
      (-48 * this.scale) / 2,
      (-32 * this.scale),
      48 * this.scale,
      32 * this.scale
    );

    ctx.restore();
    */
  }
}