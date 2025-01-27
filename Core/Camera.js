import { Entity } from "../Entities/Entities.js";

export class Camera extends Entity {
    constructor() {
        super();
        this.entityOrder = 100; // Set the camera to be the lowest entity in the order
        this.x = 0;
        this.y = 0;
        this.player = null;
    }

    update() {
        if (!this.player) {
            for (let e of GAME_ENGINE.entities) {
                if (e.isPlayer) {
                    this.player = e;
                    break;
                }
            }
        }

        if (this.player) {
            this.x = this.player.x;
            this.y = this.player.y;
        }
            
    }
}
