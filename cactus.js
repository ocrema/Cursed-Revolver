class Cactus extends Actor {
    constructor() {
        super();        

        this.x = 100;
        this.y = 100;
        this.width = 50;
        this.height = 50;

        this.dead = false;
        this.collided = false;
        this.health = 50;

        this.visualRadius = 100; // pixels away from body
        this.colliders = [];
    }

    update() {
        this.colliders = [];
        this.colliders.push(newCollider(50, 50, 25, 25));
        var that = this;
        gameEngine.entities.forEach(function (entity) { // cycles through every entity 
            if (entity instanceof Player) {
                if (entity.colliders && that.colliding(entity)) {
                    console.log("collide");
                } 
                if (canSee(that, entity)) {
                    console.log("seen");
                }
            }
        })
    }

    draw(ctx) {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x , this.y, this.width, this.height);

        let centerX = this.x + (this.width / 2);
        let centerY = this.y + (this.height / 2);
        ctx.strokeStyle = "red";

        // rectangle with sprite in center
        ctx.strokeRect(centerX - ((this.width / 2) + this.visualRadius), centerY - ((this.height / 2) + this.visualRadius), this.width + (this.visualRadius * 2), this.height + (this.visualRadius * 2));
        
        // circle with sprite in center, radius is range / 2 + max out of width/height
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.visualRadius + Math.max(this.width, this.height), 0, 2 * Math.PI);
        ctx.stroke();
    }

    takeDamage() {

    }

    shootThorn(target) {
        
    }
}