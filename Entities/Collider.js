export class Collider {

    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    colliding(x1, y1, other, x2, y2) {
        if (!other) return false;

        const b1left = x1 - this.width/2;
        const b1right = x1 + this.width/2;
        const b1bottom = y1 + this.height/2;
        const b1top = y1 - this.height/2;
        const b2left = x2 - other.width/2;
        const b2right = x2 + other.width/2;
        const b2bottom = y2 + other.height/2;
        const b2top = y2 - other.height/2;
        
        return b1right > b2left &&
            b1left < b2right &&
            b1top < b2bottom &&
            b1bottom > b2top;
    }
}