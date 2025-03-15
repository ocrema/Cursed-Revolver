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
      1, // Frame count
      1.0 // Frame duration (static)
    );

    this.setAnimation("idle");

    this.width = 70;
    this.height = 70;
    this.scale = 3;

    //  REMOVE COLLIDER COMPLETELY
    this.collider = null;
  }

  update() {
    const player = window.PLAYER;
    if (player) {
      if (player instanceof Player) {
        //  Use distance-based detection for smooth pickup
        const distance = Math.sqrt(
          (this.x - player.x) ** 2 + (this.y - player.y) ** 2
        );

        if (distance < 80) {
          //  Pickup when player is close enough
          //console.log(` Healing Bottle Collected! Player gains +${this.healingAmount} HP`);

          if (typeof player.heal === "function") {
            player.heal(this.healingAmount);
            ASSET_MANAGER.playAsset("./assets/sfx/drink.mp3", 1.0);
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
