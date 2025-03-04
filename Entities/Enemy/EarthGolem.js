import { Actor } from "../Actor.js";
import { Player } from "../Player/Player.js";
import * as Util from "../../Utils/Util.js";
import { Collider } from "../Collider.js";
import { GAME_ENGINE } from "../../main.js";

export class EarthGolem extends Actor {
  constructor(x, y) {
    super();
    Object.assign(this, { x, y });

    // Load Animations
    this.assetManager = window.ASSET_MANAGER;

    this.addAnimation(
      "idle",
      this.assetManager.getAsset("./assets/enemy/golem/golem_idle.png"),
      128, 90, 5, 0.4
    );

    this.addAnimation(
      "walk",
      this.assetManager.getAsset("./assets/enemy/golem/golem_walk.png"),
      384, 90, 8, 0.2
    );

    this.addAnimation(
      "hit",
      this.assetManager.getAsset("./assets/enemy/golem/golem_hit.png"),
      384, 90, 17, 0.05
    );

    this.setAnimation("idle");

    // **Golem Properties**
    this.scale = 3;
    this.width = 100;
    this.height = 200;
    this.collider = new Collider(this.width, this.height);

    this.health = 300;
    this.maxHealth = 300;
    this.attackRadius = 150;
    this.attackCooldown = 0;
    this.attackRate = 3; // 3 seconds before next attack

    // **Movement**
    this.walkSpeed = 80;
    this.aggroSpeed = 160;
    this.speed = 0;
    this.gravity = 1000;

    this.visualRadius = 600;
    this.target = { x: this.x, y: this.y };
    this.velocity = { x: 0, y: this.gravity };

    // **Flags**
    this.isEnemy = true;
    this.seesPlayer = false;
    this.isProvoked = false;
    this.isAttacking = false;
    this.isStomping = false;
  }

  update() {
    this.recieveEffects();

    if (this.health <= 0) {
      this.removeFromWorld = true;
      return;
    }

    if (this.effects.frozen > 0 || this.effects.stun > 0) return;

    this.recieveAttacks();
    this.attackCooldown += GAME_ENGINE.clockTick;
    this.onGround = false;

    if (this.isProvoked) {
      for (let entity of GAME_ENGINE.entities) {
        if (entity instanceof Player && Util.canSee(this, entity)) {
          this.target = { x: entity.x, y: entity.y };
          this.seesPlayer = true;
        }
      }
    }

    this.setState();
    this.movement();

    this.flip = this.velocity.x < 0 ? 1 : 0;
    this.updateAnimation(GAME_ENGINE.clockTick);
  }

  // **Golem State Behavior**
  setState() {
    if (!this.isProvoked) {
      this.speed = 0;
      this.setAnimation("idle");
    } else {
      if (this.seesPlayer && !this.isAttacking) {
        this.speed = this.aggroSpeed;
        this.setAnimation("walk");
      }

      let xDistance = Math.abs(this.x - this.target.x);
      let yDistance = Math.abs(this.y - this.target.y);

      if (this.seesPlayer && xDistance < this.attackRadius / 2 && yDistance < this.height / 2) {
        if (!this.isStomping && this.attackCooldown >= this.attackRate) {
          this.isAttacking = true;
          this.setAnimation("hit");

          setTimeout(() => {
            this.stompAttack();
          }, 850);
        }
      }
    }
  }

  // **Improved Golem Stomp Attack**
  stompAttack() {
    if (this.isStomping || this.attackCooldown < this.attackRate) return;

    console.log(`Earth Golem Stomps at (${this.x}, ${this.y})!`);

    this.isStomping = true;
    this.attackCooldown = 0; // Reset cooldown

    // **Determine direction and apply mirroring**
    let moveDirection = this.x < this.target.x ? -1 : 1; 
    this.flip = moveDirection > 0 ? 1 : 0; // Flip left if moving left, right if moving right

    this.setAnimation("hit"); // Play stomp animation in the correct direction

    let hasDealtDamage = false;

    for (let entity of GAME_ENGINE.entities) {
        if (entity instanceof Player) {
            let xDistance = Math.abs(this.x - entity.x);
            let yDistance = Math.abs(this.y - entity.y);

            if (!hasDealtDamage && xDistance < this.attackRadius && yDistance < this.height / 2) {
                entity.queueAttack({ damage: Math.min(50, entity.health) }); 
                window.ASSET_MANAGER.playAsset("./assets/sfx/golem_attack.wav", 1 * Util.DFCVM(this));
                console.log("Player hit for up to 50 damage!");
                hasDealtDamage = true;
            }
        }
    }

    // **Cooldown before next stomp**
    setTimeout(() => {
        this.isStomping = false;
        this.isAttacking = false;
        this.setAnimation("idle"); // Return to idle state after attack
    }, 2000); 

    // **Move away after stomping**
    this.velocity.x = moveDirection * 200; // Move in opposite direction after stomp
}


  movement() {
    if (!this.isProvoked || this.isAttacking) return;

    let distance = Util.getDistance(this, this.target);
    this.velocity = {
      x: ((this.target.x - this.x) / distance) * this.speed,
      y: this.gravity,
    };

    this.x += this.velocity.x * GAME_ENGINE.clockTick;

    for (let e of GAME_ENGINE.entities) {
      if (e.isPlayer || e.isAttack || e.isEnemy || e.isEffect || e.isDestructibleObject || e.isSpike || e.isSpawnPoint) continue;
      if (this.colliding(e)) {
        this.moveAgainstX(e);
      }
    }
    
    this.y += this.velocity.y * GAME_ENGINE.clockTick;

    for (let e of GAME_ENGINE.entities) {
      if (e.isPlayer || e.isAttack || e.isEnemy || e.isDestructibleObject || e.isSpike || e.isSpawnPoint) continue;
      if (this.colliding(e)) {
        this.moveAgainstY(e);
      }
    }
  }

  draw(ctx) {
    super.draw(ctx);

    //Draw state indicator above the Golem
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    if(!this.isStomping){
      let stateText = this.isProvoked ? "AGRHH" : "ZZZZ";
      ctx.fillText(stateText, this.x - GAME_ENGINE.camera.x + this.width / 2, this.y - GAME_ENGINE.camera.y - 10);
    }

    // **Show Stomp Indicator**
    if (this.isStomping) {
      ctx.font = "bold 30px Arial";
      ctx.fillStyle = "red";
      ctx.fillText("STOMP!", this.x - GAME_ENGINE.camera.x + this.width / 2, this.y - GAME_ENGINE.camera.y - 30);
    }
  }

  getBoundingBox() {
    return {
      x: this.x - this.width * 0.25,
      y: this.y - this.height * 0.5,
      width: this.width * 0.5,
      height: this.height * 0.8,
    };
  }

  recieveAttacks() {
    for (let attack of this.recieved_attacks) {
      this.health -= attack.damage;
      console.log(`Golem took ${attack.damage} damage! Health: ${this.health}`);

      if (this.health > 0) {
        this.isProvoked = true;
      }
    }
    this.recieved_attacks = [];
  }
}


