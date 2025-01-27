import { Actor } from "./Entities.js";
import { Player } from "./Player.js";
import { Thorn } from "./Attack.js";
import * as Util from "../Utils/Util.js";

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
        this.thorn = new Thorn(this.x, this.y, this.x, this.y, false);
        this.visualRadius = 200; // pixels away from body
        this.colliders = [];

        // taken from player class
        this.cameraSpeed = 500;
    }

    update() {
        this.colliders = [];
        this.colliders.push(Util.newCollider(this.width, this.height, 0, -50));

        var that = this;

        GAME_ENGINE.entities.forEach(function (entity) { // cycles through every entity 
            if (entity instanceof Player) {
                if (entity.colliders && that.colliding(entity)) {
                    // player interacts with cactus
                    console.log("collide");
                } 

                // cactus sees player
                if (Util.canSee(that, entity)) {
                    // if thorn not deployed
                    if (!that.thorn.deployed) {
                        // shoot thorn and give target info
                        that.thorn.deployed = true;
                        that.thorn.targetX = entity.x;
                        that.thorn.targetY = entity.y;
                    }

                    // this.setAnimation("attack");
                    
                }
            }
        })

        if (this.thorn.deployed) {
            this.thorn.update();
        }
    }

}