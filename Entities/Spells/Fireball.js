import { Collider } from "../Collider.js";
import { Entity } from "../Entities.js";
import * as Util from "../../Utils/Util.js";
import { GAME_ENGINE } from "../../main.js";
import { Camera } from "../../Core/Camera.js";
import { ExplosionEffect } from "../Effects/ExplosionEffect.js";

export class Fireball extends Entity {
  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this.dir = 0; // in radians
    this.entityOrder = 3;
    this.speed = 1000;
    this.collider = new Collider(50, 50);
    this.isAttack = true;
    this.experationTimer = 3;
    this.exploded = false;
    window.ASSET_MANAGER.playAsset("./assets/sfx/fireball.wav");
  }

  update() {
    if (this.exploded) {
      this.experationTimer -= GAME_ENGINE.clockTick;
      if (this.experationTimer <= 0) this.removeFromWorld = true;
      this.camera = Camera.getInstance();
      //this.camera.triggerShake(25);
      return;
    }

    this.x += Math.cos(this.dir) * this.speed * GAME_ENGINE.clockTick;
    this.y += Math.sin(this.dir) * this.speed * GAME_ENGINE.clockTick;

    for (let e of GAME_ENGINE.entities) {
      if (e.isPlayer || e.isAttack) continue;

      if (this.colliding(e)) {
        this.exploded = true;
        this.collider.width = 200;
        this.collider.height = 200;

        // Spawn explosion effect at fireball's position
        GAME_ENGINE.addEntity(new ExplosionEffect(this.x, this.y));

        for (let e2 of GAME_ENGINE.entities) {
          if (!e2.isActor) continue;

          if (this.colliding(e2)) {
            e2.queueAttack({
              damage: 10,
              x: this.x,
              y: this.y,
              burn: 5,
              launchMagnitude: 3000,
            });
          }
        }
        this.collider = null;
        this.experationTimer = 0.5;
        window.ASSET_MANAGER.playAsset("./assets/sfx/fireball_impact.wav");
        break;
      }
    }

    this.experationTimer -= GAME_ENGINE.clockTick;
    if (this.experationTimer <= 0) this.removeFromWorld = true;
  }
  draw(ctx) {
    ctx.fillStyle = "red";
    if (!this.exploded) {
      // ctx.fillRect(
      //   this.x - 100 - GAME_ENGINE.camera.x,
      //   this.y - 100 - GAME_ENGINE.camera.y,
      //   200,
      //   200
      // );
      ctx.fillRect(
        this.x - 25 - GAME_ENGINE.camera.x,
        this.y - 25 - GAME_ENGINE.camera.y,
        50,
        50
      );
    }
  }
}
