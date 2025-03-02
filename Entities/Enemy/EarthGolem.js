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
      128, // Frame width
      90,  // Frame height
      5,   // Number of frames
      0.4  // Frame duration
    );

    this.addAnimation(
      "walk",
      this.assetManager.getAsset("./assets/enemy/golem/golem_walk.png"), 
      384, // Frame width
      90,  // Frame height
      8,   // Number of frames
      0.2  // Frame duration
    );
    
    this.addAnimation(
      "hit",
      this.assetManager.getAsset("./assets/enemy/golem/golem_hit.png"),
      384, // Frame width
      90,  // Frame height
      17,  // Number of frames
      0.05 // Frame duration
    );

    this.setAnimation("idle"); // Default animation

    // **Golem Properties**
    this.scale = 3;
    this.width = 100;
    this.height = 200;
    this.collider = new Collider(this.width, this.height);

    this.health = 300; // Tanky enemy
    this.maxHealth = 300;
    this.attackRadius = 150; // Short melee range
    this.attackCooldown = 0;
    this.attackRate = 3; // Attacks every 3 seconds

    // **Movement**
    this.walkSpeed = 80; // Slow movement initially
    this.aggroSpeed = 160; // Speed increases when provoked
    this.attackSpeed = 0; // Stops moving during attack
    this.speed = 0; // Start idle
    this.gravity = 1000;

    this.visualRadius = 600; // Player detection range
    this.target = { x: this.x, y: this.y }; // Initially idle
    this.velocity = { x: 0, y: this.gravity };

    // **Flags**
    this.isEnemy = true;
    this.seesPlayer = false;
    this.isProvoked = false;
    this.isAttacking = false;
  }

  update() {
    this.recieveAttacks();
    this.recieveEffects();
  
    if (this.health <= 0) {
      this.removeFromWorld = true;
      return;
    }

    if (this.effects.frozen > 0 || this.effects.stun > 0) return;

    this.attackCooldown += GAME_ENGINE.clockTick;
    this.onGround = false;

    // **Only track player if provoked**
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
      // **Idle before being hit**
      this.speed = 0;
      this.setAnimation("idle");
    } else {
      // **Provoked behavior**
      if (this.seesPlayer && !this.isAttacking) {
        this.speed = this.aggroSpeed;
        this.setAnimation("walk");
      }

      // **Trigger attack if player is very close**
      let xDistance = Math.abs(this.x - this.target.x);
      let yDistance = Math.abs(this.y - this.target.y);

      if (this.seesPlayer && xDistance < this.attackRadius / 2 && yDistance < this.height / 2) {
        this.speed = 0;
        this.isAttacking = true;
        this.setAnimation("hit");

        setTimeout(() => {
          this.stompAttack();
          this.isAttacking = false;
          this.setAnimation("walk");
        }, 850); // Wait for attack animation
      }
    }
  }

  // **Golem Stomp Attack**
  stompAttack() {
    console.log(`Earth Golem Stomps at (${this.x}, ${this.y})!`);

    for (let entity of GAME_ENGINE.entities) {
      if (entity instanceof Player) {
        let xDistance = Math.abs(this.x - entity.x);
        let yDistance = Math.abs(this.y - entity.y);

        // Ensure the player is near both horizontally AND vertically
        if (xDistance < this.attackRadius && yDistance < this.height / 2) {
          entity.queueAttack({ damage: 30 }); // Heavy stomp attack
          console.log("Player hit by Earth Golem Stomp!");
        }
      }
    }
  }

  // **Movement Handling**
  movement() {
    if (!this.isProvoked || this.isAttacking) return; // Do not move when idle or attacking

    var distance = Util.getDistance(this, this.target);

    this.velocity = {
      x: ((this.target.x - this.x) / distance) * this.speed,
      y: this.gravity,
    };

    this.x += this.velocity.x * GAME_ENGINE.clockTick;

    for (let e of GAME_ENGINE.entities) {
      if (e.isPlayer || e.isAttack || e.isEnemy || e.isEffect || e.isDestructibleObject || e.isSpike || e.isSpawnPoint) continue;
      if (e.isWater) {
        this.inWater = true;
        continue;
      }
      if (this.colliding(e)) {
        this.moveAgainstX(e);
      }
    }
    this.y += this.velocity.y * GAME_ENGINE.clockTick;
    for (let e of GAME_ENGINE.entities) {
      if (e.isPlayer || e.isAttack || e.isEnemy || e.isDestructibleObject || e.isSpike || e.isSpawnPoint) continue;
      if (e.isWater) {
        this.inWater = true;
        continue;
      }
      if (this.colliding(e)) {
        this.moveAgainstY(e);
      }
    }
  }

  draw(ctx) {
    super.draw(ctx);

    // Draw state indicator above the Golem
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = this.isProvoked ? "white" : "white";
    ctx.textAlign = "center";
    
    let stateText = this.isProvoked ? "RGGGG" : "ZZZZ";
    ctx.fillText(stateText, this.x - GAME_ENGINE.camera.x + this.width / 2, this.y - GAME_ENGINE.camera.y - 10);
  }

  getBoundingBox() {
    return {
      x: this.x - this.width * 0.25,
      y: this.y - this.height * 0.5,
      width: this.width * 0.5,
      height: this.height * 0.8,
    };
  }

  // **Receives Attacks, Provokes Golem, and Triggers "Hit" Animation Close to Player**
  recieveAttacks() {
    for (let attack of this.recieved_attacks) {
      this.health -= attack.damage;
      console.log(`Golem took ${attack.damage} damage! Health: ${this.health}`);

      if (this.health > 0) {
        this.isProvoked = true;

        let xDistance = Math.abs(this.x - this.target.x);
        let yDistance = Math.abs(this.y - this.target.y);

        if (this.seesPlayer && xDistance < this.attackRadius / 2 && yDistance < this.height / 2) {
          this.setAnimation("hit");
          setTimeout(() => this.setAnimation("walk"), 850);
        }
      }
    }
    this.recieved_attacks = [];
  }
}


// import { Actor } from "../Actor.js";
// import { Player } from "../Player/Player.js";
// import * as Util from "../../Utils/Util.js";
// import { Collider } from "../Collider.js";
// import { GAME_ENGINE } from "../../main.js";

// export class EarthGolem extends Actor {
//   constructor(x, y) {
//     super();
//     Object.assign(this, { x, y });

//     // Load Animations
//     this.assetManager = window.ASSET_MANAGER;

//     this.addAnimation(
//       "idle",
//       this.assetManager.getAsset("./assets/enemy/golem/golem_idle.png"), 
//       128, // Frame width
//       90,  // Frame height
//       5,   // Number of frames
//       0.4  // Frame duration
//     );

//     this.addAnimation(
//       "walk",
//       this.assetManager.getAsset("./assets/enemy/golem/golem_walk.png"), 
//       384, // Frame width
//       90,  // Frame height
//       8,   // Number of frames
//       0.2  // Frame duration
//     );
    
//     this.addAnimation(
//       "hit",
//       this.assetManager.getAsset("./assets/enemy/golem/golem_hit.png"),
//       384, // Frame width
//       90,  // Frame height
//       17,  // Number of frames
//       0.05 // Frame duration
//     );

//     this.setAnimation("idle"); // Default animation

//     // **Golem Properties**
//     this.scale = 3;
//     this.width = 100;
//     this.height = 200;
//     this.collider = new Collider(this.width, this.height);

//     this.health = 300; // Tanky enemy
//     this.maxHealth = 300;
//     this.attackRadius = 150; // Short melee range
//     this.attackCooldown = 0;
//     this.attackRate = 3; // Attacks every 3 seconds

//     // **Movement**
//     this.walkSpeed = 80; // Slow movement initially
//     this.aggroSpeed = 160; // Speed increases when provoked
//     this.attackSpeed = 0; // Stops moving during attack
//     this.speed = 0; // Start idle
//     this.gravity = 1000;

//     this.visualRadius = 600; // Player detection range
//     this.target = { x: this.x, y: this.y }; // Initially idle
//     this.velocity = { x: 0, y: this.gravity };

//     // **Flags**
//     this.isEnemy = true;
//     this.seesPlayer = false;
//     this.isProvoked = false;
//     this.isAttacking = false;
//   }

//   update() {
//     this.recieveAttacks();
//     this.recieveEffects();
  
//     if (this.health <= 0) {
//       this.removeFromWorld = true;
//       return;
//     }

//     if (this.effects.frozen > 0 || this.effects.stun > 0) return;

//     this.attackCooldown += GAME_ENGINE.clockTick;
//     this.onGround = false;

//     // **Only track player if provoked**
//     if (this.isProvoked) {
//       for (let entity of GAME_ENGINE.entities) {
//         if (entity instanceof Player && Util.canSee(this, entity)) {
//           this.target = { x: entity.x, y: entity.y };
//           this.seesPlayer = true;
//         }
//       }
//     }

//     this.setState();
//     this.movement();

//     this.flip = this.velocity.x < 0 ? 1 : 0;

//     this.updateAnimation(GAME_ENGINE.clockTick);
//   }

//   // **Golem State Behavior**
//   setState() {
//     if (!this.isProvoked) {
//       // **Idle before being hit**
//       this.speed = 0;
//       this.setAnimation("idle");
//     } else {
//       // **Provoked behavior**
//       if (this.seesPlayer && !this.isAttacking) {
//         this.speed = this.aggroSpeed;
//         this.setAnimation("walk");
//       }

//       // **Trigger attack if player is very close**
//       let xDistance = Math.abs(this.x - this.target.x);
//       let yDistance = Math.abs(this.y - this.target.y);

//       if (this.seesPlayer && xDistance < this.attackRadius / 2 && yDistance < this.height / 2) {
//         this.speed = 0;
//         this.isAttacking = true;
//         this.setAnimation("hit");

//         setTimeout(() => {
//           this.stompAttack();
//           this.isAttacking = false;
//           this.setAnimation("walk");
//         }, 850); // Wait for attack animation
//       }
//     }
//   }

//   // **Golem Stomp Attack**
//   stompAttack() {
//     console.log(`Earth Golem Stomps at (${this.x}, ${this.y})!`);

//     for (let entity of GAME_ENGINE.entities) {
//       if (entity instanceof Player) {
//         let xDistance = Math.abs(this.x - entity.x);
//         let yDistance = Math.abs(this.y - entity.y);

//         // Ensure the player is near both horizontally AND vertically
//         if (xDistance < this.attackRadius && yDistance < this.height / 2) {
//           entity.queueAttack({ damage: 30 }); // Heavy stomp attack
//           console.log("Player hit by Earth Golem Stomp!");
//         }
//       }
//     }
//   }

//   // **Movement Handling**
//   movement() {
//     if (!this.isProvoked || this.isAttacking) return; // Do not move when idle or attacking

//     var distance = Util.getDistance(this, this.target);

//     this.velocity = {
//       x: ((this.target.x - this.x) / distance) * this.speed,
//       y: this.gravity,
//     };

//     this.x += this.velocity.x * GAME_ENGINE.clockTick;

//     for (let e of GAME_ENGINE.entities) {
//       if (e.isPlayer || e.isAttack || e.isEnemy || e.isEffect || e.isDestructibleObject || e.isSpike || e.isSpawnPoint) continue;
//       if (e.isWater) {
//         this.inWater = true;
//         continue;
//       }
//       if (this.colliding(e)) {
//         this.moveAgainstX(e);
//       }
//     }
//     this.y += this.velocity.y * GAME_ENGINE.clockTick;
//     for (let e of GAME_ENGINE.entities) {
//       if (e.isPlayer || e.isAttack || e.isEnemy || e.isDestructibleObject || e.isSpike || e.isSpawnPoint) continue;
//       if (e.isWater) {
//         this.inWater = true;
//         continue;
//       }
//       if (this.colliding(e)) {
//         this.moveAgainstY(e);
//       }
//     }
//   }

//   draw(ctx) {
//     if (GAME_ENGINE.debug_colliders) {
//       super.draw(ctx);
//       ctx.strokeStyle = "brown";
//       ctx.beginPath();
//       ctx.arc(
//         this.x - GAME_ENGINE.camera.x,
//         this.y - GAME_ENGINE.camera.y,
//         this.visualRadius,
//         0,
//         Math.PI * 2
//       );
//       ctx.stroke();
//     } else {
//       super.draw(ctx);
//     }
//     this.drawEffects(ctx);
//   }

//   getBoundingBox() {
//     return {
//       x: this.x - this.width * 0.25,
//       y: this.y - this.height * 0.5,
//       width: this.width * 0.5,
//       height: this.height * 0.8,
//     };
//   }

//   // **Receives Attacks, Provokes Golem, and Triggers "Hit" Animation Close to Player**
//   recieveAttacks() {
//     for (let attack of this.recieved_attacks) {
//       this.health -= attack.damage;
//       console.log(`Golem took ${attack.damage} damage! Health: ${this.health}`);

//       if (this.health > 0) {
//         this.isProvoked = true;

//         let xDistance = Math.abs(this.x - this.target.x);
//         let yDistance = Math.abs(this.y - this.target.y);

//         if (this.seesPlayer && xDistance < this.attackRadius / 2 && yDistance < this.height / 2) {
//           this.setAnimation("hit");
//           setTimeout(() => this.setAnimation("walk"), 850);
//         }
//       }
//     }
//     this.recieved_attacks = [];
//   }
// }




// import { Actor } from "../Actor.js";
// import { Player } from "../Player/Player.js";
// import * as Util from "../../Utils/Util.js";
// import { Collider } from "../Collider.js";
// import { GAME_ENGINE } from "../../main.js";

// export class EarthGolem extends Actor {
//   constructor(x, y) {
//     super();
//     Object.assign(this, { x, y });

//     // Load Animations
//     this.assetManager = window.ASSET_MANAGER;

//     this.addAnimation(
//       "idle",
//       this.assetManager.getAsset("./assets/enemy/golem/golem_idle.png"), 
//       128, // Frame width
//       90, // Frame height
//       5,   // Number of frames
//       0.4  // Frame duration
//     );

//     this.addAnimation(
//       "walk",
//       this.assetManager.getAsset("./assets/enemy/golem/golem_walk.png"), 
//       384, // Frame width
//       90,  // Frame height
//       8,   // Number of frames
//       0.2  // Frame duration
//     );
    
//     this.addAnimation(
//       "hit",
//       this.assetManager.getAsset("./assets/enemy/golem/golem_hit.png"),
//       384, // Frame width
//       90,  // Frame height
//       17,  // Number of frames
//       0.05 // Frame duration
//     );

//     this.setAnimation("idle"); // Default animation

//     // **Golem Properties**
//     this.scale = 3;
//     this.width = 100;
//     this.height = 200;
//     this.collider = new Collider(this.width, this.height);

//     this.health = 300; // Tanky enemy
//     this.maxHealth = 300;
//     this.attackRadius = 150; // Short melee range
//     this.attackCooldown = 0;
//     this.attackRate = 3; // Attacks every 3 seconds

//     // **Movement**
//     this.walkSpeed = 80; // Slow movement initially
//     this.aggroSpeed = 160; // Speed increases when provoked
//     this.attackSpeed = 0; // Stops moving during attack
//     this.speed = 0; // Start idle
//     this.gravity = 1000;

//     this.visualRadius = 600; // Player detection range
//     this.target = { x: this.x, y: this.y }; // Initially idle
//     this.velocity = { x: 0, y: this.gravity };

//     // **Flags**
//     this.isEnemy = true;
//     this.seesPlayer = false;
//     this.isProvoked = false;
//     this.isAttacking = false;
//   }

//   update() {
//     this.recieveAttacks();
//     this.recieveEffects();
  
//     if (this.health <= 0) {
//       this.removeFromWorld = true;
//       return;
//     }

//     if (this.effects.frozen > 0 || this.effects.stun > 0) return;

//     this.attackCooldown += GAME_ENGINE.clockTick;
//     this.onGround = false;

//     // **Only track player if provoked**
//     if (this.isProvoked) {
//       for (let entity of GAME_ENGINE.entities) {
//         if (entity instanceof Player && Util.canSee(this, entity)) {
//           this.target = { x: entity.x, y: entity.y };
//           this.seesPlayer = true;
//         }
//       }
//     }

//     this.setState();
//     this.movement();

//     this.flip = this.velocity.x < 0 ? 1 : 0;

//     this.updateAnimation(GAME_ENGINE.clockTick);
//   }

//   // **Golem State Behavior**
//   setState() {
//     if (!this.isProvoked) {
//       // **Idle before being hit**
//       this.speed = 0;
//       this.setAnimation("idle");
//     } else {
//       // **Provoked behavior**
//       if (this.seesPlayer && !this.isAttacking) {
//         this.speed = this.aggroSpeed;
//         this.setAnimation("walk");
//       }

//       // **Trigger attack if player is very close**
//       if (this.seesPlayer && Math.abs(this.x - this.target.x) < this.attackRadius / 2) {
//         this.speed = 0;
//         this.isAttacking = true;
//         this.setAnimation("hit");

//         setTimeout(() => {
//           this.stompAttack();
//           this.isAttacking = false;
//           this.setAnimation("walk");
//         }, 850); // Wait for attack animation
//       }
//     }
//   }

//   // **Golem Stomp Attack**
//   stompAttack() {
//     console.log(`Earth Golem Stomps at (${this.x}, ${this.y})!`);

//     for (let entity of GAME_ENGINE.entities) {
//       if (entity instanceof Player && Math.abs(this.x - entity.x) < this.attackRadius) {
//         entity.queueAttack({ damage: 30 }); // Heavy stomp attack
//         console.log("Player hit by Earth Golem Stomp!");
//       }
//     }
//   }

//   // **Movement Handling**
//   movement() {
//     if (!this.isProvoked || this.isAttacking) return; // Do not move when idle or attacking

//     var distance = Util.getDistance(this, this.target);

//     this.velocity = {
//       x: ((this.target.x - this.x) / distance) * this.speed,
//       y: this.gravity,
//     };

//     this.x += this.velocity.x * GAME_ENGINE.clockTick;

//     for (let e of GAME_ENGINE.entities) {
//       if (e.isPlayer || e.isAttack || e.isEnemy || e.isEffect || e.isDestructibleObject || e.isSpike || e.isSpawnPoint) continue;
//       if (e.isWater) {
//         this.inWater = true;
//         continue;
//       }
//       if (this.colliding(e)) {
//         this.moveAgainstX(e);
//       }
//     }
//     this.y += this.velocity.y * GAME_ENGINE.clockTick;
//     for (let e of GAME_ENGINE.entities) {
//       if (e.isPlayer || e.isAttack || e.isEnemy || e.isDestructibleObject || e.isSpike || e.isSpawnPoint) continue;
//       if (e.isWater) {
//         this.inWater = true;
//         continue;
//       }
//       if (this.colliding(e)) {
//         this.moveAgainstY(e);
//       }
//     }
//   }

//   draw(ctx) {
//     if (GAME_ENGINE.debug_colliders) {
//       super.draw(ctx);
//       ctx.strokeStyle = "brown";
//       ctx.beginPath();
//       ctx.arc(
//         this.x - GAME_ENGINE.camera.x,
//         this.y - GAME_ENGINE.camera.y,
//         this.visualRadius,
//         0,
//         Math.PI * 2
//       );
//       ctx.stroke();
//     } else {
//       super.draw(ctx);
//     }
//     this.drawEffects(ctx);
//   }

//   getBoundingBox() {
//     return {
//       x: this.x - this.width * 0.25,
//       y: this.y - this.height * 0.5,
//       width: this.width * 0.5,
//       height: this.height * 0.8,
//     };
//   }

//   // **Receives Attacks, Provokes Golem, and Triggers "Hit" Animation Close to Player**
//   recieveAttacks() {
//     for (let attack of this.recieved_attacks) {
//       this.health -= attack.damage;
//       console.log(`Golem took ${attack.damage} damage! Health: ${this.health}`);

//       if (this.health > 0) {
//         this.isProvoked = true;

//         if (this.seesPlayer && Math.abs(this.x - this.target.x) < this.attackRadius / 2) {
//           this.setAnimation("hit");
//           setTimeout(() => this.setAnimation("walk"), 850);
//         }
//       }
//     }
//     this.recieved_attacks = [];
//   }
// }
