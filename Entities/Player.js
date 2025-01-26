import { Actor } from "./Entities.js";
import { AssetManager } from "../Core/AssetManager.js";

export class Player extends Actor {
  constructor() {
    super();
    this.assetManager = window.ASSET_MANAGER;
    this.scale = 1.5;

    // Add animations for the player
    this.addAnimation(
      "idle",
      this.assetManager.getAsset("./assets/player/Idle.png"),
      231, // Frame width
      190, // Frame height
      6, // Frame count
      0.25 // Frame duration (slower for idle)
    );

    this.addAnimation(
      "run",
      this.assetManager.getAsset("./assets/player/Run.png"),
      231, // Frame width
      190, // Frame height
      8, // Frame count
      0.1 // Frame duration (faster for running)
    );

    this.addAnimation(
      "jump",
      this.assetManager.getAsset("./assets/player/Jump.png"),
      231, // Frame width
      190, // Frame height
      8, // Frame count
      0.1 // Frame duration (faster for running)
    );

    this.speed = 500; // Movement speed
    this.isMoving = false; // Whether the player is moving

    // Start with the idle animation
    this.setAnimation("idle");
  }

  jump() {}

  update() {
    //super.applyGravity(1);
    this.isMoving = false;

    // Movement logic
    if (GAME_ENGINE.keys["a"]) {
      this.x -= this.speed * GAME_ENGINE.clockTick;
      this.isMoving = true;
      this.flip = true;
    }
    if (GAME_ENGINE.keys["d"]) {
      this.x += this.speed * GAME_ENGINE.clockTick;
      this.isMoving = true;
      this.flip = false;
    }
    if (GAME_ENGINE.keys["w"]) {
      this.y -= this.speed * GAME_ENGINE.clockTick;
      this.isMoving = true;
    }
    if (GAME_ENGINE.keys["s"]) {
      this.y += this.speed * GAME_ENGINE.clockTick;
      this.isMoving = true;
    }

    if (GAME_ENGINE.keys[" "]) {
      this.jump();
      this.setAnimation("jump");
    }

    if (!this.isGrounded) {
      //this.setAnimation("jump");
    }

    if (this.isMoving) {
      this.setAnimation("run");
    } else {
      this.setAnimation("idle");
    }

    // Update the active animation
    this.updateAnimation(GAME_ENGINE.clockTick);
  }
}
