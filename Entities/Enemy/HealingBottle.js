import { Actor } from "../Actor.js";
import { Collider } from "../Collider.js";
import { GAME_ENGINE } from "../../main.js";
import { Player } from "../Player/Player.js";

export class HealingBottle extends Actor {
    constructor(x, y, healingAmount = 50) {
        super();
        Object.assign(this, { x, y, healingAmount });

        this.assetManager = window.ASSET_MANAGER;

        this.addAnimation(
        "idle",
        this.assetManager.getAsset("./assets/objects/health_potion.png"),
        32, // Frame width
        32, // Frame height
        1,  // Frame count
        1.0 // Frame duration (static)
        );

        this.setAnimation("idle");

        this.width = 35;
        this.height = 35;
        this.scale = 2;
        this.collider = new Collider(this.width+10, this.height+10);
    }

    update() {
        //console.log(`HealingBottle updating at (${this.x}, ${this.y})`);

        for (let entity of GAME_ENGINE.entities) {
            if (entity instanceof Player) {
                //console.log(`Checking collision with Player at (${entity.x}, ${entity.y})`);

                if (!entity.collider) {
                    //console.error("Player has no collider! Skipping collision check.");
                    continue;
                }

                // Get Player's collider box
                let playerLeft = entity.x - entity.collider.width / 2;
                let playerRight = entity.x + entity.collider.width / 2;
                let playerTop = entity.y - entity.collider.height / 2;
                let playerBottom = entity.y + entity.collider.height / 2;

                // Get Healing Bottle's collider box
                let bottleLeft = this.x - this.collider.width / 2;
                let bottleRight = this.x + this.collider.width / 2;
                let bottleTop = this.y - this.collider.height / 2;
                let bottleBottom = this.y + this.collider.height / 2;

                // Allow slight overlap tolerance (buffer for standing near)
                const proximityBuffer = 10; // Increase if needed

                // Adjust X collision logic to allow standing next to the bottle
                let collideX = playerRight + proximityBuffer > bottleLeft && playerLeft - proximityBuffer < bottleRight;
                let collideY = playerBottom > bottleTop && playerTop < bottleBottom;

                //console.log(`Collision Check: collideX=${collideX}, collideY=${collideY}`);
                //console.log(`Player Bounds: L=${playerLeft}, R=${playerRight}, T=${playerTop}, B=${playerBottom}`);
                //console.log(`Bottle Bounds: L=${bottleLeft}, R=${bottleRight}, T=${bottleTop}, B=${bottleBottom}`);

                if (collideX && collideY) {
                    //console.log("Healing bottle collected! Attempting to heal player...");

                    if (typeof entity.heal === "function") {
                        //console.log("Calling heal() on player...");
                        entity.heal(this.healingAmount);
                        //console.log("Healing successful!");
                    } else {
                        console.error("heal() function is missing on Player!");
                    }

                    this.removeFromWorld = true;
                }
            }
        }
    }

    draw(ctx) {
        super.draw(ctx);
        if (GAME_ENGINE.debug_colliders) {
        ctx.strokeStyle = "green";
        ctx.strokeRect(
            this.x - GAME_ENGINE.camera.x, 
            this.y - GAME_ENGINE.camera.y, 
            this.width, this.height
        );
        }
    }
}
