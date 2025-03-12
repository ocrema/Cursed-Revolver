import { Actor } from "../Actor.js";
import { Collider } from "../Collider.js";
import { GAME_ENGINE } from "../../main.js";
import { CROW_SPRITESHEET } from "../../Globals/Constants.js";
import * as Util from "../../Utils/Util.js";
import { BirdJaw, Jaw } from "./Attack.js";
import { AnimationLoader } from "../../Core/AnimationLoader.js";

export class Crow extends Actor {
  constructor(x, y) {
    super();
    Object.assign(this, { x, y });

    this.assetManager = window.ASSET_MANAGER;

    // Animations
    this.animationLoader = new AnimationLoader(this);
    this.animationLoader.loadAnimations(CROW_SPRITESHEET);

    this.setAnimation(CROW_SPRITESHEET.FLY.NAME);
    this.width = 60;
    this.height = 40;
    this.scale = 7;
    this.health = 80;
    this.maxHealth = 80;

    // Movement
    this.patrolSpeed = 400;
    this.attackSpeed = 800;
    this.retreatSpeed = 800;
    this.patrolRange = 600;
    this.startX = x;
    this.startY = y;
    this.direction = 1;
    this.turnBuffer = 2;

    // Visual Detection Radius
    this.visualRadius = 800;

    // Attack Handling
    this.attackCooldown = 0;
    this.attackRate = 0.5;
    this.isAttacking = false;
    this.retreating = false;
    this.target = { x: this.x, y: this.y };
    this.attackStartPosition = { x: this.x, y: this.y }; // Store original position before attack
    this.jaw = null;

    // State Management
    this.states = {
      PATROL: "PATROL",
      ATTACK: "ATTACK",
      RETREAT: "RETREAT",
    };
    this.state = this.states.PATROL;

    // Damage Handling
    this.isHurt = false;
    this.hurtDuration = 0.15;
    this.hurtTimer = 0;

    // Death Handling
    this.isDead = false;
    this.isFalling = false;
    this.fallSpeed = 0;
    this.gravity = 800;
    this.groundY = null;
    this.deathTimer = 0;

    // Collider
    this.collider = new Collider(
      (this.width * this.scale - 50) / 2,
      (this.height * this.scale - 50) / 2
    );

    // Flags
    this.isEnemy = true;
  }

  update() {
    // console.log(`🦅 Crow State: ${this.state}`);

    if (!this.isDead) {
      this.applyDamageLogic();
      if (this.effects.frozen > 0 || this.effects.stun > 0) return;

      if (this.directionX > 0) {
        this.flip = 1; // Facing right
      } else if (this.directionX < 0) {
        this.flip = 0; // Facing left
      }

      if (this.retreating) {
        this.retreat();
      }

      if (this.isHurt) {
        this.hurtTimer -= GAME_ENGINE.clockTick;
        if (this.hurtTimer <= 0) {
          this.isHurt = false;
          this.setAnimation(CROW_SPRITESHEET.FLY.NAME);
        }
      }

      this.attackCooldown -= GAME_ENGINE.clockTick;
      this.updateState();
    }

    //this.state);
    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  updateState() {
    const player = window.PLAYER;
    if (!player) return;

    if (this.state === this.states.PATROL) {
      this.patrol();

      if (this.attackCooldown <= 0 && Util.canSee(this, player)) {
        console.log("Crow spotted the player! Preparing to attack!");
        this.startAttack(player);
      }
    } else if (this.state === this.states.ATTACK) {
      this.attack();
    }
  }

  patrol() {
    this.x += this.patrolSpeed * this.direction * GAME_ENGINE.clockTick;

    // Ensure sprite flips correctly
    this.flip = this.direction > 0 ? 1 : 0;

    if (Math.abs(this.x - this.startX) > this.patrolRange - this.turnBuffer) {
      this.direction *= -1;
      this.x += this.direction * this.turnBuffer;
    }
  }

  startAttack(player) {
    this.state = this.states.ATTACK;
    this.setAnimation(CROW_SPRITESHEET.ATTACK.NAME);
    this.isAttacking = true;
    this.attackStartPosition = { x: this.x, y: this.y };
    this.target = { x: player.x, y: player.y + 50 };

    if (!this.jaw || this.jaw.removeFromWorld) {
      this.jaw = new BirdJaw(this);
      GAME_ENGINE.addEntity(this.jaw);
    }

    // Flip based on target direction
    this.flip = this.target.x > this.x ? 1 : 0;
  }

  attack() {
    var distance = Util.getDistance(this, this.target);

    if (distance < 10 || !this.jaw) {
      this.resetToPatrol();
      return;
    }

    this.x +=
      ((this.target.x - this.x) / distance) *
      this.attackSpeed *
      GAME_ENGINE.clockTick;
    this.y +=
      ((this.target.y - this.y) / distance) *
      this.attackSpeed *
      GAME_ENGINE.clockTick;

    // Flip based on movement direction
    this.flip = this.target.x - this.x > 0 ? 1 : 0;
  }

  resetToPatrol() {
    this.state = this.states.RETREAT;
    this.setAnimation(CROW_SPRITESHEET.FLY.NAME);
    this.isAttacking = false;
    this.retreating = true;
    this.attackCooldown = this.attackRate;
    this.retreatTarget = {
      x: this.attackStartPosition.x, // Inverse X
      y: this.attackStartPosition.y, // Same Y
    };
  }

  retreat() {
    var distance = Util.getDistance(this, this.retreatTarget);

    this.x +=
      ((this.retreatTarget.x - this.x) / distance) *
      this.retreatSpeed *
      GAME_ENGINE.clockTick;
    this.y +=
      ((this.retreatTarget.y - this.y) / distance) *
      this.retreatSpeed *
      GAME_ENGINE.clockTick;

    // Flip based on movement direction
    this.flip = this.retreatTarget.x - this.x > 0 ? 1 : 0;

    if (distance < 20) {
      this.x = this.retreatTarget.x;
      this.y = this.retreatTarget.y;
      this.retreating = false;
      this.state = this.states.PATROL;
      this.attackCooldown = this.attackRate;
    }
  }

  clearQueuedAttacks() {
    if (this.recieved_attacks.length > 0) {
      this.setAnimation(CROW_SPRITESHEET.HURT.NAME);
      this.isHurt = true;
      this.hurtTimer = this.hurtDuration;
    } else if (this.health <= 0) {
      this.die();
      return;
    }
    this.recieved_attacks = [];
  }

  applyDamageLogic() {
    if (this.isDead) return;
    this.recieveAttacks();
    this.recieveEffects();
  }

  die() {
    this.isDead = true;
    this.setAnimation(CROW_SPRITESHEET.DEATH.NAME, false);
    this.onDeath();
  }

  draw(ctx) {
    if (GAME_ENGINE.debug_colliders) {
      super.draw(ctx);
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(
        this.x - GAME_ENGINE.camera.x,
        this.y - GAME_ENGINE.camera.y,
        this.visualRadius,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    } else {
      super.draw(ctx);
    }
    this.drawEffects(ctx);
  }

  onAnimationComplete() {
    this.removeFromWorld = true;
  }
}
