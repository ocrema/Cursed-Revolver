import { Player } from "../Player/Player.js";
import { GAME_ENGINE } from "../../main.js";
import { Entity } from "../Entities.js";

export class DeathCollider extends Entity {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isSpike = true;
    this.entityOrder = -9; // Renders behind everything (or not at all)

    this.collider = new DeathCollision(this.width, this.height);
  }

  update() {
    const player = window.PLAYER;
    if (player) {
      if (player instanceof Player && this.colliding(player)) {
        console.log("hit player");
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

class DeathCollision {
  constructor(width, height, x_offset = 0, y_offset = 0) {
    this.width = width;
    this.height = height;
    this.x_offset = x_offset;
    this.y_offset = y_offset;
  }

  colliding(x1, y1, other, x2, y2) {
    if (!other) return false;

    const b1left = x1 - this.x_offset; // Left stays fixed
    const b1right = x1 + this.width - this.x_offset; // Expands to the right
    const b1bottom = y1 + this.height - this.y_offset;
    const b1top = y1 - this.y_offset;

    const b2left = x2 - other.x_offset;
    const b2right = x2 + other.width - other.x_offset;
    const b2bottom = y2 + other.height - other.y_offset;
    const b2top = y2 - other.y_offset;

    return (
      b1right > b2left &&
      b1left < b2right &&
      b1top < b2bottom &&
      b1bottom > b2top
    );
  }
}
