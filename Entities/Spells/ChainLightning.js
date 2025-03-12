import { Collider } from "../Collider.js";
import { Entity } from "../Entities.js";
import * as Util from "../../Utils/Util.js";
import { GAME_ENGINE } from "../../main.js";
import { Camera } from "../../Core/Camera.js";

export class ChainLightning extends Entity {
  constructor(caster, dir, offset) {
    super();
    this.debug = false;
    this.dir = dir; // in radians
    this.entityOrder = 3;
    this.isAttack = true;
    this.experationTimer = 0.35;
    this.chains = 3;
    this.damage = 3;
    this.firstBolt = true;
    this.maxChainLength = 1000;
    this.maxShotAngle = Math.PI / 3;
    this.targets = [caster];
    this.gun_offset = offset;
    window.ASSET_MANAGER.playAsset("./assets/sfx/lightning.wav", 0.7);
  }

  update() {
    this.debug = GAME_ENGINE.debug_colliders;

    if (this.debug) {
      this.chains = 8;
      this.damage = 200;
    }
    if (this.struck) {
      this.experationTimer -= GAME_ENGINE.clockTick;
      //if (this.targets.length > 1) GAME_ENGINE.camera.triggerShake(10);
      if (this.experationTimer <= 0) this.removeFromWorld = true;
      return;
    }

    let enemies = GAME_ENGINE.entities.filter((e) => e.isEnemy);

    let source = this.targets[0];
    let target = null;
    let targetIndex = null;

    while (source !== null && enemies.length !== 0 && this.chains >= 1) {
      for (let i = 0; i < enemies.length; i++) {
        if (
          this.firstBolt &&
          Util.diffBetweenAngles(Util.getAngle(source, enemies[i]), this.dir) >
            this.maxShotAngle
        )
          continue;
        if (Util.getDistance(source, enemies[i]) > this.maxChainLength)
          continue;
        if (
          target === null ||
          Util.getDistance(source, enemies[i]) <
            Util.getDistance(source, target)
        ) {
          target = enemies[i];
          targetIndex = i;
        }
      }

      if (target !== null) {
        this.targets.push(target);
        enemies.splice(targetIndex, 1);
        target.queueAttack({ damage: this.damage, shock: 5 });
      }

      this.chains--;
      this.firstBolt = false;
      source = target;
      target = null;
    }

    this.struck = true;
  }

  draw(ctx) {
    if (!this.struck || this.targets.length <= 1) return;
    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = "yellow";
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = Math.random() * 10 + 5;
    let maxOffset = 120;
    ctx.beginPath();
    ctx.moveTo(
      this.targets[0].x -
        GAME_ENGINE.camera.x +
        Math.random() * maxOffset -
        maxOffset / 2 +
        this.gun_offset.x * (this.targets[0].flip ? -1 : 1),
      this.targets[0].y -
        GAME_ENGINE.camera.y +
        Math.random() * maxOffset -
        maxOffset / 2 +
        this.gun_offset.y
    );
    for (let i = 1; i < this.targets.length; i++) {
      ctx.lineTo(
        this.targets[i].x -
          GAME_ENGINE.camera.x +
          Math.random() * maxOffset -
          maxOffset / 2,
        this.targets[i].y -
          GAME_ENGINE.camera.y +
          Math.random() * maxOffset -
          maxOffset / 2
      );
    }
    ctx.stroke();

    ctx.strokeStyle = "white";
    ctx.lineWidth = Math.random() * 5 + 5;
    maxOffset = 120;
    ctx.beginPath();
    ctx.moveTo(
      this.targets[0].x -
        GAME_ENGINE.camera.x +
        Math.random() * maxOffset -
        maxOffset / 2 +
        this.gun_offset.x * (this.targets[0].flip ? -1 : 1),
      this.targets[0].y -
        GAME_ENGINE.camera.y +
        Math.random() * maxOffset -
        maxOffset / 2 +
        this.gun_offset.y
    );
    for (let i = 1; i < this.targets.length; i++) {
      ctx.lineTo(
        this.targets[i].x -
          GAME_ENGINE.camera.x +
          Math.random() * maxOffset -
          maxOffset / 2,
        this.targets[i].y -
          GAME_ENGINE.camera.y +
          Math.random() * maxOffset -
          maxOffset / 2
      );
    }
    ctx.stroke();
    ctx.restore();
  }
}
