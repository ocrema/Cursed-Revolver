import { Player } from "../Player/Player.js";
import { GAME_ENGINE } from "../../main.js";
import { Entity } from "../Entities.js";
import { Collider } from "../Collider.js";

export class DeathCollider extends Entity {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isSpike = true;
    this.entityOrder = -9; // Renders behind everything (or not at all)

    this.collider = new Collider(this.width, this.height);
  }

  update() {
    const player = window.PLAYER;
    if (player) {
      if (player instanceof Player && this.colliding(player)) {
        player.queueAttack({
          damage: 100,
          x: this.x,
          y: this.y,
          launchMagnitude: 0,
        });
      }
    }
  }
}
