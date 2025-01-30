import { Actor } from "./Entities.js";
import { PLAYER_SPRITESHEET } from "../Globals/Constants.js";
import * as Util from "../Utils/Util.js";
import { Fireball } from "./Spells.js";
import { Collider } from "./Collider.js";

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
      "fall",
      this.assetManager.getAsset(PLAYER_SPRITESHEET.FALL.URL),
      PLAYER_SPRITESHEET.FALL.FRAME_WIDTH,
      PLAYER_SPRITESHEET.FALL.FRAME_HEIGHT,
      PLAYER_SPRITESHEET.FALL.FRAME_COUNT,
      PLAYER_SPRITESHEET.FALL.FRAME_DURATION
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

    //this.colliders = [];
    //this.colliders.push(Util.newCollider(100, 100, 0, 0));
    this.collider = new Collider(120, 120);
    this.health = 200;

    this.x_velocity = 0;
    this.y_velocity = 0;
    this.isGrounded = 0; // values above 0 indicate that the player is grounded, so the player can still jump for a little bit after falling off a platform

    this.spellCooldown = 0; // temporary
  }

  jump() {}

  update() {
    //console.log(this.colliders);
    //super.applyGravity(1);
    this.isMoving = false;
    this.isJumping = false;
    //console.log(this.x + " " + this.y);

    this.y_velocity = Math.min(
      this.y_velocity + GAME_ENGINE.clockTick * 3000,
      10000
    );
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
      this.isJumping = true;
    }

    this.x += this.x_velocity * GAME_ENGINE.clockTick;
    for (let e of GAME_ENGINE.entities) {
      if (e.isPlayer || e.isAttack) continue;
      if (this.colliding(e)) {
        this.x -= this.x_velocity * GAME_ENGINE.clockTick;
        this.x_velocity = 0;
        break;
      }
    }

    this.y += this.y_velocity * GAME_ENGINE.clockTick;
    for (let e of GAME_ENGINE.entities) {
      if (e.isPlayer || e.isAttack) continue;
      if (this.colliding(e)) {
        this.y -= this.y_velocity * GAME_ENGINE.clockTick;
        if (this.y_velocity > 0) this.isGrounded = 0.2;
        this.y_velocity = 0;
        break;
      }
    }

    this.spellCooldown = Math.max(
      this.spellCooldown - GAME_ENGINE.clockTick,
      0
    );
    if (this.spellCooldown <= 0 && GAME_ENGINE.keys["m1"]) {
      this.spellCooldown = 0.3;
      const fireball = new Fireball();
      fireball.x = this.x;
      fireball.y = this.y;
      fireball.dir = Util.getAngle(
        this.x - GAME_ENGINE.camera.x,
        this.y - GAME_ENGINE.camera.y,
        GAME_ENGINE.mouse.x,
        GAME_ENGINE.mouse.y
      );
      GAME_ENGINE.addEntity(fireball);
    }


    if (!this.isGrounded) {
      if (this.y_velocity < 0) {
        this.setAnimation("jump"); // Jump animation when moving up
      } else {
        this.setAnimation("fall"); // Fall animation when moving down
      }
    } else if (this.isMoving) {
      this.setAnimation("run"); // Run animation when grounded and moving
    } else {
      this.setAnimation("idle"); // Idle animation when grounded and not moving
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
