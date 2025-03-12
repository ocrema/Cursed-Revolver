import { Collider } from "../../Collider.js";
import { Tile } from "./Tile.js";

export class SignTile extends Tile {
  constructor(
    x,
    y,
    tileID,
    tilesetImage,
    tileSize,
    tilesPerRow,
    firstGID,
    solidTiles,
    scale = 1
  ) {
    super(
      x,
      y,
      tileID,
      tilesetImage,
      tileSize,
      tilesPerRow,
      firstGID,
      solidTiles,
      scale
    );
    this.entityOrder = -8;
    this.scale = 5;
    this.showText = false;
    this.textAlpha = 0; // For fade-in effect
    this.player = null;
    this.customFont = ASSET_MANAGER.getAsset("./assets/fonts/texas.ttf");

    this.collider = new Collider(
      this.tileSize * this.scale * 4,
      this.tileSize * this.scale * 3
    );
  }

  update() {
    this.player = window.PLAYER;

    if (this.player) {
      if (this.colliding(this.player)) {
        this.showText = true;
        if (this.textAlpha < 1) this.textAlpha += 0.05; // Fade in
      } else {
        if (this.textAlpha > 0) this.textAlpha -= 0.05; // Fade out
        if (this.textAlpha <= 0) this.showText = false;
      }
    }
  }

  draw(ctx) {
    if (!this.tilesetImage || this.tileID < this.firstGID) return;

    let tileIndex = this.tileID - this.firstGID;
    let tilesetX = (tileIndex % this.tilesPerRow) * this.tileSize;
    let tilesetY = Math.floor(tileIndex / this.tilesPerRow) * this.tileSize;

    // Draw the sign tile
    ctx.drawImage(
      this.tilesetImage,
      tilesetX,
      tilesetY,
      63,
      63, // Full tile size
      this.x - GAME_ENGINE.camera.x - 30 * this.scale,
      this.y - GAME_ENGINE.camera.y - 44 * this.scale,
      63 * this.scale,
      63 * this.scale // Apply scaling
    );

    if (this.showText) this.drawText(ctx, "I think he went this way...");
  }

  drawText(ctx, message, player) {
    if (this.textAlpha <= 0) return; // Don't render if fully invisible

    // Set font
    ctx.font = `bold 40px "texas"`; // Keep the text large
    ctx.fillStyle = `rgba(255, 255, 255, ${this.textAlpha})`;
    ctx.strokeStyle = `rgba(0, 0, 0, ${this.textAlpha})`;
    ctx.lineWidth = 4;

    // Get player's center position
    let playerCenterX =
      this.player.x - GAME_ENGINE.camera.x + this.player.collider.width / 2;
    let textY = this.player.y - GAME_ENGINE.camera.y - 80; // Position above player's head

    // Background box dimensions
    let padding = 15;
    let textWidth = ctx.measureText(message).width + padding * 2;
    let textHeight = 50;

    // Center the text over the player's head
    let textX = playerCenterX - textWidth / 2;

    // Draw background box with slight transparency
    ctx.fillStyle = `rgba(0, 0, 0, ${this.textAlpha * 0.2})`; // Less dark background
    ctx.fillRect(textX - padding, textY - textHeight, textWidth, textHeight);

    // Draw text outline for readability
    ctx.fillStyle = `rgba(255, 255, 255, ${this.textAlpha})`;
    ctx.strokeText(message, textX, textY);
    ctx.fillText(message, textX, textY);
  }
}
