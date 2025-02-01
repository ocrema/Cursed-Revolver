import { Platform } from "./Platform.js";

export class Structure {
  constructor(x, y, scaleX = 1, scaleY = 1) {
    this.x = x; // Structure's base position
    this.y = y;
    this.scaleX = scaleX; // Scale factor in X direction
    this.scaleY = scaleY; // Scale factor in Y direction
    this.platforms = []; // Collection of platforms
  }

  // Adds a platform relative to the structure's position
  addPlatform(offsetX, offsetY, width, height, scale = 1) {
    const platform = new Platform(
      this.x + offsetX * this.scaleX, // Scale X position
      this.y + offsetY * this.scaleY, // Scale Y position
      width * this.scaleX, // Scale width
      height * this.scaleY, // Scale height
      scale * Math.max(this.scaleX, this.scaleY) // Adjust visual scale
    );
    this.platforms.push(platform);
    GAME_ENGINE.addEntity(platform);
  }

  // Move the structure and update all platforms accordingly
  move(dx, dy) {
    this.x += dx;
    this.y += dy;
    for (const platform of this.platforms) {
      platform.x += dx;
      platform.y += dy;
    }
  }

  // Scales the entire structure proportionally
  scale(newScaleX, newScaleY) {
    const scaleFactorX = newScaleX / this.scaleX;
    const scaleFactorY = newScaleY / this.scaleY;

    this.scaleX = newScaleX;
    this.scaleY = newScaleY;

    for (const platform of this.platforms) {
      // Scale position relative to the structure's center
      platform.x = this.x + (platform.x - this.x) * scaleFactorX;
      platform.y = this.y + (platform.y - this.y) * scaleFactorY;

      // Scale the platform size
      platform.width *= scaleFactorX;
      platform.height *= scaleFactorY;

      // Scale the collider to match the new platform size
      if (platform.collider) {
        platform.collider.width =
          platform.width * platform.tileSize * platform.scale;
        platform.collider.height = platform.height * platform.scale;
      }
    }
  }

  // Rotates the structure around its center (90-degree steps)
  rotate() {
    const centerX = this.x;
    const centerY = this.y;

    for (const platform of this.platforms) {
      const relX = platform.x - centerX;
      const relY = platform.y - centerY;
      platform.x = centerX - relY;
      platform.y = centerY + relX;
    }
  }

  // Remove the structure and all its platforms
  remove() {
    for (const platform of this.platforms) {
      platform.removeFromWorld = true;
    }
    this.platforms = [];
  }
}
