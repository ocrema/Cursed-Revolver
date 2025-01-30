import { Entity } from "../Entities/Entities.js";
import { GAME_ENGINE } from "../main.js"; // Import GAME_ENGINE

export class HUD extends Entity {
  constructor() {
    super();
    this.entityOrder = 9999;
    this.healthBarWidthRatio = 0.3;
    this.healthBarHeightRatio = 0.03;
    this.healthBarMarginRatio = 0.03;
    this.debugMode = false;

    // Spells and cylinder setup
    this.spells = [
      { name: "Fireball", icon: "./assets/ui/spells/fireball.png" },
      // { name: "Lightning Bolt", icon: "./assets/ui/spells/lightning.png" },
      // { name: "Water Wave", icon: "./assets/ui/spells/water.png" },
      // { name: "Icicle", icon: "./assets/ui/spells/icicle.png" },
      // { name: "Wind Slash", icon: "./assets/ui/spells/wind.png" },
      // { name: "Earthquake", icon: "./assets/ui/spells/earthquake.png" }
    ];
    
    this.activeSpellIndex = 0;

    // Cylinder animation setup
    this.cylinderImages = [];
    for (let i = 2; i <= 10; i++) { 
      this.cylinderImages.push(`./assets/ui/revolver/cylinder${i}.png`);
    }

    this.currentCylinderFrame = 0;
    this.spinning = false;
    this.spinSpeed = 0.1;
    this.spinTargetFrame = 0;
  }

  colliding() {
    return false;
  }

  update() {
    // Toggle debug mode
    if (GAME_ENGINE.keys["b"]) {
      this.debugMode = !this.debugMode;
      GAME_ENGINE.debug_colliders = this.debugMode;
      console.log(`Debug Mode: ${this.debugMode ? "ON" : "OFF"}`);
      GAME_ENGINE.keys["b"] = false;
    }

    // Spell selection (1-6 keys)
    for (let i = 1; i <= 1; i++) { //TEMP! change to 6 later
      if (GAME_ENGINE.keys[i.toString()]) {
        this.selectSpell(i - 1);
        GAME_ENGINE.keys[i.toString()] = false;
      }
    }

    if (this.spinning) {
      this.currentCylinderFrame += this.spinSpeed;

      console.log(`Current Cylinder Frame: ${Math.floor(this.currentCylinderFrame)}`);
      
      // Ensure looping animation
      if (this.currentCylinderFrame >= 10) {
        this.currentCylinderFrame = 0;
      }
    
      // Smoothly stop at the target frame
      if (Math.abs(this.currentCylinderFrame - this.spinTargetFrame) < this.spinSpeed) {
        this.currentCylinderFrame = this.spinTargetFrame;
        this.spinning = false; // Stop spinning
      }
    }
    
  }

  selectSpell(index) {
    this.activeSpellIndex = index;
    this.spinTargetFrame = index;
    this.spinning = true;
  }

  draw(ctx) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    const healthBarWidth = canvasWidth * this.healthBarWidthRatio;
    const healthBarHeight = canvasHeight * this.healthBarHeightRatio;
    const healthBarMargin = canvasHeight * this.healthBarMarginRatio;

    // Positioning
    const startX = healthBarMargin;
    const startY = canvasHeight - healthBarHeight - healthBarMargin;
    
    // Scalable Cylinder and Spell Positions
    const scaleFactor = canvasHeight / 800; // Dynamic scaling based on canvas height

    const cylinderSize = 120 * scaleFactor; // Scalable size
    const cylinderX = canvasWidth - cylinderSize - 50 * scaleFactor;
    const cylinderY = canvasHeight - cylinderSize - 50 * scaleFactor;

    // Move spell name and icon lower
    const spellTextX = cylinderX - 200 * scaleFactor;
    const spellTextY = cylinderY + cylinderSize / 1.5;

    // Health Bar
    const player = GAME_ENGINE.entities.find((e) => e.isPlayer);
    const currentHealth = player ? player.health : 0;
    const maxHealth = 200;

    ctx.fillStyle = "red";
    ctx.fillRect(startX, startY, healthBarWidth, healthBarHeight);
    ctx.fillStyle = "green";
    ctx.fillRect(startX, startY, (currentHealth / maxHealth) * healthBarWidth, healthBarHeight);

    // Health Text
    ctx.fillStyle = "white";
    ctx.font = `${canvasHeight * 0.03}px Arial`;
    ctx.fillText(`${currentHealth} / ${maxHealth}`, startX + healthBarWidth / 2 - 25, startY + healthBarHeight * 0.75);

    // Spell Text and Icon (Lowered)
    ctx.fillText(`Spell: ${this.spells[this.activeSpellIndex].name}`, spellTextX, spellTextY);
    
    const spellIcon = ASSET_MANAGER.getAsset(this.spells[this.activeSpellIndex].icon);
    if (spellIcon) {
      const spellIconSize = 60 * scaleFactor; // Scale dynamically
      ctx.drawImage(spellIcon, spellTextX - 80 * scaleFactor, spellTextY - 40 * scaleFactor, spellIconSize, spellIconSize);
    }

    // Cylinder Image (Scaled)
    const cylinderImage = ASSET_MANAGER.getAsset(this.cylinderImages[Math.floor(this.currentCylinderFrame)]);
    
    if (cylinderImage) {
      ctx.drawImage(cylinderImage, cylinderX, cylinderY, cylinderSize, cylinderSize);
    }

    // Debug Mode - Show Info (Top Left)
    if (this.debugMode) {
      ctx.fillStyle = "yellow";
      ctx.font = `${canvasHeight * 0.025}px Arial`;

      const debugTextX = 20;
      const debugTextY = 40;
      const lineSpacing = canvasHeight * 0.03;
      let debugLine = 0;

      ctx.fillText("DEBUG MODE: ON", debugTextX, debugTextY + debugLine++ * lineSpacing);

      if (player) {
        ctx.fillText(
          `Player Position: (${Math.floor(player.x)}, ${Math.floor(player.y)})`,
          debugTextX,
          debugTextY + debugLine++ * lineSpacing
        );
        ctx.fillText(
          `Player Velocity: (${player.x_velocity.toFixed(2)}, ${player.y_velocity.toFixed(2)})`,
          debugTextX,
          debugTextY + debugLine++ * lineSpacing
        );
        ctx.fillText(
          `Active Spell: ${this.spells[this.activeSpellIndex].name}`,
          debugTextX,
          debugTextY + debugLine++ * lineSpacing
        );
        ctx.fillText(
          `Health: ${currentHealth} / ${maxHealth}`,
          debugTextX,
          debugTextY + debugLine++ * lineSpacing
        );
      }
    }

    ctx.restore();
  }
}
