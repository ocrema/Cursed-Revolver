import { Actor } from "./Entities.js";
import { Player } from "./Player.js";
import { Thorn } from "./Attack.js";
import * as Util from "../Utils/Util.js";
import { Collider } from "./Collider.js";

export class Cactus extends Actor {
    constructor() {
        super();
        
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
        this.x = 500 + this.width / 2;
        this.y = 0 + this.height / 2;

        this.dead = false;
        this.health = 50;
        this.visualRadius = 200; // pixels away from center
        this.fireRate = 1; // max time before attack
        this.elapsedTime = 0; // time since attack
        //this.colliders = [];
        this.collider = new Collider(this.width, this.height);

        // taken from player class
        this.cameraSpeed = 500;
    }

    update() {
        this.elapsedTime += GAME_ENGINE.clockTick;
        //this.colliders = [];
        //this.colliders.push(Util.newCollider(this.width, this.height, 0, 0));

        var that = this;

        GAME_ENGINE.entities.forEach(function (entity) { // cycles through every entity 
            if (entity instanceof Player) {
                if (that.colliding(entity)) {
                    // player interacts with cactus
                    console.log("collide");
                } 

                // cactus sees player
                if (Util.getDistance(that, entity) < that.visualRadius && that.elapsedTime > that.fireRate) {
                    // this.setAnimation("attack");
                    that.elapsedTime = 0;
                    GAME_ENGINE.addEntity(new Thorn(that.x, that.y, entity)); 
                }
            }
        })
    }

}
