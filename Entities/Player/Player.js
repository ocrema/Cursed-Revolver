import { Actor } from "../Entities.js";
import { PLAYER_SPRITESHEET } from "../../Globals/Constants.js";
import * as Util from "../../Utils/Util.js";
import { Fireball } from "../Spells/Fireball.js";
import { ChainLightning } from "../Spells/ChainLightning.js";
import { Collider } from "../Collider.js";
import { GAME_ENGINE } from "../../main.js";
import { PlayerAnimationLoader } from "./PlayerAnimationLoader.js";
import { WaterWave } from "../Spells/WaterWave.js";
import { Icicle } from "../Spells/Icicle.js";

export class Player extends Actor {
  constructor(x, y) {
    super();
    // Assigns asset manager from window asset manager singleton
    this.assetManager = window.ASSET_MANAGER;
    this.scale = 1.7;
    this.x = x;
    this.y = y;

    this.isPlayer = true;

    // switches between attack animations for the player
    this.attackState = 1;

    // Adds all player animations
    this.playerAnimationLoader = new PlayerAnimationLoader(this);

    this.playerAnimationLoader.loadPlayerAnimations();

    this.speed = 500; // Movement speed
    this.isMoving = false; // Whether the player is moving
    this.health = 200;
    this.maxHealth = 200;
    this.isLaunchable = true;
    this.inWater = false;
    this.validEffects = {};

    // Start with the idle animation
    this.setAnimation(PLAYER_SPRITESHEET.IDLE.NAME);

    this.collider = new Collider(65, 110);

    this.x_velocity = 0;
    this.y_velocity = 0;
    this.isGrounded = 0; // values above 0 indicate that the player is grounded, so the player can still jump for a little bit after falling off a platform

    this.selectedSpell = 0;
    this.spellCooldowns = [0, 0, 0, 0, 0, 0];
    this.maxSpellCooldown = 1;

    this.timeBetweenFootsteps = 0.4;
    this.timeSinceLastFootstep = 0.4;

    this.isDashing = 0;
    this.dashTime = 0.15;
    this.dashSpeed = 700;
    this.storedDashSpeed = 0;
    this.dashCooldown = 0;

    this.wallGrabState = 0;

    this.jumpCooldown = 0;

    this.isGroundSlamming = false;
    this.groundSlamSpeed = 3000;
  }

  update() {
    this.isMoving = false;
    this.isJumping = false;

    // Player Reset Button - this is if the player dies, this resets player health and respawns them.
    if (GAME_ENGINE.keys["h"]) {
      this.isDead = false;
      this.health = 200;
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
      // console.log(
      //   "ouch! i took " + this.recieved_attacks[0].damage + " damage"
      // );

      this.setAnimation(PLAYER_SPRITESHEET.HIT.NAME);

      this.hitTimer = 0.3;
    }

    this.recieveAttacks();
    this.recieveEffects();

    if (this.health <= 0) {
      this.isDead = true;
      this.setAnimation(PLAYER_SPRITESHEET.DEAD.NAME, false);
      //console.log("i died");
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
    this.inWater = false;
    //gravity
    this.y_velocity = Math.min(
      this.y_velocity + GAME_ENGINE.clockTick * 3000,
      3000
    );

    // air resistance / friction basically
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

    for (let e of GAME_ENGINE.entities) {
      if (e.isWater && this.colliding(e)) {
        this.inWater = true;
        break;
      }
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

    this.dashCooldown = Math.max(this.dashCooldown - GAME_ENGINE.clockTick, 0);
    this.jumpCooldown = Math.max(this.jumpCooldown - GAME_ENGINE.clockTick, 0);

    // jump
    if (
      GAME_ENGINE.keys[" "] &&
      this.isGrounded > 0 &&
      this.isDashing <= 0 &&
      this.jumpCooldown <= 0
    ) {
      this.isGrounded = 0;
      this.jumpCooldown = 0.4;
      this.y_velocity = -1500; // Jumping velocity
      this.setAnimation(PLAYER_SPRITESHEET.JUMP.NAME);
      this.isJumping = true;
      window.ASSET_MANAGER.playAsset("./assets/sfx/jump.ogg");
    } else if (
      GAME_ENGINE.keys[" "] &&
      this.wallGrabState !== 0 &&
      this.isDashing <= 0 &&
      this.jumpCooldown <= 0
    ) {
      this.jumpCooldown = 0.4;
      this.y_velocity = -400;
      this.x_velocity = -1000 * this.wallGrabState;
      this.setAnimation(PLAYER_SPRITESHEET.JUMP.NAME);
      this.isJumping = true;
      window.ASSET_MANAGER.playAsset("./assets/sfx/jump.ogg");
    }

    let currentSpeed = this.speed;
    if (this.inWater) {
      currentSpeed *= 0.5;
    }

    // Movement logic

    let velFromKeys = 0;
    if (
      GAME_ENGINE.keys["a"] ||
      (this.isDashing > 0 && this.storedDashSpeed < 0)
    ) {
      velFromKeys -= currentSpeed;
      this.isMoving = true;
      this.flip = true;
    }
    if (
      GAME_ENGINE.keys["d"] ||
      (this.isDashing > 0 && this.storedDashSpeed > 0)
    ) {
      velFromKeys += currentSpeed;
      this.isMoving = true;
      this.flip = false;
    }

    // Player Collision Logic

    let hitSomething = false;

    if (!this.isGroundSlamming) {
      // make disired movement in x direction
      this.x += (this.x_velocity + velFromKeys) * GAME_ENGINE.clockTick;

      // for all of the entities i am colliding with, move the player as far back as i need to to not be colliding with any of them

      for (let e of GAME_ENGINE.entities) {
        if (
          e.isPlayer ||
          e.isAttack ||
          e.isEnemy ||
          e.isEffect ||
          e.isDestructibleObject ||
          e.isSpike
        )
          continue;
        if (e.isWater) {
          this.inWater = true;
          continue;
        }
        if (this.colliding(e)) {
          hitSomething = true;
          this.moveAgainstX(e);
        }
      }
      if (hitSomething) {
        if (velFromKeys !== 0 && this.isGrounded !== 0.2) {
          this.wallGrabState = velFromKeys > 0 ? 1 : -1;
          this.y_velocity = Math.min(this.y_velocity, 100);
        } else {
          this.wallGrabState = 0;
        }
        this.x_velocity = 0;
      } else {
        this.wallGrabState = 0;
      }
    }

    if (GAME_ENGINE.keys["s"] && this.isGrounded < 0.15) {
      this.isGroundSlamming = true;
      this.wallGrabState = 0;
    }
    if (this.isGroundSlamming) {
      this.y_velocity = this.groundSlamSpeed;
    }

    this.isGrounded = Math.max(this.isGrounded - GAME_ENGINE.clockTick, 0);

    // make disired movement in y direction
    this.y += this.y_velocity * GAME_ENGINE.clockTick;

    // for all of the entities i am colliding with, move the player as far back as i need to to not be colliding with any of them
    hitSomething = false;
    for (let e of GAME_ENGINE.entities) {
      if (
        e.isPlayer ||
        e.isAttack ||
        e.isEnemy ||
        e.isDestructibleObject ||
        e.isSpike
      )
        continue;

      if (e.isWater) {
        this.inWater = true;
        continue;
      }

      if (this.colliding(e)) {
        hitSomething = true;
        this.moveAgainstY(e);
      }
    }
    if (hitSomething) {
      if (this.y_velocity > 0) {
        this.isGrounded = 0.2;
        this.isGroundSlamming = false;
      }
      if (this.y_velocity > 300) {
        window.ASSET_MANAGER.playAsset("./assets/sfx/landing.wav", 1.5);
      }
      this.y_velocity = 0; // if hit something cancel velocity
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
    if (GAME_ENGINE.keys["q"]) {
      GAME_ENGINE.keys["q"] = false;
      this.selectedSpell--;
      if (this.selectedSpell < 0) this.selectedSpell = 5;
      console.log(this.selectedSpell);
      window.ASSET_MANAGER.playAsset("./assets/sfx/click1.ogg");
    }
    if (GAME_ENGINE.keys["e"]) {
      GAME_ENGINE.keys["e"] = false;
      this.selectedSpell++;
      if (this.selectedSpell > 5) this.selectedSpell = 0;
      window.ASSET_MANAGER.playAsset("./assets/sfx/click1.ogg");
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

      let dir = Util.getAngle(
        {
          x: this.x - GAME_ENGINE.camera.x,
          y: this.y - GAME_ENGINE.camera.y,
        },
        {
          x: GAME_ENGINE.mouse.x,
          y: GAME_ENGINE.mouse.y,
        }
      );

      if (this.selectedSpell === 0) {
        GAME_ENGINE.addEntity(new Fireball(this, dir));
      } else if (this.selectedSpell === 1) {
        GAME_ENGINE.addEntity(new ChainLightning(this, dir));
      } else if (this.selectedSpell === 2) {
        GAME_ENGINE.addEntity(new WaterWave(this, dir));
      } else if (this.selectedSpell === 3) {
        GAME_ENGINE.addEntity(new Icicle(this, dir));
      }
    }
  }
}
