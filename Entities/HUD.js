import { Entity } from "../Entities/Entities.js";
import { GAME_ENGINE } from "../main.js"; // Import GAME_ENGINE

export class HUD extends Entity {
  constructor() {
    super();
    this.entityOrder = 9999;
    this.healthBarWidthRatio = 0.2; // 20% of canvas width
    this.healthBarHeightRatio = 0.02; // 2% of canvas height
    this.healthBarMarginRatio = 0.02; // 2% of canvas height as margin
    this.debugMode = false; // Debug mode toggle
    this.spells = ["Fireball", "Lightning Bolt", "Water Wave", "Icicle"]; // Example spells
    this.activeSpellIndex = 0; // Current spell index
  }

  colliding() {
    return false; // HUD does not collide with anything
  }

  update() {
    // Toggle debug mode when "B" key is pressed
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

    // Scale HUD elements dynamically based on canvas size
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    const healthBarWidth = canvasWidth * this.healthBarWidthRatio;
    const healthBarHeight = canvasHeight * this.healthBarHeightRatio;
    const healthBarMargin = canvasHeight * this.healthBarMarginRatio;

    // Coordinates for elements
    const startX = healthBarMargin; // Starting X position
    const startY = healthBarMargin; // Starting Y position

    // Draw health bar
    const player = GAME_ENGINE.entities.find((e) => e.isPlayer);
    const currentHealth = player ? player.health : 0;
    const maxHealth = 200; // Assume 200 as max health for now

    // Health Bar Background
    ctx.fillStyle = "red"; // Background (missing health)
    ctx.fillRect(startX, startY, healthBarWidth, healthBarHeight);

    // Health Bar Foreground
    ctx.fillStyle = "green"; // Foreground (current health)
    ctx.fillRect(
      startX,
      startY,
      (currentHealth / maxHealth) * healthBarWidth,
      healthBarHeight
    );

    // Numeric Health Display
    ctx.fillStyle = "white";
    ctx.font = `${canvasHeight * 0.015}px Arial`; // Scale font based on screen height
    ctx.fillText(
      `${currentHealth} / ${maxHealth}`,
      startX + healthBarWidth / 2 - 25,
      startY + healthBarHeight * 0.75
    );

    // Draw active spell name
    const spellTextX = startX + healthBarWidth + 20; // 20px gap after health bar
    ctx.fillStyle = "white";
    ctx.font = `${canvasHeight * 0.02}px Arial`; // Scale font dynamically
    ctx.fillText(`Spell: ${this.spells[this.activeSpellIndex]}`, spellTextX, startY + healthBarHeight);

    // Debug Information (if debug mode is enabled)
    if (this.debugMode) {
      const debugTextX = startX;
      const debugTextY = startY + healthBarHeight * 2; // Below the health bar
      const lineSpacing = canvasHeight * 0.025; // Dynamic spacing between debug lines

      ctx.fillStyle = "yellow";
      ctx.font = `${canvasHeight * 0.015}px Arial`; // Scale font size

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
