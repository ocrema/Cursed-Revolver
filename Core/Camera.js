import { Entity } from "../Entities/Entities.js";
import { Player } from "../Entities/Player/Player.js";

export class Camera extends Entity {
  static instance = null;
  constructor(mapWidth, mapHeight, screenWidth, screenHeight) {
    if (Camera.instance) {
      return Camera.instance;
    }
    super();
    Camera.instance = this;

    this.entityOrder = 100; // Set the camera to be the lowest entity in the order
    this.x = 0;
    this.y = 0;
    this.player = null;
    this.shakeIntensity = 0;
    this.shakeDecay = 0.9; // How fast the shake fades (0.9 = fast, 0.99 = slow)
    this.darknessLevel = 0;
    // Define camera boundaries based on the map size and screen size
    this.minX = 0;
    this.maxX = 100000;
    this.minY = 0;
    this.maxY = mapHeight - screenHeight;
    this.bossCoor = { x: 31300, y: 2500 };
  }

  update() {
    const player = window.PLAYER;
    if (player) {
      if (player instanceof Player) {
        if (Math.abs(player.x - this.bossCoor.x) > 1300 || Math.abs(player.y - this.bossCoor.y) > 650) 
          this.coor = player;
        else 
          this.coor = this.bossCoor;
      }
    }


    if (this.shakeIntensity > 0) {
      this.x += (Math.random() - 0.5) * this.shakeIntensity;
      this.y += (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeIntensity *= this.shakeDecay; // Reduce shake over time
    }

    if (this.coor) {
      const followSpeed = 5; // Lower values = slower camera movement
      const lerpFactor = Math.min(followSpeed * GAME_ENGINE.clockTick, 1);

      const verticalOffset = 0; // Move the camera 150 pixels upwards

      // Smoothly interpolate the camera towards the player's position + vertical offset
      if (
        Math.abs(this.coor.x - this.x) > 1 ||
        Math.abs(this.coor.y + verticalOffset - this.y) > 1
      ) {
        this.x += (this.coor.x - this.x) * lerpFactor;
        this.y += (this.coor.y + verticalOffset - this.y) * lerpFactor;
      }

      // Clamp the camera within the map boundaries
      this.x = Math.max(1300, Math.min(this.x, this.maxX));
    }
  }

  draw(ctx) {
    if (this.darknessLevel > 0) {
      ctx.save(); // Save the current drawing state
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any transformations (removes camera offset)

      ctx.fillStyle = `rgba(0, 0, 0, ${this.darknessLevel})`; // Black overlay with transparency
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.restore(); // Restore the original transformation matrix
    }
  }

  setDarkness(level) {
    this.darknessLevel = Math.max(0, Math.min(level, 1)); // Clamp between 0 and 1
  }

  static getInstance(
    mapWidth = 5000,
    mapHeight = 1500,
    screenWidth = 0,
    screenHeight = 0
  ) {
    if (!Camera.instance) {
      Camera.instance = new Camera(
        mapWidth,
        mapHeight,
        screenWidth,
        screenHeight
      );
    }
    return Camera.instance;
  }

  triggerShake(intensity) {
    this.shakeIntensity = intensity;
  }
}
