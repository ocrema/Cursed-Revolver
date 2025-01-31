import { Entity } from "./Entities.js";
import { Player } from "./Player.js";
import * as Util from "../Utils/Util.js";
import { Collider } from "./Collider.js";

export class Thorn extends Entity {
    constructor (x, y, target) {
        super();
        Object.assign(this, { x, y, target });
        this.assetManager = window.ASSET_MANAGER;

        this.start = {x: this.x, y: this.y};
        this.width = 16;
        this.height = 16;

        this.isAttack = true;

        

        // distance the thorn has travelled
        this.travelled = 0;
        this.maxRange = 300;
        this.speed = 4;
        this.data = { damage: 20};
        this.removeFromWorld = false;
        //this.colliders = [];
        this.collider = new Collider(this.width, this.height);

        var distance = Util.getDistance(this, target);
        this.velocity = { x:(this.target.x - this.x) / distance * this.speed, 
            y:(this.target.y - this.y) / distance * this.speed };

        this.addAnimation(
            "placeholder",
            this.assetManager.getAsset("./assets/thorn/thorn.png"),
            32, // Frame width
            32, // Frame height
            1, // Frame count
            0.25 // Frame duration (slower for idle)
        );

        this.setAnimation("placeholder");
    }

    update() {
        // if distance is too big --> remove
        if (this.travelled > this.maxRange) {
            this.removeFromWorld = true;
            return;
        }
        // update x/y using velocity
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
        // use x/y to update distance travelled 
        this.travelled = Util.getDistance(this, this.start);

        // check if colliding with player --> if yes, remove, deal damage
        var that = this;
        GAME_ENGINE.entities.forEach(function (entity) { // cycles through every entity 
                    if (entity instanceof Player) {
                        if (that.colliding(entity)) {
                            // thorn hits player
                            that.removeFromWorld = true;
                            entity.queueAttack(that.data);
                        }
                    }
                })
    }
}