import { Collider } from "../Collider.js";
import { Entity } from "../Entities.js";
import * as Util from "../../Utils/Util.js";
import {
  EFFECTS_SPRITESHEET,
  SPELLS_SPRITESHEET,
} from "../../Globals/Constants.js";
import { GAME_ENGINE } from "../../main.js";
import { BackgroundTriggerTile } from "../Map/Tiles/BackgroundTriggerTile.js";

export class VineGrapple extends Entity {
  constructor(pos, dir, offset) {
    super();
    this.shooter = pos;
    this.x = pos.x + offset.x * (pos.flip ? -1 : 1);
    this.y = pos.y + offset.y;
    this.gun_offset = offset;
    this.dir = dir;
    this.entityOrder = 3;
    this.speed = 4000;
    this.isAttack = true;
    this.experationTimer = 0.25;
    this.spriteScale = 7;
    this.image = window.ASSET_MANAGER.getAsset(
      SPELLS_SPRITESHEET.VINEGRAPPLE.URL
    );
    this.isHit = false;
    this.collider = new Collider(40, 40);

    window.ASSET_MANAGER.playAsset("./assets/sfx/vine.wav");
  }

  update() {
    this.experationTimer -= GAME_ENGINE.clockTick;
    if (this.experationTimer <= 0) this.removeFromWorld = true;
    if (this.isHit) {
      this.shooter.queueAttack({
        launchMagnitude: -10000 * GAME_ENGINE.clockTick,
        x: this.x,
        y: this.y,
      });
      return;
    }

    this.x += Math.cos(this.dir) * this.speed * GAME_ENGINE.clockTick;
    this.y += Math.sin(this.dir) * this.speed * GAME_ENGINE.clockTick;

    for (let e of GAME_ENGINE.entities) {
      if (!e.isPlayer && !e.isAttack && this.colliding(e)) {
        this.isHit = true;
        this.experationTimer = 0.2;
        this.shooter.x_velocity = 0;
        this.shooter.y_velocity = 0;
        break;
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(
      this.shooter.x -
        GAME_ENGINE.camera.x +
        this.gun_offset.x * (this.shooter.flip ? -1 : 1),
      this.shooter.y - GAME_ENGINE.camera.y + this.gun_offset.y
    );

    ctx.rotate(Util.getAngle(this.shooter, this));
    ctx.drawImage(this.image, 0, -25, Util.getDistance(this, this.shooter), 50);

    ctx.restore();
  }
}
