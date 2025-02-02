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

        this.maxHealth = 50;  // added for health bar logic

        // taken from player class
        this.cameraSpeed = 500;
        this.isEnemy = true;
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
        });

        super.update();
    }

    draw(ctx) {
        super.draw(ctx); 
        this.drawHealthBar(ctx); 
    }

    drawHealthBar(ctx) {
        if (this.health <= 0) return; 
    
        const healthBarWidth = 200; // Doubled in size
        const healthBarHeight = 20; // Doubled in size
        const barOffsetY = this.height / 2 + 40; // Adjusted for new size
    
        // Convert world position to screen position
        const screenX = this.x - GAME_ENGINE.camera.x;
        const screenY = this.y - GAME_ENGINE.camera.y - barOffsetY;
    
        const healthRatio = Math.max(0, this.health / this.maxHealth);
    
        ctx.save();
    
        // Draw background bar (rounded edges)
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.roundRect(screenX - healthBarWidth / 2, screenY, healthBarWidth, healthBarHeight, 8);
        ctx.fill();
    
        // Draw solid health bar (Red when low, Orange when mid, Green when high)
        ctx.fillStyle = healthRatio > 0.6 ? "green" : healthRatio > 0.3 ? "orange" : "red";
        ctx.beginPath();
        ctx.roundRect(screenX - healthBarWidth / 2, screenY, healthBarWidth * healthRatio, healthBarHeight, 8);
        ctx.fill();
    
        // Draw health text (centered on bar)
        ctx.fillStyle = "white";
        ctx.font = `${healthBarHeight * 0.8}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText(`${Math.round(this.health)} / ${this.maxHealth}`, screenX, screenY + healthBarHeight - 4);
    
        ctx.restore();
    }
    
}

