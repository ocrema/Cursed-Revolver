import { Entity } from "../Entities/Entities.js";
import { GAME_ENGINE } from "../main.js";

export class HUD extends Entity {
  constructor() {
    super();
    this.entityOrder = 9999;
    this.healthBarWidthRatio = 0.3;
    this.healthBarHeightRatio = 0.03;
    this.healthBarMarginRatio = 0.03;
    this.enemyHealthBarWidthRatio = 0.1; // smaller than player's
    this.enemyHealthBarHeightRatio = 0.02; // scaled height
    this.debugMode = false;
    this.cowboyImage = "./assets/ui/cowboy.png";  // Cowboy Image
    
    // Spells and cylinder setup
    this.spells = [
      { name: "Fireball", icon: "./assets/ui/spells/fireball.gif" },
      { name: "Lightning", icon: "./assets/ui/spells/lightning.gif" },
      { name: "Water Wave", icon: "./assets/ui/spells/water.gif" },
      { name: "Icicle", icon: "./assets/ui/spells/icicle.gif" },
      { name: "Vine Ball", icon: "./assets/ui/spells/vine.gif" },
      { name: "Void Orb", icon: "./assets/ui/spells/void.gif" }
    ];
    
    this.activeSpellIndex = 0;

    // Cylinder animation setup
    this.cylinderImages = [];
    for (let i = 1; i <= 10; i++) { 
      this.cylinderImages.push(`./assets/ui/revolver/cylinder${i}.png`);
    }

    this.cylinderRotation = 0; // Current rotation (in radians)
    this.targetRotation = 0; // Target rotation (in radians)
    this.rotationSpeed = 0; // Speed of rotation (radians per frame)
    this.rotationTime = 0; // Time remaining for rotation
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
    for (let i = 1; i <= 6; i++) {
      if (GAME_ENGINE.keys[i.toString()]) {
        this.rotateCylinder(i - 1, 0.5); // Smoothly switch spells in 0.5s
        GAME_ENGINE.keys[i.toString()] = false;
      }
    }

      // Smooth rotation logic
    if (this.rotationTime > 0) {
      this.cylinderRotation += this.rotationSpeed;
      this.rotationTime -= GAME_ENGINE.clockTick;

      if (this.rotationTime <= 0) {
        this.cylinderRotation = this.targetRotation; // Snap to target
      }
    }
    
  }

  /**
   * Rotate the cylinder to a given spell index over a set duration.
   * @param {number} pos - The index of the spell to rotate to (0-5).
   * @param {number} time - The duration of the transition (in seconds).
   */
  rotateCylinder(pos, time) {
    const totalSpells = this.spells.length;
    const degreesPerSpell = 360 / totalSpells; // Each spell on circle
    const newRotation = (pos * degreesPerSpell * Math.PI) / 180; // degrees to radians

    // Cancel any current animation and start from the current location
    this.targetRotation = newRotation;
    this.rotationTime = time;
    this.rotationSpeed = (this.targetRotation - this.cylinderRotation) / (time / GAME_ENGINE.clockTick);
    this.activeSpellIndex = pos;
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

    const healthBarSprite = ASSET_MANAGER.getAsset("./assets/ui/healthbar.png");

    // Health bar dimensions
    const healthBarWidth = canvasWidth * this.healthBarWidthRatio;
    const healthBarHeight = canvasHeight * this.healthBarHeightRatio;
    const healthBarMargin = canvasHeight * this.healthBarMarginRatio;

    // Cowboy icon (leftmost)

    const cowboySize = healthBarHeight * 10;
    const cowboyX = healthBarMargin/3;
    const cowboyY = canvasHeight - cowboySize / 1.5 ;

    // Health bar (next to cowboy)
    const startX = cowboyX + cowboySize / 1.5;
    const startY = canvasHeight - healthBarHeight - healthBarMargin;

    // Spell UI scaling
    const scaleFactor = canvasHeight / 800;
    const cylinderSize = 120 * scaleFactor;
    const cylinderX = canvasWidth - cylinderSize - 50 * scaleFactor;
    const cylinderY = canvasHeight - cylinderSize - 50 * scaleFactor;

    // Spell text and icon positions
    const spellTextX = cylinderX - 200 * scaleFactor;
    const spellTextY = cylinderY + cylinderSize / 1.5;

    // Draw cowboy icon
    const cowboyImg = ASSET_MANAGER.getAsset(this.cowboyImage);
    if (cowboyImg) {
      ctx.drawImage(cowboyImg, cowboyX, cowboyY, cowboySize, cowboySize);
    }

    // Draw health bar
    //const player = GAME_ENGINE.entities.find(e => e.isPlayer);
    //onst currentHealth = player ? player.health : 0;
    //const maxHealth = 200;

    // Health bar sprite sheet settings
    const totalFrames = 11; // (100%, 90%, 80%, ..., 0%)
    const frameWidth = healthBarSprite.width;
    const frameHeight = healthBarSprite.height / totalFrames; // Each frame is 1/11th of the image

    // Get player health
    const player = GAME_ENGINE.entities.find(e => e.isPlayer);
    let healthRatio = player ? player.health / 200 : 1;
    let currentHealth =  player.health;
    const maxHealth = 200;
    healthRatio = Math.max(0, healthRatio); 
    const frameIndex = Math.min(totalFrames - 1, Math.max(0, totalFrames - 1 - Math.floor(healthRatio * (totalFrames - 1))));

    // Add Health Text above the bar
    const healthTextOffset = 5; // Move text UP by 15 pixels
    const healthTextX = startX + healthBarWidth / 2;
    const healthTextY = startY - healthTextOffset;

    ctx.fillStyle = "white";
    ctx.font = `${canvasHeight * 0.03}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(`${Math.round(player.health)} / ${maxHealth}`, healthTextX, healthTextY);

    // Draw spell name and icon
    ctx.fillText(`Spell: ${this.spells[this.activeSpellIndex].name}`, spellTextX, spellTextY);
    
    const spellIcon = ASSET_MANAGER.getAsset(this.spells[this.activeSpellIndex].icon);
    if (spellIcon) {
      const spellIconSize = 60 * scaleFactor;
      ctx.drawImage(spellIcon, spellTextX + 90 * scaleFactor, spellTextY - 50 * scaleFactor, spellIconSize, spellIconSize);
    }

    // Draw revolver cylinder (rotating)
    const cylinderImage = ASSET_MANAGER.getAsset(this.cylinderImages[0]);
    if (cylinderImage) {
        ctx.save();
        ctx.translate(cylinderX + cylinderSize / 2, cylinderY + cylinderSize / 2);
        ctx.rotate(this.cylinderRotation);
        ctx.drawImage(cylinderImage, -cylinderSize / 2, -cylinderSize / 2, cylinderSize, cylinderSize);
        ctx.restore();
    }

    // Debug mode UI
    if (this.debugMode) {
      ctx.fillStyle = "yellow";
      ctx.font = `${canvasHeight * 0.025}px Arial`;

      const debugTextX = 70;
      const debugTextY = 40;
      const lineSpacing = canvasHeight * 0.03;
      let debugLine = 0;

      ctx.fillText("DEBUG MODE: ON", debugTextX, debugTextY + debugLine++ * lineSpacing);

      if (player) {
        ctx.fillText(`Player Position: (${Math.floor(player.x)}, ${Math.floor(player.y)})`, debugTextX, debugTextY + debugLine++ * lineSpacing);
        ctx.fillText(`Player Velocity: (${player.x_velocity.toFixed(2)}, ${player.y_velocity.toFixed(2)})`, debugTextX, debugTextY + debugLine++ * lineSpacing);
        ctx.fillText(`Active Spell: ${this.spells[this.activeSpellIndex].name}`, debugTextX, debugTextY + debugLine++ * lineSpacing);
        ctx.fillText(`Health: ${currentHealth} / ${maxHealth}`, debugTextX, debugTextY + debugLine++ * lineSpacing);
      }
    }
    // Draw health bar from sprite sheet
    if (healthBarSprite) {
      ctx.drawImage(
          healthBarSprite,
          0, frameIndex * frameHeight, frameWidth, frameHeight,  // Crop the correct frame
          startX, startY, healthBarWidth, healthBarHeight  // Draw on screen
      );
  }

    ctx.restore();
  }

}
