export class Collider {

    constructor(width, height, x_offset = 0, y_offset = 0) {
        this.width = width;
        this.height = height;
        this.x_offset = x_offset;
        this.y_offset = y_offset;
    }

    colliding(x1, y1, other, x2, y2) {
        if (!other) return false;

        const b1left = x1 - this.width/2 - this.x_offset;
        const b1right = x1 + this.width/2 - this.x_offset;
        const b1bottom = y1 + this.height/2 - this.y_offset;
        const b1top = y1 - this.height/2 - this.y_offset;
        const b2left = x2 - other.width/2 - other.x_offset;
        const b2right = x2 + other.width/2 - other.x_offset;
        const b2bottom = y2 + other.height/2 - other.y_offset;
        const b2top = y2 - other.height/2 - other.y_offset;
        
        return b1right > b2left &&
            b1left < b2right &&
            b1top < b2bottom &&
            b1bottom > b2top;
    }
}