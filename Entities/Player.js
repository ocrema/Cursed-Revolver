import { Actor } from "./Entities.js";
import { PLAYER_COLLIDER, PLAYER_SPRITESHEET } from "../Globals/Constants.js";
import * as Util from "../Utils/Util.js";
import { Fireball, ChainLightning } from "./Spells.js";
import { Collider } from "./Collider.js";
import { GAME_ENGINE } from "../main.js";
import { Camera } from "../Core/Camera.js";

export class Player extends Actor {
  constructor() {
    super();
    // Assigns asset manager from window asset manager singleton
    this.assetManager = window.ASSET_MANAGER;
    this.scale = 1.5;

    this.isPlayer = true;

    // switches between attack animations for the player
    this.attackState = 1;

    // Add animations for the player
    this.addAnimation(
      PLAYER_SPRITESHEET.IDLE.NAME, // Name of the animation
      this.assetManager.getAsset(PLAYER_SPRITESHEET.IDLE.URL), // URL for Idle animation
      PLAYER_SPRITESHEET.IDLE.FRAME_WIDTH, // Frame width
      PLAYER_SPRITESHEET.IDLE.FRAME_HEIGHT, // Frame height
      PLAYER_SPRITESHEET.IDLE.FRAME_COUNT, // Frame count
      PLAYER_SPRITESHEET.IDLE.FRAME_DURATION // Frame duration (slower for idle)
    );

    this.addAnimation(
      PLAYER_SPRITESHEET.RUN.NAME, // Name of the animation
      this.assetManager.getAsset(PLAYER_SPRITESHEET.RUN.URL), // URL for Run animation
      PLAYER_SPRITESHEET.RUN.FRAME_WIDTH, // Frame width
      PLAYER_SPRITESHEET.RUN.FRAME_HEIGHT, // Frame height
      PLAYER_SPRITESHEET.RUN.FRAME_COUNT, // Frame count
      PLAYER_SPRITESHEET.RUN.FRAME_DURATION // Frame duration (faster for running)
    );

    this.addAnimation(
      PLAYER_SPRITESHEET.ATTACK1.NAME, // Name of the animation
      this.assetManager.getAsset(PLAYER_SPRITESHEET.ATTACK1.URL), // URL for Attack 1 animation
      PLAYER_SPRITESHEET.ATTACK1.FRAME_WIDTH, // Frame width
      PLAYER_SPRITESHEET.ATTACK1.FRAME_HEIGHT, // Frame height
      PLAYER_SPRITESHEET.ATTACK1.FRAME_COUNT, // Frame count
      PLAYER_SPRITESHEET.ATTACK1.FRAME_DURATION // Frame duration (faster for attacking)
    );

    this.addAnimation(
      PLAYER_SPRITESHEET.ATTACK2.NAME, // Name of the animation
      this.assetManager.getAsset(PLAYER_SPRITESHEET.ATTACK2.URL), // URL for Attack 2 animation
      PLAYER_SPRITESHEET.ATTACK2.FRAME_WIDTH, // Frame width
      PLAYER_SPRITESHEET.ATTACK2.FRAME_HEIGHT, // Frame height
      PLAYER_SPRITESHEET.ATTACK2.FRAME_COUNT, // Frame count
      PLAYER_SPRITESHEET.ATTACK2.FRAME_DURATION // Frame duration (faster for attacking)
    );

    this.addAnimation(
      PLAYER_SPRITESHEET.JUMP.NAME, // Name of the animation
      this.assetManager.getAsset(PLAYER_SPRITESHEET.JUMP.URL), // URL for Jump animation
      PLAYER_SPRITESHEET.JUMP.FRAME_WIDTH, // Frame width
      PLAYER_SPRITESHEET.JUMP.FRAME_HEIGHT, // Frame height
      PLAYER_SPRITESHEET.JUMP.FRAME_COUNT, // Frame count
      PLAYER_SPRITESHEET.JUMP.FRAME_DURATION // Frame duration (faster for jumping)
    );

    this.addAnimation(
      PLAYER_SPRITESHEET.FALL.NAME, // Name of the animation
      this.assetManager.getAsset(PLAYER_SPRITESHEET.FALL.URL),
      PLAYER_SPRITESHEET.FALL.FRAME_WIDTH,
      PLAYER_SPRITESHEET.FALL.FRAME_HEIGHT,
      PLAYER_SPRITESHEET.FALL.FRAME_COUNT,
      PLAYER_SPRITESHEET.FALL.FRAME_DURATION
    );

    this.addAnimation(
      PLAYER_SPRITESHEET.HIT.NAME, // Name of the animation
      this.assetManager.getAsset(PLAYER_SPRITESHEET.HIT.URL), // URL for Hit animation
      PLAYER_SPRITESHEET.HIT.FRAME_WIDTH, // Frame width
      PLAYER_SPRITESHEET.HIT.FRAME_HEIGHT, // Frame height
      PLAYER_SPRITESHEET.HIT.FRAME_COUNT, // Frame count
      PLAYER_SPRITESHEET.HIT.FRAME_DURATION // Frame duration (for hit)
    );

    this.addAnimation(
      PLAYER_SPRITESHEET.DEAD.NAME, // Name of the animation
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
    this.setAnimation(PLAYER_SPRITESHEET.IDLE.NAME);

    this.collider = new Collider(120, 120);
    this.health = 100;

    this.x_velocity = 0;
    this.y_velocity = 0;
    this.isGrounded = 0; // values above 0 indicate that the player is grounded, so the player can still jump for a little bit after falling off a platform

    this.selectedSpell = 0;
    this.spellCooldowns = [0, 0, 0, 0, 0, 0];
    this.maxSpellCooldown = 1;

    this.timeBetweenFootsteps = .4;
    this.timeSinceLastFootstep = .4;

  }

  jump() { }

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

    // Player Reset Button - this is if the player dies, this resets player health and respawns them.
    if (GAME_ENGINE.keys["h"]) {
      this.isDead = false;
      this.health = 100;
      this.x = 0;
      this.y = 0;
      this.setAnimation(PLAYER_SPRITESHEET.IDLE.NAME);
    }

    this.isGrounded = Math.max(this.isGrounded - GAME_ENGINE.clockTick, 0);

    if (GAME_ENGINE.keys[" "] && this.isGrounded > 0) {
      this.isGrounded = 0;
      this.y_velocity = -1500; // Jumping velocity
      this.setAnimation(PLAYER_SPRITESHEET.JUMP.NAME);
      this.isJumping = true;
      window.ASSET_MANAGER.playAsset("./assets/sfx/jump.ogg");
    }

    // Player Collision Logic

    this.x += this.x_velocity * GAME_ENGINE.clockTick;
    let collisions = [];
    for (let e of GAME_ENGINE.entities) {
      if (e.isPlayer || e.isAttack) continue;
      if (this.colliding(e)) {
        collisions.push(e);
      }
    }
    if (collisions.length !== 0) {
      if (this.x_velocity > 0) {
        this.x =
          collisions.reduce(
            (acc, curr) => Math.min(acc, curr.x - curr.collider.width / 2),
            collisions[0].x - collisions[0].collider.width / 2
          ) -
          this.collider.width / 2;
      } else {
        this.x =
          collisions.reduce(
            (acc, curr) => Math.max(acc, curr.x + curr.collider.width / 2),
            collisions[0].x + collisions[0].collider.width / 2
          ) +
          this.collider.width / 2;
      }
      this.x_velocity = 0;
    }

    this.y += this.y_velocity * GAME_ENGINE.clockTick;
    collisions = [];
    for (let e of GAME_ENGINE.entities) {
      if (e.isPlayer || e.isAttack) continue;
      if (this.colliding(e)) {
        collisions.push(e);
      }
    }
    if (collisions.length !== 0) {
      if (this.y_velocity > 0) {
        this.isGrounded = 0.2;

        this.y =
          collisions.reduce(
            (acc, curr) => Math.min(acc, curr.y - curr.collider.height / 2),
            collisions[0].y - collisions[0].collider.height / 2
          ) -
          this.collider.height / 2;
      } else {
        this.y =
          collisions.reduce(
            (acc, curr) => Math.max(acc, curr.y + curr.collider.height / 2),
            collisions[0].y + collisions[0].collider.height / 2
          ) +
          this.collider.height / 2;
      }

      if (this.y_velocity > 300) {
        window.ASSET_MANAGER.playAsset("./assets/sfx/landing.wav");
      }


      this.y_velocity = 0;
    }

    // Player Attack Logic

    for (let i = 0; i < this.spellCooldowns.length; i++) {
      this.spellCooldowns[i] = Math.max(
        this.spellCooldowns[i] - GAME_ENGINE.clockTick,
        0
      );
      const key = (i + 1).toString();
      if (GAME_ENGINE.keys[key]) {
        GAME_ENGINE.keys[key] = false;
        this.selectedSpell = i;
        window.ASSET_MANAGER.playAsset("./assets/sfx/click1.ogg");
      }
    }

    // cast spell

    if (this.spellCooldowns[this.selectedSpell] <= 0 && GAME_ENGINE.keys["m1"]) {
      this.spellCooldowns[this.selectedSpell] = this.maxSpellCooldown;
      window.ASSET_MANAGER.playAsset("./assets/sfx/revolver_shot.ogg", 1);

      if (this.selectedSpell === 0) {
        const fireball = new Fireball();
        fireball.x = this.x;
        fireball.y = this.y;
        fireball.dir = Util.getAngle(
          {
            x: this.x - GAME_ENGINE.camera.x,
            y: this.y - GAME_ENGINE.camera.y
          },
          {
            x: GAME_ENGINE.mouse.x,
            y: GAME_ENGINE.mouse.y
          }
        );
        GAME_ENGINE.addEntity(fireball);
      }
      else if (this.selectedSpell === 1) {
        const chain_lightning = new ChainLightning(this, Util.getAngle(
          {
            x: this.x - GAME_ENGINE.camera.x,
            y: this.y - GAME_ENGINE.camera.y
          },
          {
            x: GAME_ENGINE.mouse.x,
            y: GAME_ENGINE.mouse.y
          }));
          GAME_ENGINE.addEntity(chain_lightning);
      }

    }

    // footstep sfx
    if (this.isMoving && this.isGrounded) {
      this.timeSinceLastFootstep += GAME_ENGINE.clockTick;
      if (this.timeSinceLastFootstep >= this.timeBetweenFootsteps) {
        this.timeSinceLastFootstep = 0;
        window.ASSET_MANAGER.playAsset("./assets/sfx/footstep.wav");
      }
    }

    // Player State Logic
    if (!this.isDead) {
      if (this.hitTimer > 0) {
        this.hitTimer -= GAME_ENGINE.clockTick;
      } else if (
        this.currentAnimation === PLAYER_SPRITESHEET.ATTACK1.NAME ||
        this.currentAnimation === PLAYER_SPRITESHEET.ATTACK2.NAME
      ) {
        // Do nothing, let the attack animation play out
      } else {
        // Only switch animations if the hit animation is NOT playing
        if (!this.isGrounded) {
          if (this.y_velocity < 0) {
            this.setAnimation(PLAYER_SPRITESHEET.JUMP.NAME);
          } else {
            this.setAnimation(PLAYER_SPRITESHEET.FALL.NAME);
          }
        } else if (this.isMoving) {
          this.setAnimation(PLAYER_SPRITESHEET.RUN.NAME);
        } else {
          this.setAnimation(PLAYER_SPRITESHEET.IDLE.NAME);
        }
      }
    } else {
      this.setAnimation(PLAYER_SPRITESHEET.DEAD.NAME, false);
    }

    if (
      this.recieved_attacks.length > 0 &&
      this.currentAnimation !== PLAYER_SPRITESHEET.HIT.NAME
    ) {
      console.log(
        "ouch! i took " + this.recieved_attacks[0].damage + " damage"
      );

      this.setAnimation(PLAYER_SPRITESHEET.HIT.NAME);
      this.health -= this.recieved_attacks[0].damage;

      this.hitTimer = 0.3;
    }

    this.recieved_attacks = [];

    // process each attack

    // this.recieved_attacks.forEach((attack) => {
    //   console.log("ouch! i took " + attack.damage + " damage");
    //   this.setAnimation(PLAYER_SPRITESHEET.HIT.NAME);
    //   this.health -= attack.damage;
    // });
    // this.recieved_attacks = [];

    if (this.health <= 0) {
      this.isDead = true;
      this.setAnimation(PLAYER_SPRITESHEET.DEAD.NAME, false);
      console.log("i died");
    }

    // Update the active animation
    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  onAnimationComplete() {
    // Check if the current animation is the attack animation
    if (
      this.currentAnimation === PLAYER_SPRITESHEET.ATTACK1.NAME ||
      this.currentAnimation === PLAYER_SPRITESHEET.ATTACK2.NAME
    ) {
      // Switch back to the idle animation after the attack animation completes
      this.setAnimation(PLAYER_SPRITESHEET.IDLE.NAME);
    }
  }
}
