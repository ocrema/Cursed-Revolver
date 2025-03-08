import { Player } from "../Player/Player.js";
import { GAME_ENGINE } from "../../main.js";
import { Entity } from "../Entities.js";
import { Collider } from "../Collider.js";

export class SpikeCollider extends Entity {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.entityOrder = -9; // Renders behind everything (or not at all)

    this.collider = new Collider(this.width, this.height);
  }

  update() {
    for (let e of GAME_ENGINE.entities) {
      if (e instanceof Player && this.colliding(e)) {
        e.queueAttack({
          damage: 100,
          x: this.x,
          y: this.y,
          launchMagnitude: 0,
        });
      }
    }
  }
}
