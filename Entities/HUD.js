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

    // Cursor coordinates
    this.cursorX = 0;
    this.cursorY = 0;
     

    // Cowboy animation setup (Blinking images)
    this.cowboyImages = [
      "./assets/ui/cowboy.png",
      "./assets/ui/cowboy1.png",
      "./assets/ui/cowboy.png",
      "./assets/ui/cowboy2.png",
    ];

    // Spell switching animation setup
    this.cowboySpellImages = [
      "./assets/ui/cowboy_spell.png", // Transition start
      "./assets/ui/cowboy_spell1.png",
      "./assets/ui/cowboy_spell2.png",
      "./assets/ui/cowboy_spell3.png",
      "./assets/ui/cowboy_spell4.png",
      "./assets/ui/cowboy_spell5.png",
      "./assets/ui/cowboy_spell6.png",
      "./assets/ui/cowboy_spell.png", // Transition end
    ];

    this.cowboyFrameIndex = 0;  // Current frame
    this.blinkTimer = 0;        // Timer to switch frames
    this.blinkInterval = 1.0;   // Change every 0.5 seconds
    this.spellAnimationTimer = 0; // Timer for spell switching animation
    this.spellAnimationDuration = 1.2; // Duration of spell selection animation
    this.isSpellSwitching = false; // Flag to check if spell switching animation is playing

    // Spells and cylinder setup
    this.spells = [
      { name: "Fireball", icon: "./assets/ui/spells/fireball.png" },
      { name: "Lightning", icon: "./assets/ui/spells/lightning.png" },
      { name: "Water Wave", icon: "./assets/ui/spells/water.png" },
      { name: "Icicle", icon: "./assets/ui/spells/icicle.png" },
      { name: "Vine Ball", icon: "./assets/ui/spells/vine.png" },
      { name: "Void Orb", icon: "./assets/ui/spells/void.png" },
    ];

    this.activeSpellIndex = 0;
    this.previousSpellIndex = 0;

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
    const player = GAME_ENGINE.entities.find(e => e.isPlayer);
    if (!player) return; //check that player exists

     // Detect Spell Switching
     if (player.selectedSpell !== this.previousSpellIndex) {
      this.isSpellSwitching = true;
      this.spellAnimationTimer = this.spellAnimationDuration; // Start animation timer
      this.previousSpellIndex = player.selectedSpell; // Update previous spell index
    }

    // Blinking
    if (!this.isSpellSwitching) {
      this.blinkTimer += GAME_ENGINE.clockTick;
      if (this.blinkTimer >= this.blinkInterval) {
        this.blinkTimer = 0; // Reset timer
        this.cowboyFrameIndex = (this.cowboyFrameIndex + 1) % this.cowboyImages.length;
      }
    }

    if (this.isSpellSwitching) {
      this.spellAnimationTimer -= GAME_ENGINE.clockTick;
      if (this.spellAnimationTimer <= 0) {
        this.isSpellSwitching = false; // End spell animation
      }
    }

     // Sync HUD with Player's selected spell
     this.activeSpellIndex = player.selectedSpell;  
     this.rotateCylinder(this.activeSpellIndex, 0.5);

    // Toggle debug mode
    if (GAME_ENGINE.keys["b"]) {
      this.debugMode = !this.debugMode;
      GAME_ENGINE.debug_colliders = this.debugMode;
      //GAME_ENGINE.audioMuted = this.debugMode;// Mute/unmute audio in debug mode
      ASSET_MANAGER.toggleMute(this.debugMode);
      console.log(`Debug Mode: ${this.debugMode ? "ON" : "OFF"}`);
      GAME_ENGINE.keys["b"] = false;
    }
    /*
    // Spell selection (1-6 keys)
    for (let i = 1; i <= 6; i++) {
      const key = `Digit${i}`;
      if (GAME_ENGINE.keys[key]) {  
        this.rotateCylinder(i - 1, 0.5); // Smoothly switch spells in 0.5s
        GAME_ENGINE.keys[key] = false;
      }
    }
      */

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
    this.rotationSpeed =
      (this.targetRotation - this.cylinderRotation) /
      (time / GAME_ENGINE.clockTick);
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
    const customFont = ASSET_MANAGER.getAsset("./assets/fonts/texas.ttf");

    // Select font (custom unless in debug mode)
    ctx.fillStyle = "white";
    ctx.font = this.debugMode ? `${canvasHeight * 0.025}px Arial` : `${canvasHeight * 0.03}px ${customFont || "Arial"}`;
    ctx.textAlign = "center";

    // Health bar dimensions
    const healthBarWidth = canvasWidth * this.healthBarWidthRatio;
    const healthBarHeight = canvasHeight * this.healthBarHeightRatio;
    const healthBarMargin = canvasHeight * this.healthBarMarginRatio;

    // Cowboy icon (leftmost)
    const cowboySize = healthBarHeight * 15;
    const cowboyX = -canvasWidth * 0.05;
    const cowboyY = canvasHeight - cowboySize / 1.5;

    // Determine Cowboy Frame
    let currentCowboyImage = this.isSpellSwitching 
        ? this.cowboySpellImages[this.activeSpellIndex + 1] 
        : this.cowboyImages[this.cowboyFrameIndex];

    // Get Asset and Draw Cowboy
    const cowboyImg = ASSET_MANAGER.getAsset(currentCowboyImage);
    if (cowboyImg) {
        ctx.drawImage(cowboyImg, cowboyX, cowboyY, cowboySize, cowboySize);
    }

    // Health bar (next to cowboy)
    const startX = cowboyX + cowboySize / 1.5;
    const startY = canvasHeight - healthBarHeight - healthBarMargin;

    // Spell UI scaling
    const scaleFactor = canvasHeight / 800;
    const cylinderSize = 160 * scaleFactor;
    const cylinderX = canvasWidth - cylinderSize - 25 * scaleFactor;
    const cylinderY = canvasHeight - cylinderSize - 25 * scaleFactor;

    // Spell text and icon positions
    const spellTextX = cylinderX - 180 * scaleFactor;
    const spellTextY = cylinderY + cylinderSize / 1.05;

    // Health bar sprite sheet settings
    const totalFrames = 11; // (100%, 90%, 80%, ..., 0%)
    const frameWidth = healthBarSprite.width;
    const frameHeight = healthBarSprite.height / totalFrames;

    // Get player health
    const player = GAME_ENGINE.entities.find(e => e.isPlayer);
    const maxHealth = player ? player.maxHealth : 200;
    const currentHealth = player ? player.health : maxHealth;

    let healthRatio = Math.max(0, Math.min(currentHealth / maxHealth, 1));
    const frameIndex = Math.round((1 - healthRatio) * (totalFrames - 1));

    ctx.fillText(`${Math.round(currentHealth)} / ${maxHealth}`, startX + healthBarWidth / 2, startY - 5);  
    
    if (healthBarSprite) {
        ctx.drawImage(
            healthBarSprite,
            0,
            frameIndex * (healthBarSprite.height / totalFrames),
            frameWidth,
            frameHeight,
            startX,
            startY,
            healthBarWidth,
            healthBarHeight
        );
    }

    // Draw spell name and icon
    ctx.fillText(`Spell: ${this.spells[this.activeSpellIndex].name}`, spellTextX, spellTextY);

    const spellIcon = ASSET_MANAGER.getAsset(this.spells[this.activeSpellIndex].icon);
    if (spellIcon) {
        const spellIconSize = 60 * scaleFactor;
        ctx.drawImage(
            spellIcon,
            spellTextX + 90 * scaleFactor,
            spellTextY - 50 * scaleFactor,
            spellIconSize,
            spellIconSize
        );
    }

    // Draw revolver cylinder (rotating)
    const cylinderImage = ASSET_MANAGER.getAsset(this.cylinderImages[0]);
    if (cylinderImage) {
        ctx.save();
        ctx.translate(cylinderX + cylinderSize / 2, cylinderY + cylinderSize / 2);
        ctx.rotate(this.cylinderRotation);
        ctx.drawImage(
            cylinderImage,
            -cylinderSize / 2,
            -cylinderSize / 2,
            cylinderSize,
            cylinderSize
        );
        ctx.restore();
    }

    // Debug mode UI
    if (this.debugMode) {
        ctx.fillStyle = "white";
        ctx.font = `${canvasHeight * 0.025}px Arial`;

        const debugTextX = 90;
        const debugTextY = 40;
        const lineSpacing = canvasHeight * 0.03;
        let debugLine = 0;

        ctx.fillText("DEBUG MODE: ON", debugTextX, debugTextY + debugLine++ * lineSpacing);
        
        // Get mouse position relative to the game world
        const mouseX = GAME_ENGINE.mouse.x + GAME_ENGINE.camera.x;
        const mouseY = GAME_ENGINE.mouse.y + GAME_ENGINE.camera.y;
        
        // Cursor coordinate text position (above the cursor)
        const cursorTextX = mouseX;
        const cursorTextY = mouseY - 15; 
        
        // Ensure the text remains visible even near the top of the screen
        const adjustedCursorTextY = Math.max(cursorTextY, 20);

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
            ctx.fillText(`X: ${Math.floor(mouseX)}, Y: ${Math.floor(mouseY)}`, debugTextX,
            debugTextY + debugLine++ * lineSpacing);
        }
      }

    ctx.restore();
  }

}
