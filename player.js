class Player extends Entity {
  constructor() {
    super();
    this.scale = 2;

    // Add animations for the player
    this.addAnimation(
      "idle",
      ASSET_MANAGER.getAsset("./assets/player/Idle.png"),
      231, // Frame width
      190, // Frame height
      6, // Frame count
      0.25 // Frame duration (slower for idle)
    );

    this.addAnimation(
      "run",
      ASSET_MANAGER.getAsset("./assets/player/Run.png"),
      231, // Frame width
      190, // Frame height
      8, // Frame count
      0.1 // Frame duration (faster for running)
    );

    this.speed = 500; // Movement speed
    this.isMoving = false; // Whether the player is moving

    // Start with the idle animation
    this.setAnimation("idle");
  }

  update() {
    this.isMoving = false;

    // Movement logic
    if (gameEngine.keys["a"]) {
      this.x -= this.speed * gameEngine.clockTick;
      this.isMoving = true;
      this.flip = true;
    }
    if (gameEngine.keys["d"]) {
      this.x += this.speed * gameEngine.clockTick;
      this.isMoving = true;
      this.flip = false;
    }
    if (gameEngine.keys["w"]) {
      this.y -= this.speed * gameEngine.clockTick;
      this.isMoving = true;
    }
    if (gameEngine.keys["s"]) {
      this.y += this.speed * gameEngine.clockTick;
      this.isMoving = true;
    }

    // Switch animations based on movement state
    if (this.isMoving) {
      this.setAnimation("run");
    } else {
      this.setAnimation("idle");
    }

    // Update the active animation
    this.updateAnimation(gameEngine.clockTick);
  }
}
