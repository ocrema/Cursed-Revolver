import { Actor } from "./Entities.js";
import * as Util from "../Utils/Util.js";

export class Player extends Actor {
  constructor() {
    super();
    // Assigns asset manager from window asset manager singleton 
    this.assetManager = window.ASSET_MANAGER;
    this.scale = 1.5;

    this.isPlayer = true;

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


    this.colliders = [];
    this.colliders.push(Util.newCollider(120, 120, 0,0));
    

    this.x_velocity = 0;
    this.y_velocity = 0;
    this.isGrounded = 0; // values above 0 indicate that the player is grounded, so the player can still jump for a little bit after falling off a platform 
  }

  jump() {}

  update() {
    //console.log(this.colliders);
    //super.applyGravity(1);
    this.isMoving = false;
    //console.log(this.x + " " + this.y);

    this.y_velocity = Math.min(this.y_velocity + GAME_ENGINE.clockTick * 3000, 10000);
    this.x_velocity = 0;
    // Movement logic
    if (GAME_ENGINE.keys["a"]) {
      this.x_velocity -= this.speed;
      this.isMoving = true;
      this.flip = true;
    }
    if (GAME_ENGINE.keys["d"]) {
      this.x_velocity += this.speed;
      this.isMoving = true;
      this.flip = false;
    }

    this.isGrounded = Math.max(this.isGrounded - GAME_ENGINE.clockTick, 0);

    if (GAME_ENGINE.keys[" "] && this.isGrounded > 0) {
      this.isGrounded = 0;
      this.y_velocity = -1500; // Jumping velocity
      this.setAnimation("jump");
    }
  

    this.x += this.x_velocity * GAME_ENGINE.clockTick;
    for (let e of GAME_ENGINE.entities) {
      if (e.isPlayer) continue;
      if (this.colliding(e)) {
        this.x -= this.x_velocity * GAME_ENGINE.clockTick;
        this.x_velocity = 0;
        break;
      }
    }

    this.y += this.y_velocity * GAME_ENGINE.clockTick;
    for (let e of GAME_ENGINE.entities) {
      if (e.isPlayer) continue;
      if (this.colliding(e)) {
        this.y -= this.y_velocity * GAME_ENGINE.clockTick;
        if (this.y_velocity > 0) this.isGrounded = .2;
        this.y_velocity = 0;
        break;
      }
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
