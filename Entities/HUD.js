import { Entity } from "../Entities/Entities.js";
import { GAME_ENGINE } from "../main.js"; // Import GAME_ENGINE

export class HUD extends Entity {
  constructor() {
    super();
    this.entityOrder = 9999;
    this.healthBarWidth = 200; // Width of the health bar
    this.healthBarHeight = 20; // Height of the health bar
    this.healthBarMargin = 20; // Margin from the top-left corner
    this.debugMode = false; // Debug mode toggle
    this.spells = ["Fireball", "Lightning Bolt", "Water Wave", "Icicle"]; // Example spells
    this.activeSpellIndex = 0; // Current spell index
  }

  colliding() {
    return false; // HUD does not collide with anything
  }

  update() {
    // Toggle debug mode when "D" key is pressed
    if (GAME_ENGINE.keys["b"]) {
      this.debugMode = !this.debugMode;
      GAME_ENGINE.keys["b"] = false; // Prevent continuous toggling
    }

    // Update active spell index if needed (scroll wheel simulation)
    if (GAME_ENGINE.keys["mwheelup"]) {
      this.activeSpellIndex = (this.activeSpellIndex + 1) % this.spells.length;
      GAME_ENGINE.keys["mwheelup"] = false;
    }
    if (GAME_ENGINE.keys["mwheeldown"]) {
      this.activeSpellIndex =
        (this.activeSpellIndex - 1 + this.spells.length) % this.spells.length;
      GAME_ENGINE.keys["mwheeldown"] = false;
    }
  }

  draw(ctx) {
    // Save the current transformation state
    ctx.save();

    // Reset any camera transformations (make HUD fixed to screen)
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // Coordinates for elements
    const startX = this.healthBarMargin; // Starting X position
    const startY = this.healthBarMargin; // Starting Y position

    // Draw health bar
    const player = GAME_ENGINE.entities.find((e) => e.isPlayer);
    const currentHealth = player ? player.health : 0;
    const maxHealth = 200; // Assume 200 as max health for now

    // Health Bar Background
    ctx.fillStyle = "red"; // Background (missing health)
    ctx.fillRect(startX, startY, this.healthBarWidth, this.healthBarHeight);

    // Health Bar Foreground
    ctx.fillStyle = "green"; // Foreground (current health)
    ctx.fillRect(
      startX,
      startY,
      (currentHealth / maxHealth) * this.healthBarWidth,
      this.healthBarHeight
    );

    // Numeric Health Display
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText(
      `${currentHealth} / ${maxHealth}`,
      startX + this.healthBarWidth / 2 - 25,
      startY + 15
    );

    // Draw active spell name
    const spellTextX = startX + this.healthBarWidth + 20; // 20px gap after health bar
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Spell: ${this.spells[this.activeSpellIndex]}`, spellTextX, startY + 15);

    // Debug Information (if debug mode is enabled)
    if (this.debugMode) {
      const debugTextX = startX;
      const debugTextY = startY + 40; // Below the health bar
      const lineSpacing = 20; // Spacing between debug lines

      ctx.fillStyle = "yellow";
      ctx.font = "14px Arial";

      let debugLine = 0;

      // Example debug info
      ctx.fillText("Debug Mode: ON", debugTextX, debugTextY + debugLine++ * lineSpacing);
      ctx.fillText(
        `Player Position: (${Math.floor(player.x)}, ${Math.floor(player.y)})`,
        debugTextX,
        debugTextY + debugLine++ * lineSpacing
      );
      ctx.fillText(
        `Player Velocity: (${player.x_velocity.toFixed(2)}, ${player.y_velocity.toFixed(
          2
        )})`,
        debugTextX,
        debugTextY + debugLine++ * lineSpacing
      );
      ctx.fillText(
        `Active Spell: ${this.spells[this.activeSpellIndex]}`,
        debugTextX,
        debugTextY + debugLine++ * lineSpacing
      );
      ctx.fillText(
        `Health: ${currentHealth} / ${maxHealth}`,
        debugTextX,
        debugTextY + debugLine++ * lineSpacing
      );
    }

    // Restore the previous transformation state
    ctx.restore();
  }
}
