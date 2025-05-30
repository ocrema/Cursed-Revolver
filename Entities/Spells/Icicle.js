import { Collider } from "../Collider.js";
import { Entity } from "../Entities.js";
import * as Util from "../../Utils/Util.js";
import {
  EFFECTS_SPRITESHEET,
  SPELLS_SPRITESHEET,
} from "../../Globals/Constants.js";
import { GAME_ENGINE } from "../../main.js";

export class Icicle extends Entity {
  constructor(pos, dir, offset) {
    super();
    this.x = pos.x + offset.x * (pos.flip ? -1 : 1);
    this.y = pos.y + offset.y;
    this.dir = dir;
    this.entityOrder = 3;
    this.speed = 1000;
    this.isAttack = true;
    this.experationTimer = 2;
    this.spriteScale = 1;
    this.thingHit = null;
    this.spritesheet = SPELLS_SPRITESHEET.ICICLE;

    window.ASSET_MANAGER.playAsset("./assets/sfx/icicle.wav", 0.7);

    this.addAnimation(
      SPELLS_SPRITESHEET.ICICLE.NAME,
      window.ASSET_MANAGER.getAsset(SPELLS_SPRITESHEET.ICICLE.URL),
      SPELLS_SPRITESHEET.ICICLE.FRAME_WIDTH,
      SPELLS_SPRITESHEET.ICICLE.FRAME_HEIGHT,
      SPELLS_SPRITESHEET.ICICLE.FRAME_COUNT,
      SPELLS_SPRITESHEET.ICICLE.FRAME_DURATION
    );
    this.addAnimation(
      SPELLS_SPRITESHEET.ICICLE_EXPLOSION.NAME,
      window.ASSET_MANAGER.getAsset(SPELLS_SPRITESHEET.ICICLE_EXPLOSION.URL),
      SPELLS_SPRITESHEET.ICICLE_EXPLOSION.FRAME_WIDTH,
      SPELLS_SPRITESHEET.ICICLE_EXPLOSION.FRAME_HEIGHT,
      SPELLS_SPRITESHEET.ICICLE_EXPLOSION.FRAME_COUNT,
      SPELLS_SPRITESHEET.ICICLE_EXPLOSION.FRAME_DURATION
    );
    this.setAnimation(SPELLS_SPRITESHEET.ICICLE.NAME, true);
    this.collider = new Collider(30, 30);
  }

  update() {
    this.experationTimer -= GAME_ENGINE.clockTick;
    if (this.experationTimer <= 0) this.removeFromWorld = true;

    if (this.thingHit && this.experationTimer > 0.3) {
      this.x = this.thingHit.x + this.stuckXOffset;
      this.y = this.thingHit.y + this.stuckYOffset;
      return;
    } else if (this.thingHit) {
      this.spritesheet = SPELLS_SPRITESHEET.ICICLE_EXPLOSION;
      this.setAnimation(SPELLS_SPRITESHEET.ICICLE_EXPLOSION.NAME, true);
      this.updateAnimation(GAME_ENGINE.clockTick);
      return;
    }

    // WaterWave movement
    this.x += Math.cos(this.dir) * this.speed * GAME_ENGINE.clockTick;
    this.y += Math.sin(this.dir) * this.speed * GAME_ENGINE.clockTick;

    for (let e of GAME_ENGINE.entities) {
      if (e.isPlayer || e.isAttack || e.isSpawnPoint || e.isBackgroundTrigger)
        continue;

      if (this.colliding(e)) {
        if (e.isActor) {
          if (e.effects.soaked) e.queueAttack({ damage: 40, frozen: 5 });
          else e.queueAttack({ damage: 40, soaked: 5 });
        }
        this.thingHit = e;
        this.stuckXOffset = this.x - e.x;
        this.stuckYOffset = this.y - e.y;
        this.collider = null;
        this.experationTimer = 1;
        window.ASSET_MANAGER.playAsset(
          "./assets/sfx/icicle_impact.wav",
          0.7 * Util.DFCVM(this)
        );
        return;
      }
    }

    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  draw(ctx) {
    let frameWidth = this.spritesheet.FRAME_WIDTH;
    let frameHeight = this.spritesheet.FRAME_HEIGHT;

    ctx.save();
    ctx.translate(this.x - GAME_ENGINE.camera.x, this.y - GAME_ENGINE.camera.y);
    ctx.rotate(this.dir); // Rotate to match movement direction

    ctx.drawImage(
      window.ASSET_MANAGER.getAsset(this.spritesheet.URL),
      this.currentFrame * frameWidth,
      0,
      frameWidth,
      frameHeight,
      // using specified fireball scaling
      (-frameWidth * this.spriteScale) / 2,
      (-frameHeight * this.spriteScale) / 2,
      frameWidth * this.spriteScale,
      frameHeight * this.spriteScale
    );

    ctx.restore();
  }
}
