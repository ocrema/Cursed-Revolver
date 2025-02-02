import { Actor, Platform } from "./Entities.js";
import { Player } from "./Player.js";
import { Thorn, Jaw } from "./Attack.js";
import * as Util from "../Utils/Util.js";
import { Collider } from "./Collider.js";

export class Cactus extends Actor {
    constructor(x, y) {
        super();
        Object.assign(this, { x, y });
        this.assetManager = window.ASSET_MANAGER;

        this.addAnimation(
            "placeholder",
            this.assetManager.getAsset("./assets/cactus/cactus.png"),
            320, // Frame width
            320, // Frame height
            1, // Frame count
            0.25 // Frame duration (slower for idle)
        );

        this.setAnimation("placeholder");

        this.width = 160;
        this.height = 250;
        this.collider = new Collider(this.width, this.height);        

        this.dead = false;
        this.health = 50;
        this.visualRadius = 200; // pixels away from center
        this.fireRate = 1; // max time before attack
        this.elapsedTime = 0; // time since attack
    }

    update() {
        this.elapsedTime += GAME_ENGINE.clockTick;

        for (let entity of GAME_ENGINE.entities) {
            if (entity instanceof Player) {
                // cactus sees player
                if (Util.canSee(this, entity) && this.elapsedTime > this.fireRate) {
                    // this.setAnimation("attack");
                    this.elapsedTime = 0;
                    GAME_ENGINE.addEntity(new Thorn(this.x, this.y, entity)); 
                }
            }
        }
    }

}

export class Spider extends Actor {
    constructor(x, y) {
        super();
        Object.assign(this, { x, y });
        this.assetManager = window.ASSET_MANAGER;

        this.addAnimation(
            "walk",
            this.assetManager.getAsset("./assets/spider/Walk.png"),
            320, // Frame width
            320, // Frame height
            5, // Frame count
            0.25 // Frame duration (slower for idle)
        );

        this.setAnimation("walk");

        this.health = 100;
        this.width = 240;
        this.height = 120;

        this.collider = new Collider(this.width, this.height);
        this.proximity = 2; // proximity to wall before climbing or to target before changing locations

        this.speed = 250;
        this.climbSpeed = 3;
        this.target = {x: this.x + 200, y: this.y}; // target location of spider

        var distance = Util.getDistance(this, this.target);
        this.velocity = { x:(this.target.x - this.x) / distance * this.speed, 
            y:(this.target.y - this.y) / distance * this.speed };

        this.attackCooldown = 0;
        this.attackRate = 4;
        this.onGround = false;
        this.onWall = false;
        this.visualRadius = 300;
        this.gravity = 800;
        this.isEnemy = true;
    }

    update() {
        this.attackCooldown += GAME_ENGINE.clockTick;
        this.onGround = false;
        this.onWall = false;

        // update target
        for (let entity of GAME_ENGINE.entities) {
            if (entity instanceof Player) {
                this.target = {x: entity.x, y: entity.y};
            }
        }

        // update velocity
        var distance = Util.getDistance(this, this.target);
        this.velocity = { x: (this.target.x - this.x) / distance * this.speed, 
            y: 0};      

        // apply changes to velocity
        for (let entity of GAME_ENGINE.entities) {
            if (entity instanceof Platform && entity.collider && this.colliding(entity)) {

                let thisTop = this.y - (this.height / 2);
                let thisBottom = this.y + (this.height / 2);
                let thisLeft = this.x - (this.width / 2);
                let thisRight = this.x + (this.width / 2);

                let eTop = entity.y - (entity.height / 2);
                let eBottom = entity.y + (entity.height / 2);
                let eLeft = entity.x - (entity.width / 2);
                let eRight = entity.x + (entity.width / 2);

                let collideRight = thisRight > eLeft && thisLeft < eLeft; // platform is on right of spider
                let collideLeft = thisLeft < eRight && thisRight > eRight; // platform is on the left of spider               
                
                let collideBottom = thisBottom > eTop && thisTop < eTop && thisRight > eLeft && thisLeft < eRight; // true if top of spider and platform match
                let collideTop = thisTop > eBottom && thisBottom < eBottom && thisRight > eLeft && thisLeft < eRight;

                if (collideBottom) {
                    this.y = entity.y - (entity.height / 2) - (this.height / 2);
                }

                if ((collideRight && this.velocity.x > 0) || // if colliding wall on right and moving right
                    (collideLeft && this.velocity.x < 0)) { // if colliding wall on left and moving left
                        this.velocity.x -= (this.target.x - this.x) / distance * this.speed;
                        this.target.y = eTop - this.height;
                        this.onWall = true;
                }

                if (Math.abs(this.y - (entity.y - (entity.height / 2) - (this.height / 2))) < 2) {
                    this.onGround = true;
                }
            }
        }

        // if spider is floating and moving
        if (!this.onGround && this.velocity.x !== 0) {
            this.velocity.y += this.gravity;
        }

        // if spider is currently on a wall
        if (this.onWall) {
            // climb up wall
            this.velocity.y = (this.target.y - this.y) / distance * this.speed * this.climbSpeed;
        }

        // if spider is on the ground and trying to move down
        if (this.onGround) {
                this.velocity.y = 0;
        } 

        // console.log(this.velocity);

        // update location
        this.x += this.velocity.x * GAME_ENGINE.clockTick;
        this.y += this.velocity.y * GAME_ENGINE.clockTick; 
        
        // check for attack
        if (this.attackCooldown > this.attackRate) {
            this.attackCooldown = 0;
            GAME_ENGINE.addEntity(new Jaw(this));
        }
    }

//     update() {
//         this.attackCooldown += GAME_ENGINE.clockTick;
//         this.onGround = false;

//         // cycle through attacks        
//         this.recieved_attacks.forEach(attack => {
//             // take damage / take effects
//             console.log("ouch! spider took damage: " + attack.damage);
//             this.health -= attack.damage;
//         });
//         // clear attacks queued
//         this.recieved_attacks = [];


//         // update velocity
//         var distance = Util.getDistance(this, this.target);
//         this.velocity = { x:(this.target.x - this.x) / distance * this.speed, 
//             y: 0};
// console.log(this.velocity.x);

//         for (let entity of GAME_ENGINE.entities) {
//             if (entity.collider && this.colliding(entity)) {
//                 if (entity instanceof Platform) { 
//                     this.onGround = true;
//                     // this.velocity.x = 0;
//                 if (((this.x + (this.width / 2) - entity.x - (entity.width / 2) > this.proximity) || // collide from right
//                     (entity.x + (entity.width / 2) - (this.x - (this.width / 2))) > this.proximity) && // collide from left
//                     (this.y + (this.height / 2)) > (entity.y - (entity.height / 2))) { // not collide from top 
//                         this.velocity.y = -100; // climb wall
//                 }
//             }
//             if (entity instanceof Player) {
//                 console.log("collide");
//             }
//         }

//             if (entity instanceof Player) {
//                 if (Util.canSee(this, entity) && this.attackCooldown >= this.attackRate) {
//                     // this.setAnimation("attack");
//                     this.attackCooldown = 0;
//                     this.target.x = entity.x;
//                     this.target.y = entity.y;
//                 }   
//             }
//         };

//         // apply gravity if spider is not on ground
//             if (!this.onGround) {
//                 this.velocity.y += 3;
//             }
        
//         // update facing
// // if (this.velocity.x < 0) {
// //     this.facing = "left";
// // } else {
// //     this.facing = "right";
// // };

// // // if spider is at target, change target
// // if ((Math.abs(this.x - this.target.x)) < this.proximity) {
// //     switch (this.facing) {
// //         case ("none"): this.target.x += 100;
// //         case ("left"): this.target.x -= 100;
// //         case ("right"): this.target.x += 100;
// //     }
// //     console.log(this.velocity.x + " " + this.target.x + " " + this.facing);
// // }

//         this.x += this.velocity.x * GAME_ENGINE.clockTick;
//         // console.log(this.velocity.y * GAME_ENGINE.clockTick);
//         this.y += this.velocity.y * GAME_ENGINE.clockTick;

//         // for each entity
//         // if entity is player

//         // if spider can see and attack cooldown is off

//         // store players current location
//         // spawn in "attack projectile" --> jaw
//         // set animation to attack

//             // if wall is in the way
//             // climb wall

//             // elif no wall in the way
//             // walk towards the player

//         // elif spider can see and attack cooldown is on
//             // change state to sprint
//             // update target to opposite direction

//         // elif spider is in attack anim 
//             // if attack cooldown is off
//                 // if spider is behind wall
//                 // crawl up wall
//                 // elif spider is not behind wall
//                 // walk towards player last local
        
        
        
//         // if time since last state change > 3
//         // swap to random state --> walk, stand still, sprint
//     }
}
