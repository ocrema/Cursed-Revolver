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

        this.dead = false;
        this.health = 50;
        this.visualRadius = 200; // pixels away from center
        this.fireRate = 1; // max time before attack
        this.elapsedTime = 0; // time since attack
        this.collider = new Collider(this.width, this.height);

        // taken from player class
        this.cameraSpeed = 500;
    }

    update() {
        this.elapsedTime += GAME_ENGINE.clockTick;
        this.collider = new Collider(this.width, this.height);

        var that = this;
        for (let entity of GAME_ENGINE.entities) {
            if (entity instanceof Player && entity.collider && this.colliding(entity)) {
                console.log("cactus collide");
            }
        }

        GAME_ENGINE.entities.forEach(function (entity) { // cycles through every entity 
            if (entity instanceof Player) {
                if (entity.collider && that.colliding(entity)) {
                    // player interacts with cactus
                    console.log("Player touched cactus");
                } 
                // cactus sees player
                if (Util.canSee(that, entity) && that.elapsedTime > that.fireRate) {
                    // this.setAnimation("attack");
                    that.elapsedTime = 0;
                    GAME_ENGINE.addEntity(new Thorn(that.x, that.y, entity)); 
                }
            }
        });
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
        this.width = 250;
        this.height = 120;

        this.collider = new Collider(this.width, this.height);
        this.proximity = 2; // proximity to wall before climbing or to target before changing locations

        this.speed = 100;
        this.target = {x: this.x + 200, y: this.y}; // target location of spider

        var distance = Util.getDistance(this, this.target);
        this.velocity = { x:(this.target.x - this.x) / distance * this.speed, 
            y:(this.target.y - this.y) / distance * this.speed };

        this.attackCooldown = 0;
        this.attackRate = 2;
        this.facing = "left";
        this.onGround = false;
        this.visualRadius = 300;
    }

    update() {
        this.attackCooldown += GAME_ENGINE.clockTick;
        this.onGround = false;

        // cycle through attacks        
        this.recieved_attacks.forEach(attack => {
            // take damage / take effects
            console.log("ouch! spider took damage: " + attack.damage);
            this.health -= attack.damage;
        });
        // clear attacks queued
        this.recieved_attacks = [];


        // update velocity
        var distance = Util.getDistance(this, this.target);
        this.velocity = { x:(this.target.x - this.x) / distance * this.speed, 
            y: 0};
console.log(this.velocity.x);

        for (let entity of GAME_ENGINE.entities) {
            if (entity.collider && this.colliding(entity)) {
                if (entity instanceof Platform) { 
                    this.onGround = true;
                    // this.velocity.x = 0;
                if (((this.x + (this.width / 2) - entity.x - (entity.width / 2) > this.proximity) || // collide from right
                    (entity.x + (entity.width / 2) - (this.x - (this.width / 2))) > this.proximity) && // collide from left
                    (this.y + (this.height / 2)) > (entity.y - (entity.height / 2))) { // not collide from top 
                        this.velocity.y = -100; // climb wall
                }
            }
            if (entity instanceof Player) {
                console.log("collide");
            }
        }

            if (entity instanceof Player) {
                if (Util.canSee(this, entity) && this.attackCooldown >= this.attackRate) {
                    // this.setAnimation("attack");
                    this.attackCooldown = 0;
                    this.target.x = entity.x;
                    this.target.y = entity.y;
                }   
            }
        };

        // apply gravity if spider is not on ground
            if (!this.onGround) {
                this.velocity.y += 3;
            }
        
        // update facing
// if (this.velocity.x < 0) {
//     this.facing = "left";
// } else {
//     this.facing = "right";
// };

// // if spider is at target, change target
// if ((Math.abs(this.x - this.target.x)) < this.proximity) {
//     switch (this.facing) {
//         case ("none"): this.target.x += 100;
//         case ("left"): this.target.x -= 100;
//         case ("right"): this.target.x += 100;
//     }
//     console.log(this.velocity.x + " " + this.target.x + " " + this.facing);
// }

        this.x += this.velocity.x * GAME_ENGINE.clockTick;
        // console.log(this.velocity.y * GAME_ENGINE.clockTick);
        this.y += this.velocity.y * GAME_ENGINE.clockTick;

        // for each entity
        // if entity is player

        // if spider can see and attack cooldown is off

        // store players current location
        // spawn in "attack projectile" --> jaw
        // set animation to attack

            // if wall is in the way
            // climb wall

            // elif no wall in the way
            // walk towards the player

        // elif spider can see and attack cooldown is on
            // change state to sprint
            // update target to opposite direction

        // elif spider is in attack anim 
            // if attack cooldown is off
                // if spider is behind wall
                // crawl up wall
                // elif spider is not behind wall
                // walk towards player last local
        
        
        
        // if time since last state change > 3
        // swap to random state --> walk, stand still, sprint
    }
}
