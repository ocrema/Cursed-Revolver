import { Entity } from "./Entities.js";

export class Thorn extends Entity {
    constructor (targetX, targetY, startX, startY, deployed) {
        super();
        Object.assign(this, { targetX, targetY, startX, startY, deployed });

        // distance the thorn has travelled
        this.distance = 0;
        this.damage = 10;
        this.colliders = [];
    }

    update() {
        // if distance is too big --> dont deploy, remove collider box
        // update x/y using velocity
        // use x/y to update distance travelled 
        // update collider box to follow
        // check if colliding with player --> if yes, undeploy, remove collider box, deal damage
        
        console.log("pew");
    }
}