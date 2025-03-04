import { Actor } from "../Actor.js";
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

        //  REMOVE COLLIDER COMPLETELY
        this.collider = null;  
    }

    update() {
        for (let entity of GAME_ENGINE.entities) {
            if (entity instanceof Player) {
                if (!entity.collider) continue; // Ensure player has a collider

                //  Use distance-based detection for smooth pickup
                const distance = Math.sqrt((this.x - entity.x) ** 2 + (this.y - entity.y) ** 2);

                if (distance < 50) {  //  Pickup when player is close enough
                    //console.log(` Healing Bottle Collected! Player gains +${this.healingAmount} HP`);

                    if (typeof entity.heal === "function") {
                        entity.heal(this.healingAmount);
                    } else {
                        //console.error("heal() function missing on Player!");
                    }

                    this.removeFromWorld = true; //  Potion disappears after pickup
                }
            }
        }
    }

    draw(ctx) {
        super.draw(ctx);
    }
}

