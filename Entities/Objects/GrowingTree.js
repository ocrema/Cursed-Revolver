import { GAME_ENGINE } from "../../main.js";
import { WaterWave } from "../Spells/WaterWave.js";
import { Entity } from "../Entities.js";
import { Collider } from "../Collider.js";

export class GrowingTree extends Entity {
  constructor(x, y, scale = 7) {
    super();
    this.x = x;
    this.y = y;
    this.entityOrder = 0;
    this.image = window.ASSET_MANAGER.getAsset("./assets/objects/growing_tree.png");
    this.scale = scale;
    this.growth = 0;
    this.growing = false;
    this.initWidth = 16 * this.scale;
    this.initHeight = 16 * this.scale;
    this.finalWidth = 50 * this.scale;
    this.finalHeight = 80 * this.scale;
    this.collider = new Collider(this.initWidth, this.initHeight * 2);
  }
  update() {
    if (this.growing) {
      this.growth += GAME_ENGINE.clockTick * 2;
      if (this.growth >= 1) {
        this.growth = 1;
        this.growing = false;
      }
      this.collider.width = (this.initWidth + (this.finalWidth - this.initWidth) * this.growth);
      this.collider.height = (this.initHeight + (this.finalHeight - this.initHeight) * this.growth) * 2;
    }
    if (this.growth === 0) {
      for (const e of GAME_ENGINE.entities) {
        if (e instanceof WaterWave && e.colliding(this)) {
          this.growing = true;
        }
      }
    }
  }
  draw(ctx) {

    const frame = Math.round(this.growth * 3);
    ctx.save();
    ctx.translate(
      this.x - GAME_ENGINE.camera.x,
      this.y - GAME_ENGINE.camera.y
    );


    ctx.drawImage(
      this.image,
      frame * 56,
      0,
      56,
      80,
      (-56 * this.scale) / 2,
      (-80 * this.scale),
      56 * this.scale,
      80 * this.scale
    );

    ctx.restore();

  }
}