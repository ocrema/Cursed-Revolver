import { Actor } from "../Entities.js";
import { Player } from "../Player/Player.js";
import * as Util from "../../Utils/Util.js";
import { Collider } from "../Collider.js";
import { GAME_ENGINE } from "../../main.js";
import { Tile } from "../Map/Tiles/Tile.js";


export class EarthGolem extends Actor {
  constructor(x, y) {
    super();
    Object.assign(this, { x, y });

    // Load Animations (All use golem_walk.png)
    this.assetManager = window.ASSET_MANAGER;

    this.addAnimation(
        "walk", 
        this.assetManager.getAsset("./assets/enemy/golem/golem_walk.png"), 
        384, // Corrected Frame Width
        90, // Corrected Frame Height
        8,   // Number of frames
        0.4  // Frame duration
    );
      

    this.setAnimation("walk"); // Default animation

    // **Golem Properties**
    this.scale = 3;
    this.width = 100;
    this.height = 200;
    this.collider = new Collider(this.width, this.height);
    
    //this.width = 80;
    //this.height = 100;
    this.scale = 3;

    this.health = 300; // Tanky enemy
    this.maxHealth = 300;
    this.attackRadius = 150; // Short melee range
    this.attackCooldown = 0;
    this.attackRate = 3; // Attacks every 3 seconds

    // **Movement**
   // this.collider = new Collider(this.width, this.height);
    this.randomRoamLength = [150, 200, 250]; // Moves small distances
    this.walkSpeed = 100; // Slow movement
    this.aggroSpeed = 150; // Slightly faster when it sees player
    this.attackSpeed = 0; // Stops moving during attack
    this.speed = this.walkSpeed;
    this.gravity = 1000;

    this.visualRadius = 600; // Detection range
    this.target = { x: this.x + 150, y: this.y }; // Moves a bit when roaming

    var distance = Util.getDistance(this, this.target);
    this.velocity = {
      x: ((this.target.x - this.x) / distance) * this.walkSpeed,
      y: ((this.target.y - this.y) / distance) * this.walkSpeed,
    };

    // Flags
    this.isEnemy = true;
    this.seesPlayer = false;
  }

  update() {
    this.attackCooldown += GAME_ENGINE.clockTick;
    this.recieveEffects();
    this.onGround = false;

    // **Check if player is in range**
    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Player && Util.canSee(this, entity)) {
        this.target = { x: entity.x, y: entity.y };
        this.seesPlayer = true;
      }
    }

    this.setState();
    this.movement();

    // **Flip sprite to face player**
    if (this.velocity.x < 0) {
      this.flip = 1; // Face left
    } else if (this.velocity.x > 0) {
      this.flip = 0; // Face right
    }

    // **Apply attack damage**
    for (let attack of this.recieved_attacks) {
      this.health -= attack.damage;
    }
    this.recieved_attacks = [];

    if (this.health <= 0) {
      this.removeFromWorld = true;
    }
  }

  // **Golem State Behavior**
  setState() {
    if (!this.seesPlayer && Math.abs(this.x - this.target.x) < 5) {
      this.speed = this.walkSpeed;

      if (this.velocity.x < 0) {
        this.target.x += this.randomRoamLength[Util.randomInt(this.randomRoamLength.length)];
      } else {
        this.target.x -= this.randomRoamLength[Util.randomInt(this.randomRoamLength.length)];
      }
    }

    if (this.seesPlayer && this.attackCooldown < this.attackRate) {
      this.speed = this.aggroSpeed; // Move slightly faster
    }

    // **Attack when close to player**
    if (this.seesPlayer && this.attackCooldown > this.attackRate && Math.abs(this.x - this.target.x) < this.attackRadius) {
      this.speed = this.attackSpeed;
      if (this.attackCooldown > this.attackRate) {
        this.attackCooldown = 0;
        this.stompAttack();
      }
    }
  }

  // **Golem Stomp Attack**
  stompAttack() {
    console.log(`Earth Golem Stomps at (${this.x}, ${this.y})!`);

    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Player && Math.abs(this.x - entity.x) < this.attackRadius) {
        entity.queueAttack({ damage: 30 }); // Heavy stomp attack
        console.log("Player hit by Earth Golem Stomp!");
      }
    }
  }

  // **Movement Handling**
  movement() {
    this.x += this.velocity.x * GAME_ENGINE.clockTick;
    this.y += this.velocity.y * GAME_ENGINE.clockTick;

    var distance = Util.getDistance(this, this.target);

    this.velocity = {
      x: ((this.target.x - this.x) / distance) * this.speed,
      y: this.gravity,
    };

    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Tile && entity.collider && this.colliding(entity)) {
        let thisBottom = this.y + this.height / 2;
        let eTop = entity.y - entity.collider.height / 2;

        if (thisBottom > eTop) {
          this.y = eTop - this.height / 2;
          this.velocity.y = 0;
        }
      }
    }
  }

  draw(ctx) {
    if (GAME_ENGINE.debug_colliders) {
      super.draw(ctx);
      ctx.strokeStyle = "brown";
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
  }

  getBoundingBox() {
    return {
      x: this.x - this.width * 0.25, // Center horizontally
      y: this.y - this.height * 0.5, // Move collider lower
      width: this.width * 0.5,
      height: this.height * 0.8,
    };
  }
  
}
