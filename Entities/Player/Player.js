import { Actor } from "../Entities.js";
import { PLAYER_SPRITESHEET } from "../../Globals/Constants.js";
import * as Util from "../../Utils/Util.js";
import { Fireball } from "../Spells/Fireball.js";
import { ChainLightning } from "../Spells/ChainLightning.js";
import { Collider } from "../Collider.js";
import { GAME_ENGINE } from "../../main.js";
import { PlayerAnimationLoader } from "./PlayerAnimationLoader.js";

export class Player extends Actor {
  constructor() {
    super();
    // Assigns asset manager from window asset manager singleton
    this.assetManager = window.ASSET_MANAGER;
    this.scale = 1.5;
    this.x = 0;
    this.y = 0;

    this.isPlayer = true;

    // switches between attack animations for the player
    this.attackState = 1;

    // Adds all player animations
    this.playerAnimationLoader = new PlayerAnimationLoader(this);

    this.playerAnimationLoader.loadPlayerAnimations();

    this.speed = 500; // Movement speed
    this.isMoving = false; // Whether the player is moving
    this.health = 200;
    this.isLaunchable = true;
    this.validEffects = {};

    // Start with the idle animation
    this.setAnimation(PLAYER_SPRITESHEET.IDLE.NAME);

    this.collider = new Collider(60, 100);

    this.x_velocity = 0;
    this.y_velocity = 0;
    this.isGrounded = 0; // values above 0 indicate that the player is grounded, so the player can still jump for a little bit after falling off a platform

    this.selectedSpell = 0;
    this.spellCooldowns = [0, 0, 0, 0, 0];
    this.maxSpellCooldown = 1;

    this.timeBetweenFootsteps = 0.4;
    this.timeSinceLastFootstep = 0.4;

    this.isDashing = 0;
    this.dashTime = 0.15;
    this.dashSpeed = 1000;
    this.storedDashSpeed = 0;
    this.dashCooldown = 0;
  }

  update() {
    this.isMoving = false;
    this.isJumping = false;

    // Player Reset Button - this is if the player dies, this resets player health and respawns them.
    if (GAME_ENGINE.keys["h"]) {
      this.isDead = false;
      this.health = 100;
      this.x = 0;
      this.y = 0;
      this.setAnimation(PLAYER_SPRITESHEET.IDLE.NAME);
    }

    this.movement();

    this.spells();

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

      this.hitTimer = 0.3;
    }

    this.recieveAttacks();
    this.recieveEffects();

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

  movement() {
    this.y_velocity = Math.min(
      this.y_velocity + GAME_ENGINE.clockTick * 3000,
      10000
    );

    if (this.x_velocity > 0) {
      this.x_velocity = Math.max(
        this.x_velocity -
          GAME_ENGINE.clockTick * (this.isGrounded == 0.2 ? 9000 : 1000),
        0
      );
    } else {
      this.x_velocity = Math.min(
        this.x_velocity +
          GAME_ENGINE.clockTick * (this.isGrounded == 0.2 ? 9000 : 1000),
        0
      );
    }

    if (this.isDashing > 0) {
      this.y_velocity = 0;
      this.x_velocity = this.storedDashSpeed;
      this.isDashing -= GAME_ENGINE.clockTick;
    }
    if (
      GAME_ENGINE.keys["a"] &&
      !GAME_ENGINE.keys["d"] &&
      GAME_ENGINE.keys["Shift"] &&
      this.dashCooldown <= 0
    ) {
      this.storedDashSpeed = Math.min(this.x_velocity, this.dashSpeed * -1);
      this.isDashing = this.dashTime;
      this.dashCooldown = 0.5;
      window.ASSET_MANAGER.playAsset("./assets/sfx/jump.ogg");
    } else if (
      GAME_ENGINE.keys["d"] &&
      !GAME_ENGINE.keys["a"] &&
      GAME_ENGINE.keys["Shift"] &&
      this.dashCooldown <= 0
    ) {
      this.storedDashSpeed = Math.max(this.x_velocity, this.dashSpeed);
      this.isDashing = this.dashTime;
      this.dashCooldown = 0.5;
      window.ASSET_MANAGER.playAsset("./assets/sfx/jump.ogg");
    }

    this.isGrounded = Math.max(this.isGrounded - GAME_ENGINE.clockTick, 0);
    this.dashCooldown = Math.max(this.dashCooldown - GAME_ENGINE.clockTick, 0);

    if (GAME_ENGINE.keys[" "] && this.isGrounded > 0 && this.isDashing <= 0) {
      this.isGrounded = 0;
      this.y_velocity = -1500; // Jumping velocity
      this.setAnimation(PLAYER_SPRITESHEET.JUMP.NAME);
      this.isJumping = true;
      window.ASSET_MANAGER.playAsset("./assets/sfx/jump.ogg");
    }

    // Movement logic

    let velFromKeys = 0;
    if (
      GAME_ENGINE.keys["a"] ||
      (this.isDashing > 0 && this.storedDashSpeed < 0)
    ) {
      velFromKeys -= this.speed;
      this.isMoving = true;
      this.flip = true;
    }
    if (
      GAME_ENGINE.keys["d"] ||
      (this.isDashing > 0 && this.storedDashSpeed > 0)
    ) {
      velFromKeys += this.speed;
      this.isMoving = true;
      this.flip = false;
    }

    // Player Collision Logic

    this.x += (this.x_velocity + velFromKeys) * GAME_ENGINE.clockTick;
    let collisions = [];
    for (let e of GAME_ENGINE.entities) {
      if (
        e.isPlayer ||
        e.isAttack ||
        e.isEnemy ||
        e.isEffect ||
        e.isDestructibleObject
      )
        continue;
      if (this.colliding(e)) {
        collisions.push(e);
      }
    }
    if (collisions.length !== 0) {
      if (this.x_velocity + velFromKeys > 0) {
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
      if (
        e.isPlayer ||
        e.isAttack ||
        e.isEnemy ||
        e.isEffect ||
        e.isDestructibleObject
      )
        continue;
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
  }

  spells() {
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

    if (
      this.spellCooldowns[this.selectedSpell] <= 0 &&
      GAME_ENGINE.keys["m1"]
    ) {
      // Calculate direction to mouse
      const mouseX = GAME_ENGINE.mouse.x + GAME_ENGINE.camera.x;
      this.flip = mouseX < this.x; // Flip player based on mouse position
      if (this.attackState === 1) {
        this.setAnimation(PLAYER_SPRITESHEET.ATTACK1.NAME, false);
        this.attackState = 2;
      } else {
        this.setAnimation(PLAYER_SPRITESHEET.ATTACK2.NAME, false);
        this.attackState = 1;
      }

      this.spellCooldowns[this.selectedSpell] = this.maxSpellCooldown;
      window.ASSET_MANAGER.playAsset("./assets/sfx/revolver_shot.ogg", 1);

      if (this.selectedSpell === 0) {
        const fireball = new Fireball();
        fireball.x = this.x;
        fireball.y = this.y;
        fireball.dir = Util.getAngle(
          {
            x: this.x - GAME_ENGINE.camera.x,
            y: this.y - GAME_ENGINE.camera.y,
          },
          {
            x: GAME_ENGINE.mouse.x,
            y: GAME_ENGINE.mouse.y,
          }
        );
        GAME_ENGINE.addEntity(fireball);
      } else if (this.selectedSpell === 1) {
        const chain_lightning = new ChainLightning(
          this,
          Util.getAngle(
            {
              x: this.x - GAME_ENGINE.camera.x,
              y: this.y - GAME_ENGINE.camera.y,
            },
            {
              x: GAME_ENGINE.mouse.x,
              y: GAME_ENGINE.mouse.y,
            }
          )
        );
        GAME_ENGINE.addEntity(chain_lightning);
      } else if (this.selectedSpell === 1) {
        const chain_lightning = new ChainLightning(
          this,
          Util.getAngle(
            {
              x: this.x - GAME_ENGINE.camera.x,
              y: this.y - GAME_ENGINE.camera.y,
            },
            {
              x: GAME_ENGINE.mouse.x,
              y: GAME_ENGINE.mouse.y,
            }
          )
        );
        GAME_ENGINE.addEntity(chain_lightning);
      }
    }
  }
}
