import { Actor } from "../Actor.js";
import { Collider } from "../Collider.js";
import { GAME_ENGINE } from "../../main.js";

export class SpiderWebObstacle extends Actor {
  constructor(x, y) {
    super();
    Object.assign(this, { x, y });

    this.spawnX = x;
    this.spawnY = y;

    // Load Image
    this.image = window.ASSET_MANAGER.getAsset(
      "./assets/objects/WebObstacle.png"
    );

    // Set dimensions
    this.width = 24;
    this.height = 24;

    // Health
    this.health = 50;
    this.maxHealth = 50;

    this.scale = 14;

    // Collider
    this.collider = new Collider(
      this.width * this.scale - this.scale * 5,
      this.height * this.scale - this.scale * 8
    );
    this.isObject = true;
  }

  stageCleared() {
    console.log("stage cleared, removing web obstacle at x: " + this.x + " y: " + this.y);
    this.removeFromWorld = true;
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.x - GAME_ENGINE.camera.x - (this.width * this.scale) / 2,
      this.y - GAME_ENGINE.camera.y - (this.height * this.scale) / 2,
      this.width * this.scale,
      this.height * this.scale
    );
  }
}
