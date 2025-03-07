import { Entity } from "../Entities/Entities.js";

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

    // Define camera boundaries based on the map size and screen size
    this.minX = 0;
    this.maxX = 100000;
    this.minY = 0;
    this.maxY = mapHeight - screenHeight;
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

    if (this.shakeIntensity > 0) {
      this.x += (Math.random() - 0.5) * this.shakeIntensity;
      this.y += (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeIntensity *= this.shakeDecay; // Reduce shake over time
    }

    if (this.player) {
      const followSpeed = 5; // Lower values = slower camera movement
      const lerpFactor = Math.min(followSpeed * GAME_ENGINE.clockTick, 1);

      const verticalOffset = -150; // Move the camera 150 pixels upwards

      // Smoothly interpolate the camera towards the player's position + vertical offset
      this.x += (this.player.x - this.x) * lerpFactor;
      this.y += (this.player.y + verticalOffset - this.y) * lerpFactor;

      // Clamp the camera within the map boundaries

      console.log(this.x);
      this.x = Math.max(1000, Math.min(this.x, this.maxX));
    }
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
