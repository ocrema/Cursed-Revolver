import { Entity } from "../Entities/Entities.js";

export class Camera extends Entity {
    constructor() {
        super();
        this.entityOrder = -1; // Set the camera to be the lowest entity in the order
        this.x = 0;
        this.y = 0;
    }
}
