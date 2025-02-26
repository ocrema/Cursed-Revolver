import { Actor } from "../Actor.js";
import { Collider } from "../Collider.js";
import { GAME_ENGINE } from "../../main.js";
import { CROW_SPRITESHEET } from "../../Globals/Constants.js";
import { canSee } from "../../Utils/Util.js"; // Import vision check function
import { Jaw } from "./Attack.js";

export class Crow extends Actor {
  constructor(x, y) {
    super();
    Object.assign(this, { x, y });

    this.assetManager = window.ASSET_MANAGER;

    // Animations
    this.addAnimation(
      CROW_SPRITESHEET.FLY.NAME,
      this.assetManager.getAsset(CROW_SPRITESHEET.FLY.URL),
      CROW_SPRITESHEET.FLY.FRAME_WIDTH,
      CROW_SPRITESHEET.FLY.FRAME_HEIGHT,
      CROW_SPRITESHEET.FLY.FRAME_COUNT,
      CROW_SPRITESHEET.FLY.FRAME_DURATION
    );

    this.addAnimation(
      CROW_SPRITESHEET.HURT.NAME,
      this.assetManager.getAsset(CROW_SPRITESHEET.HURT.URL),
      CROW_SPRITESHEET.HURT.FRAME_WIDTH,
      CROW_SPRITESHEET.HURT.FRAME_HEIGHT,
      CROW_SPRITESHEET.HURT.FRAME_COUNT,
      CROW_SPRITESHEET.HURT.FRAME_DURATION
    );

    this.addAnimation(
      CROW_SPRITESHEET.ATTACK.NAME,
      this.assetManager.getAsset(CROW_SPRITESHEET.ATTACK.URL),
      CROW_SPRITESHEET.ATTACK.FRAME_WIDTH,
      CROW_SPRITESHEET.ATTACK.FRAME_HEIGHT,
      CROW_SPRITESHEET.ATTACK.FRAME_COUNT,
      CROW_SPRITESHEET.ATTACK.FRAME_DURATION
    );

    this.addAnimation(
      CROW_SPRITESHEET.DEATH.NAME,
      this.assetManager.getAsset(CROW_SPRITESHEET.DEATH.URL),
      CROW_SPRITESHEET.DEATH.FRAME_WIDTH,
      CROW_SPRITESHEET.DEATH.FRAME_HEIGHT,
      CROW_SPRITESHEET.DEATH.FRAME_COUNT,
      CROW_SPRITESHEET.DEATH.FRAME_DURATION
    );

    this.setAnimation(CROW_SPRITESHEET.FLY.NAME);
    this.width = 60;
    this.height = 40;
    this.scale = 6;
    this.health = 60;
    this.maxHealth = 60;

    // Movement
    this.patrolSpeed = 150;
    this.attackSpeed = 300;
    this.patrolRange = 300;
    this.startX = x;
    this.startY = y;
    this.direction = 1;
    this.turnBuffer = 2;

    // Visual Detection Radius
    this.visualRadius = 800;

    // Attack Handling
    this.attackCooldown = 0;
    this.attackRate = 3;
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
    this.collider = new Collider(this.width, this.height);

    // Flags
    this.isEnemy = true;
  }

  update() {
    //console.log(`🦅 Crow State: ${this.state}`);

    if (this.isDead) {
      return;
    }
    
    this.applyDamageLogic();
    if (this.effects.frozen > 0 || this.effects.stun > 0) return;

    if (this.directionX > 0) {
      this.flip = 1; // Facing right
    } else if (this.directionX < 0) {
      this.flip = 0; // Facing left
    }

    if (this.retreating) {
      this.retreat();
      return;
    }

    if (this.isHurt) {
      this.hurtTimer -= GAME_ENGINE.clockTick;
      if (this.hurtTimer <= 0) {
        this.isHurt = false;
        this.setAnimation(CROW_SPRITESHEET.FLY.NAME);
      }
    } else {
      this.attackCooldown -= GAME_ENGINE.clockTick;
      this.updateState();
    }

    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  updateState() {
    const player = GAME_ENGINE.entities.find((e) => e.isPlayer);
    if (!player) return;

    if (this.state === this.states.PATROL) {
      this.patrol();

      if (this.attackCooldown <= 0 && canSee(this, player)) {
        //console.log("Crow spotted the player! Preparing to attack!");
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

    // Flip based on target direction
    this.flip = this.target.x > this.x ? 1 : 0;
  }

  attack() {
    let dx = this.target.x - this.x;
    let dy = this.target.y - this.y;

    this.x += dx * 0.02;
    this.y += dy * 0.02;

    // Flip based on movement direction
    this.flip = dx > 0 ? 1 : 0;

    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      if (!this.jaw || this.jaw.removeFromWorld) {
        this.attackCooldown = 0;
        this.jaw = new Jaw(this);
        GAME_ENGINE.addEntity(this.jaw);
      }
      this.resetToPatrol();
    }
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
    let dx = this.retreatTarget.x - this.x;
    let dy = this.retreatTarget.y - this.y;

    this.x += dx * 0.01;
    this.y += dy * 0.015;

    // Flip based on movement direction
    this.flip = dx > 0 ? 1 : 0;

    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
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
