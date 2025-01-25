class Player extends Actor {
    constructor() {
        super();        

        this.width = 50;
        this.height = 50;

        this.radius = 50;

        this.health = 200;

        this.colliders = [];
    }

    update() {
        this.colliders = [];
        this.colliders.push(newCollider(50, 50, 25, 25));
        if (gameEngine.keys['a']) {
            this.x -= 500 * gameEngine.clockTick;
            // console.log("x: " + this.x);
        }
        if (gameEngine.keys['d']) {
            this.x += 500 * gameEngine.clockTick;
            // console.log("x: " + this.x);
        }
        if (gameEngine.keys['w']) {
            this.y -= 500 * gameEngine.clockTick;
            // console.log("y: " + this.y);
        }
        if (gameEngine.keys['s']) {
            this.y += 500 * gameEngine.clockTick;
            // console.log("y: " + this.y);
        }
    }


    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}