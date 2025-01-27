import { Actor } from "./Entities.js";
import { PLAYER_SPRITESHEET } from "../Globals/Constants.js";
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
      this.assetManager.getAsset(PLAYER_SPRITESHEET.IDLE.URL), // URL for Idle animation
      PLAYER_SPRITESHEET.IDLE.FRAME_WIDTH, // Frame width
      PLAYER_SPRITESHEET.IDLE.FRAME_HEIGHT, // Frame height
      PLAYER_SPRITESHEET.IDLE.FRAME_COUNT, // Frame count
      PLAYER_SPRITESHEET.IDLE.FRAME_DURATION // Frame duration (slower for idle)
    );

    this.addAnimation(
      "run",
      this.assetManager.getAsset(PLAYER_SPRITESHEET.RUN.URL), // URL for Run animation
      PLAYER_SPRITESHEET.RUN.FRAME_WIDTH, // Frame width
      PLAYER_SPRITESHEET.RUN.FRAME_HEIGHT, // Frame height
      PLAYER_SPRITESHEET.RUN.FRAME_COUNT, // Frame count
      PLAYER_SPRITESHEET.RUN.FRAME_DURATION // Frame duration (faster for running)
    );

    this.addAnimation(
      "jump",
      this.assetManager.getAsset(PLAYER_SPRITESHEET.JUMP.URL), // URL for Jump animation
      PLAYER_SPRITESHEET.JUMP.FRAME_WIDTH, // Frame width
      PLAYER_SPRITESHEET.JUMP.FRAME_HEIGHT, // Frame height
      PLAYER_SPRITESHEET.JUMP.FRAME_COUNT, // Frame count
      PLAYER_SPRITESHEET.JUMP.FRAME_DURATION // Frame duration (faster for jumping)
    );

    this.addAnimation(
      "dead",
      this.assetManager.getAsset(PLAYER_SPRITESHEET.DEAD.URL), // URL for Death animation
      PLAYER_SPRITESHEET.DEAD.FRAME_WIDTH, // Frame width
      PLAYER_SPRITESHEET.DEAD.FRAME_HEIGHT, // Frame height
      PLAYER_SPRITESHEET.DEAD.FRAME_COUNT, // Frame count
      PLAYER_SPRITESHEET.DEAD.FRAME_DURATION // Frame duration (for death)
    );

    this.speed = 500; // Movement speed
    this.isMoving = false; // Whether the player is moving
    this.health = 200;

    // Start with the idle animation
    this.setAnimation("idle");

    this.colliders = [];
    this.colliders.push(Util.newCollider(100, 100, 0, 0));
  }

  jump() {}

  update() {
    //console.log(this.colliders);
    //super.applyGravity(1);
    this.isMoving = false;
    //console.log(this.x + " " + this.y);

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

    // process each attack

    this.recieved_attacks.forEach((attack) => {
      console.log("ouch! i took " + attack.damage + " damage");
      this.health -= attack.damage;
    });
    this.recieved_attacks = [];

    if (this.health <= 0) {
      // this.setAnimation("dead");
      console.log("i died");
    }

    // Update the active animation
    this.updateAnimation(GAME_ENGINE.clockTick);
  }
}
