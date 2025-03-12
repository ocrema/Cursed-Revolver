import { Entity } from "../Entities/Entities.js";
import { GAME_ENGINE } from "../main.js";

export class HUD extends Entity {
  constructor(map, settings) {
    super();
    this.entityOrder = 9999;
    this.healthBarWidthRatio = 0.01;
    this.healthBarHeightRatio = 10;
    this.healthBarMarginRatio = 0.02;
    this.enemyHealthBarWidthRatio = 0.1; // smaller than player's
    this.enemyHealthBarHeightRatio = 0.02; // scaled height
   
   
    // this.healthBarWidthRatio = 500 / 1075;  // Keep aspect ratio of health bar sprite
    // this.healthBarHeightRatio = 0.25;       // Health bar height should be a significant fraction of screen
    // this.healthBarMarginRatio = 0.02;       // Small margin between cowboy and health bar

    // // Enemy Health Bar
    // this.enemyHealthBarWidthRatio = 0.1;    // Smaller for enemies
    // this.enemyHealthBarHeightRatio = 0.02;  // Scaled properly

    this.debugMode = false;
    this.assetManager = window.ASSET_MANAGER;


    this.debugMode = false;
    this.assetManager = window.ASSET_MANAGER;

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

    // Game over animations
    this.gameWinScreen = {
      image: this.assetManager.getAsset("./assets/ui/gameend/win.png"),
      width: 648,
      height: 492,
      frameCount: 6,
      frameDuration: 0.75,
    };
    this.gameLoseScreen = {
      image: this.assetManager.getAsset("./assets/ui/gameend/lose.png"),
      width: 1920,
      height: 1080,
      frameCount: 1,
      frameDuration: 0.75,
    };

    this.cowboyFrameIndex = 0; // Current frame
    this.blinkTimer = 0; // Timer to switch frames
    this.blinkInterval = 1.0; // Change every 0.5 seconds
    this.spellAnimationFrame = 1; // Ensure it starts at a valid value
    this.spellAnimationTimer = 0; // Timer for spell switching animation
    this.spellAnimationDuration = 1.2; // Duration of spell selection animation
    this.attackAnimationTimer = 0;
    this.attackAnimationDuration = 0.8;
    this.isSpellSwitching = false; // Flag to check if spell switching animation is playing
    this.isAttacking = false;
    this.currentCowboyImage = this.cowboyImages[0];
    this.healthFlashTimer = 0; // Timer for flashing effect on hit
    this.healthFlashDuration = 0.5; // Flash duration in seconds
    this.lastHealth = 0; // Stores the previous health value
    this.spells = [
      { name: "Fireball", altName: "fireball", icon: "./assets/ui/spells/fireball.png" },
      { name: "Vine Grapple", altName: "vine", icon: "./assets/ui/spells/vine.png" },
      { name: "Icicle", altName: "icicle", icon: "./assets/ui/spells/icicle.png" },
      { name: "Water Wave", altName: "water", icon: "./assets/ui/spells/water.png" },
      { name: "Chain Lightning", altName: "lightning", icon: "./assets/ui/spells/lightning.png" },
      { name: "Void Orb", altName: "void", icon: "./assets/ui/spells/void.png" },
    ];
    
    // Active spell index and tracking
    this.activeSpellIndex = 0;
    this.previousSpellIndex = 0;



    // Cylinder animation setup
    this.cylinderImages = [];
    for (let i = 1; i <= 10; i++) {
      this.cylinderImages.push(`./assets/ui/revolver/cylinder${i}.png`);
    }

    this.cylinderRotation = 0; // Current rotation (in radians)
    this.targetRotation = 0; // Target rotation (in radians)
    this.rotationSpeed = 8; // Speed of rotation (radians per frame)
    this.rotationDirection = 0; // Direction of rotation (1 = clockwise, -1 = counter-clockwise)

    this.gameWon = false; // Flag that swaps after an enemy is killed

    this.mapReference = map;

    if (!this.mapReference) {
      //console.error("HUD could not find a reference to the map entity.");
    }

    this.playerCurrentStage = 1;
    this.totalRemainingEnemies = 0;

    // Define spell combos
    this.spellCombos = {
      fireball: [
        { spell: "icicle", effect: "Temp Shock" },
        { spell: "void", effect: "Explosion" },
        { spell: "water", effect: "Extinguish" },
      ],
      icicle: [
        { spell: "fireball", effect: "Temp Shock" },
        { spell: "water", effect: "Longer Freeze" },
      ],
      water: [
        { spell: "icicle", effect: "Longer Freeze" },
        { spell: "lightning", effect: "Electrocute" },
        { spell: "fire", effect: "Extinguish" },
      ],
      lightning: [
        { spell: "water", effect: "Electrocute" },
        { spell: "void", effect: "Explosion" },
      ],
      void: [
        { spell: "fireball", effect: "Explosion" },
        { spell: "lightning", effect: "Explosion" },
      ],
    };

    this.availableCombos = [];
  }

  colliding() {
    return false;
  }

  displayFPS(ctx) {
    if (!this.settings || !this.settings.showFPS) return; // Ensure settings exist
    const customFont = ASSET_MANAGER.getAsset("./assets/fonts/texas.ttf");
    ctx.fillStyle = "white";
    ctx.font = `20px ${customFont || "Arial"}`;
    //ctx.font = "20px Arial";
    ctx.fillText(`FPS: ${GAME_ENGINE.fps}`, 100, 50);
  }


  update() {
    if (this.mapReference) {
      this.playerCurrentStage = this.mapReference.currentStage;
      if (this.playerCurrentStage === 1) {
        this.totalRemainingEnemies = this.mapReference.stageEnemyCounts[1];
      } else if (this.playerCurrentStage === 2) {
        this.totalRemainingEnemies = this.mapReference.stageEnemyCounts[2];
      } else if (this.playerCurrentStage === 3) {
        this.totalRemainingEnemies = this.mapReference.stageEnemyCounts[3];
      } else if (this.playerCurrentStage === 4) {
        this.totalRemainingEnemies = this.mapReference.stageEnemyCounts[4];
      } else {
        this.totalRemainingEnemies = this.mapReference.stageEnemyCounts[5];
      }
    }

    //check that player exists
    const player = window.PLAYER;
    if (!player) return;

    // Ensure the cowboy image is set on the first frame
    if (!this.currentCowboyImage) {
      this.currentCowboyImage = this.cowboyImages[0]; // Default cowboy sprite
    }

    // Detect if player took damage
    if (player.health < this.lastHealth) {
      this.healthFlashTimer = this.healthFlashDuration; // Start flash effect
    }

    this.lastHealth = player.health; // Update last health value

    // Reduce flash timer
    if (this.healthFlashTimer > 0) {
      this.healthFlashTimer -= GAME_ENGINE.clockTick;
    }

    // Detect Spell Switching
    if (player.selectedSpell !== this.previousSpellIndex) {
      //console.log(`Spell switched! Previous: ${this.previousSpellIndex}, New: ${player.selectedSpell}`);

      this.isSpellSwitching = true;
      this.spellAnimationTimer = 0; // Reset timer for smooth transition
      this.spellAnimationFrame = 1; // Ensure it starts at 1
      this.previousSpellIndex = player.selectedSpell; // Update previous spell index
    }

    // Ensure spell icon animation runs continuously
    this.spellAnimationTimer += GAME_ENGINE.clockTick;

    if (this.spellAnimationTimer >= 0.05) {
      // Adjust 0.05s per frame (change for speed)
      this.spellAnimationTimer = 0; // Reset timer
      this.spellAnimationFrame++; // Advance the frame

      // Fix the delay when looping back to frame 1
      if (this.spellAnimationFrame >= 30) {
        // Ensure reset happens at the correct frame
        //console.log(`Resetting animation frame: ${this.spellAnimationFrame} -> 1`);
        this.spellAnimationFrame = 1;
      }
    }

    // Ensure spellAnimationFrame is always valid
    if (
      isNaN(this.spellAnimationFrame) ||
      this.spellAnimationFrame < 1 ||
      this.spellAnimationFrame > 30
    ) {
      console.error(
        `spellAnimationFrame is out of range: ${this.spellAnimationFrame}, resetting...`
      );
      this.spellAnimationFrame = 1;
    }

    // Detect Attack (Left Mouse Button / 'm1')
    if (GAME_ENGINE.keys["m1"] && !this.isAttacking) {
      //console.log("ATTACK!!!");
      this.isAttacking = true;
      this.attackAnimationTimer = this.spellAnimationDuration; // Set attack animation timer
    }

    // Handle Cowboy Animation (Spell & Attack Flash)
    if (this.isSpellSwitching == true || this.isAttacking == true) {
      const flashFrameIndex = Math.floor(
        ((this.spellAnimationTimer + this.attackAnimationTimer) /
          this.spellAnimationDuration) *
          6
      );
      this.currentCowboyImage = `./assets/ui/cowboy_flash${Math.min(
        flashFrameIndex + 1,
        6
      )}.png`;

      // Reduce animation timers
      if (this.isSpellSwitching)
        this.spellAnimationTimer -= GAME_ENGINE.clockTick;
      if (this.isAttacking) this.attackAnimationTimer -= GAME_ENGINE.clockTick;

      // End animations when timers expire
      if (this.spellAnimationTimer <= 0) {
        this.isSpellSwitching = false;
      }
      if (this.attackAnimationTimer <= 0) {
        //console.log("ATTACK ANIMATION END!");
        this.isAttacking = false;
      }
    } else {
      // Normal Blinking Animation (Slow & Randomized)
      this.blinkTimer += GAME_ENGINE.clockTick;
      if (this.blinkTimer >= this.blinkInterval) {
        this.blinkTimer = 0;
        this.blinkInterval = Math.random() * 3 + 3; // Blink every 3-6 seconds
        this.cowboyFrameIndex =
          (this.cowboyFrameIndex + 1) % this.cowboyImages.length;
      }
      this.currentCowboyImage = this.cowboyImages[this.cowboyFrameIndex];
    }

    // Sync HUD with Player's selected spell
    if (this.activeSpellIndex !== player.selectedSpell) {
      this.activeSpellIndex = player.selectedSpell;
      this.rotateCylinder(this.activeSpellIndex, 0.5);
    }

    // Ensure activeSpellIndex is valid
    if (!this.spells || !Array.isArray(this.spells) || this.spells.length === 0) {
      console.error("HUD: Spells array is undefined or empty.");
      return; // Exit early to avoid crashing
    }
    
    // Ensure activeSpellIndex is within bounds
    if (this.activeSpellIndex < 0 || this.activeSpellIndex >= this.spells.length) {
      console.warn(`Invalid activeSpellIndex: ${this.activeSpellIndex}`);
      this.activeSpellIndex = 0;
    }
    
    // Get the current spell
    const currentSpell = this.spells[this.activeSpellIndex].altName;

    // Get available combos
    this.availableCombos = this.spellCombos[currentSpell] || [];


    // Toggle debug mode
    if (GAME_ENGINE.keys["b"]) {
      this.debugMode = !this.debugMode;
      GAME_ENGINE.debug_colliders = this.debugMode;
      ASSET_MANAGER.toggleMute(this.debugMode);
      console.log(`Debug Mode: ${this.debugMode ? "ON" : "OFF"}`);
      GAME_ENGINE.keys["b"] = false;
    }

    // Smooth rotation logic
    if (this.rotationDirection !== 0) {
      let change =
        (this.cylinderRotation +
          this.rotationSpeed * this.rotationDirection * GAME_ENGINE.clockTick) %
        (Math.PI * 2);
      if (change < 0) change += Math.PI * 2;
      // Check if the rotation has reached the target for 1-5

      for (let i = 1; i <= 5; i++) {
        let angle = i * (Math.PI / 3);
        let a = this.cylinderRotation - angle;
        let b = change - angle;
        if (
          Math.sign(a) !== Math.sign(b) &&
          Math.abs(a) < Math.PI / 6 &&
          Math.abs(b) < Math.PI / 6
        ) {
          if (i === player.selectedSpell) {
            this.rotationDirection = 0;
            this.cylinderRotation = this.targetRotation;
          }
          window.ASSET_MANAGER.playAsset("./assets/sfx/click1.ogg");
        }
      }

      // special logic for 0
      if (Math.abs(this.cylinderRotation - change) > Math.PI * (11 / 6)) {
        if (this.activeSpellIndex === 0) {
          this.rotationDirection = 0;
          this.cylinderRotation = this.targetRotation;
        }
        window.ASSET_MANAGER.playAsset("./assets/sfx/click1.ogg");
      }

      if (this.rotationDirection !== 0) {
        this.cylinderRotation = change;
      }
    }
  }

  /**
   * Rotate the cylinder to a given spell index over a set duration.
   * @param {number} pos - The index of the spell to rotate to (0-5).
   * @param {number} time - The duration of the transition (in seconds).
   */
  rotateCylinder(pos) {
    const target = pos * (Math.PI / 3);
    if (target === this.cylinderRotation) return;
    if (target < this.cylinderRotation) {
      if (Math.abs(target - this.cylinderRotation) < Math.PI)
        this.rotationDirection = -1;
      else this.rotationDirection = 1;
    } else {
      if (Math.abs(target - this.cylinderRotation) < Math.PI)
        this.rotationDirection = 1;
      else this.rotationDirection = -1;
    }
    this.targetRotation = target;
  }

  selectSpell(index) {
    this.activeSpellIndex = index;
    this.spinTargetFrame = index;
    this.spinning = true;
  }

  draw(ctx) {
    let film = true;
    if (film) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformations

      const canvasWidth = ctx.canvas.width;
      const canvasHeight = ctx.canvas.height;

      // logic for writing number of enemies left

      ctx.fillStyle = "white";
      ctx.font = `${canvasHeight * 0.03}px Texas, Arial`;
      ctx.textAlign = "right";
      if (this.playerCurrentStage === 1) {
        ctx.fillText(
          `Desert Enemies Left: ${this.totalRemainingEnemies}`,
          canvasWidth - 20,
          50
        );
      } else if (this.playerCurrentStage === 2) {
        ctx.fillText(
          `Underground Enemies Left: ${this.totalRemainingEnemies}`,
          canvasWidth - 20,
          50
        );
      } else if (this.playerCurrentStage === 3) {
        ctx.fillText(
          `Pit Enemies Left: ${this.totalRemainingEnemies}`,
          canvasWidth - 20,
          50
        );
      } else if (this.playerCurrentStage === 4) {
        ctx.fillText(
          `Pit Enemies Left: ${this.totalRemainingEnemies}`,
          canvasWidth - 20,
          50
        );
      } else {
        ctx.fillText(
          `Ascend Enemies Left: ${this.totalRemainingEnemies}`,
          canvasWidth - 20,
          50
        );
      }

      this.displayFPS(ctx);

      // Get Player

      const player = window.PLAYER;
      if (!player) return; // Ensure player exists

      // Get Assets
      const customFont = ASSET_MANAGER.getAsset("./assets/fonts/texas.ttf");
      //const cowboyImg = ASSET_MANAGER.getAsset("./assets/ui/cowboy.png");
      const spellIcon = ASSET_MANAGER.getAsset(
        this.spells[this.activeSpellIndex].icon
      );
      const cylinderImage = ASSET_MANAGER.getAsset(this.cylinderImages[0]);

      // === Font Setup ===
      ctx.fillStyle = "white";
      ctx.font = this.debugMode
        ? `${canvasHeight * 0.025}px Arial`
        : `${canvasHeight * 0.03}px ${customFont || "Arial"}`;
      ctx.textAlign = "center";


      // === Health Bar Setup ===
      const maxHealth = player.maxHealth;
      const currentHealth = Math.max(0, player.health);
      const healthRatio = currentHealth / maxHealth;

      // Determine health bar sprite index (0-48)
      const healthBarIndex = Math.min(62, Math.max(0, Math.floor(healthRatio * 62)));

      // Get the correct health bar sprite
      const healthBarSprite = this.assetManager.getAsset(`./assets/ui/hbar${healthBarIndex}.png`);

      // Define Health Bar Dimensions
      const healthBarHeight = canvasHeight * 0.3; // Adjust height based on screen
      const healthBarWidth = healthBarHeight * (500 / 1075); // Keep original aspect ratio

      // Positioning the Health Bar (Right of Cowboy)
      const cowboySize = healthBarWidth * 4.4; // Cowboy should be smaller than health bar
      const cowboyX = canvasWidth * 0.02; // Cowboy stays at left
      const cowboyY = canvasHeight - cowboySize/2.0 ; // Keep cowboy near bottom

            // const cowboyX = canvasWidth * 0.02; // Move cowboy to the right
            // const cowboyY = canvasHeight - cowboySize / 2.0; // Move cowboy lower

      const healthBarX = cowboyX + cowboySize*0.5 ; // Place to the right of cowboy
      const healthBarY = cowboyY + cowboySize / 10 - healthBarHeight / 5; // Center it vertically

      // === Draw "Health" Label Above the Bar ===
      ctx.fillStyle = this.healthFlashTimer > 0 ? "red" : "white";
      ctx.font = `${canvasHeight * 0.03}px Texas, Arial`;
      ctx.textAlign = "center";
      ctx.fillText(
          `HP: ${Math.round(currentHealth)} / ${maxHealth}`,
          healthBarX + healthBarWidth / 2,
          healthBarY  // Move above the bar
      );

      // === Draw Vertical Health Bar ===
      if (healthBarSprite) {
          ctx.drawImage(healthBarSprite, healthBarX, healthBarY, healthBarWidth, healthBarHeight);
      }

      // === Draw Cowboy Icon ===
      const cowboyImg = ASSET_MANAGER.getAsset(this.currentCowboyImage);
      if (cowboyImg) {
        ctx.drawImage(
          cowboyImg,
          cowboyX,
          cowboyY,
          cowboySize / 2,
          cowboySize / 2
        );
      }

      // === Spell UI Setup ===
      const scaleFactor = canvasHeight / 800;
      const cylinderSize = 160 * scaleFactor;
      const cylinderX = canvasWidth - cylinderSize - 25 * scaleFactor;
      const cylinderY = canvasHeight - cylinderSize - 25 * scaleFactor;
      //const spellTextX = cylinderX - 180 * scaleFactor;
      const spellTextX = cylinderX - 250 * scaleFactor;
      //const spellTextY = cylinderY + cylinderSize / 1.05;
      const spellTextY = (cylinderY-20)*1.05 ;


      // === Draw Spell Name & Icon ===
      ctx.fillStyle = "white";
      ctx.fillText(
        `Spell: ${this.spells[this.activeSpellIndex].name}`,
        spellTextX+50,
        spellTextY
      );

      const currentSpell = this.spells[this.activeSpellIndex];
      const animatedIconPath = `./assets/ui/spells/${currentSpell.altName}/${
        currentSpell.altName
      }${this.spellAnimationFrame + 1}.png`;
      const animatedSpellIcon = ASSET_MANAGER.getAsset(animatedIconPath);

      if (animatedSpellIcon) {
        const spellIconSize = 60 * scaleFactor;
        ctx.drawImage(
          animatedSpellIcon,
          spellTextX+50 + 90 * scaleFactor,
          spellTextY - 50 * scaleFactor,
          spellIconSize,
          spellIconSize
        );
      } else {
        
      }

      // === Draw Revolver Cylinder (Rotating & Glowing) ===
      if (cylinderImage) {
        ctx.save();

        // Position and rotation
        ctx.translate(
          cylinderX + cylinderSize / 2,
          cylinderY + cylinderSize / 2
        );
        ctx.rotate(-this.cylinderRotation);

        // === Glowing Effect Based on Selected Spell ===
        ctx.shadowBlur = 30; // Glow intensity
        ctx.shadowColor = player.spellColors[this.activeSpellIndex]; // Spell-based glow color

        // Draw the cylinder
        ctx.drawImage(
          cylinderImage,
          -cylinderSize / 2,
          -cylinderSize / 2,
          cylinderSize,
          cylinderSize
        );

        // draw bullets
        const positions = [
          { x: 0, y: -10 },
          { x: 9, y: -5 },
          { x: 9, y: 5 },
          { x: 0, y: 10 },
          { x: -9, y: 5 },
          { x: -9, y: -5 },
        ];

        for (let i = 0; i < 6; i++) {
          ctx.shadowBlur = 10; // Glow intensity
          ctx.shadowColor = player.spellColors[i]; // Spell-based glow color
          ctx.globalAlpha =
            1 -
            Math.min(
              (player.spellCooldowns[i] * 2) / player.maxSpellCooldown,
              1
            );

          ctx.drawImage(
            ASSET_MANAGER.getAsset("./assets/ui/revolver/bullets.png"),
            8 * i,
            0,
            8,
            8,
            ((positions[i].x - 4) / 32) * cylinderSize,
            ((positions[i].y - 4) / 32) * cylinderSize,
            cylinderSize / 4,
            cylinderSize / 4
          );
        }

        // Reset glow effect after drawing
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      // === Display Combo Hints (Properly Scaled & Positioned) ===
      if(this.spells[this.activeSpellIndex].name != "Vine Grapple" ){
        const comboFontSize = canvasHeight * 0.022; // Slightly smaller text for better spacing
        ctx.fillStyle = "white";
        ctx.textAlign = "left"; // Align text properly

        // Positioning
        const comboStartX = spellTextX; // Align "+" properly with title
        //const comboStartY = spellTextY + 40 * scaleFactor; // Slightly below spell name
        //const comboStartY = startY + 15 + healthBarHeight + (spellTextY - startY - healthBarHeight - 50) / 2;
        const comboStartY = spellTextY + 33 ;

        // Display Title
        ctx.fillText("Possible Combos:", comboStartX, comboStartY);

        // Define icon size & spacing
        const iconSize = 30 * scaleFactor;  // Slightly smaller spell icons
        const lineSpacing = 35 * scaleFactor;  // Reduced spacing for compact display

        // Draw each combo with animation
        this.availableCombos.forEach((combo, index) => {
            if (combo.spell && combo.effect) { 
                const spellData = this.spells.find(spell => spell.altName === combo.spell);

                if (spellData) {
                    // Use the animated spell icon
                    const animatedIconPath = `./assets/ui/spells/${spellData.altName}/${spellData.altName}${this.spellAnimationFrame + 1}.png`;
                    const animatedSpellIcon = ASSET_MANAGER.getAsset(animatedIconPath);
                    
                    if (animatedSpellIcon) {
                        // Draw "+" aligned with title
                        ctx.fillText("+", comboStartX, comboStartY + (index + 1) * lineSpacing);

                        // Draw spell icon next to "+"
                        ctx.drawImage(
                            animatedSpellIcon, 
                            comboStartX + 15 * scaleFactor, 
                            comboStartY + (index + 1) * lineSpacing - iconSize / 2 - (15 * scaleFactor), 
                            iconSize, 
                            iconSize
                        );

                        // Draw "-> Effect" aligned with icon
                        ctx.fillText(`-> ${combo.effect}`, comboStartX + 55 * scaleFactor, comboStartY + (index + 1) * lineSpacing);
                    }
                }
            }
        });
    }

      // === Game Win Screen ===

      if (this.gameWon) {
        // console.log("All enemies are dead! Triggering game over.");
        GAME_ENGINE.GAME_CONTROLLER.setGameOver();

        this.updateGameOverScreen(ctx);

        ctx.fillStyle = "rgb(22, 129, 0)";
        ctx.font = `${canvasHeight * 0.12}px Texas, Arial`;
        ctx.fillText("GAME WON", canvasWidth / 2, canvasHeight / 2);

        ctx.font = `${canvasHeight * 0.04}px Texas, Arial`;
        ctx.fillText("Press R to Restart", canvasWidth / 2, canvasHeight / 1.5);

        ctx.restore();
        return;
      }

      // === Game Over Screen ===
      if (currentHealth <= 0) {
        console.log("Player health is 0! Triggering Game Over.");
        GAME_ENGINE.GAME_CONTROLLER.setGameOver();

        this.updateGameOverScreen(ctx);

        ctx.fillStyle = "white";
        ctx.font = `${canvasHeight * 0.12}px Texas, Arial`;
        ctx.fillText("GAME OVER", canvasWidth / 2, canvasHeight / 2);

        ctx.font = `${canvasHeight * 0.04}px Texas, Arial`;
        ctx.fillText("Press R to Restart", canvasWidth / 2, canvasHeight / 1.5);

        ctx.restore();
        return;
      }

      // === Debug Mode UI ===
      if (this.debugMode) {
        ctx.fillStyle = "white";
        ctx.font = `${canvasHeight * 0.025}px Arial`;

        const debugTextX = 90;
        const debugTextY = 40;
        const lineSpacing = canvasHeight * 0.03;
        let debugLine = 0;

        ctx.fillText(
          "DEBUG MODE: ON",
          debugTextX,
          debugTextY + debugLine++ * lineSpacing
        );

        // Get mouse position relative to the game world
        const mouseX = GAME_ENGINE.mouse.x + GAME_ENGINE.camera.x;
        const mouseY = GAME_ENGINE.mouse.y + GAME_ENGINE.camera.y;

        if (player) {
          ctx.fillText(
            `Player Position: (${Math.floor(player.x)}, ${Math.floor(
              player.y
            )})`,
            debugTextX,
            debugTextY + debugLine++ * lineSpacing
          );
          ctx.fillText(
            `Player Velocity: (${player.x_velocity.toFixed(
              2
            )}, ${player.y_velocity.toFixed(2)})`,
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
          ctx.fillText(
            `X: ${Math.floor(mouseX)}, Y: ${Math.floor(mouseY)}`,
            debugTextX,
            debugTextY + debugLine++ * lineSpacing
          );
        }
      }

      ctx.restore();
    }
  }

  updateGameOverScreen(ctx) {
    this.elapsedTime += GAME_ENGINE.clockTick;

    if (this.gameWon) {
      if (this.elapsedTime > this.gameWinScreen.frameDuration) {
        this.elapsedTime = 0;
        this.currentFrame =
          (this.currentFrame + 1) % this.gameWinScreen.frameCount;
      }

      ctx.drawImage(
        this.gameWinScreen.image,
        this.currentFrame * this.gameWinScreen.width,
        0,
        this.gameWinScreen.width,
        this.gameWinScreen.height,
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
    } else {
      // black background
      ctx.drawImage(
        this.gameLoseScreen.image,
        0,
        0,
        this.gameLoseScreen.width,
        this.gameLoseScreen.height,
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );
    }
  }

  checkWin() {
    let enemiesDead = true;
    for (let entity of GAME_ENGINE.entities) {
      // if an entity is an enemy and has more than 0 health
      if (entity.isEnemy && entity.health > 0) {
        enemiesDead = false;
      }
    }
    this.gameWon = enemiesDead;
  }

  getSpellGlowColor(spellIndex) {
    const spellGlows = [
      "rgba(255, 68, 0, 0.86)", // Fireball - Orange Red
      "rgba(229, 232, 50, 0.8)", // Lightning - Light Blue
      "rgba(43, 230, 224, 0.8)", // Water Wave - Dodger Blue
      "rgba(43, 154, 223, 0.8)", // Icicle - Sky Blue
      "rgba(34, 139, 34, 0.8)", // Vine Ball - Forest Green
      "rgba(138, 43, 226, 0.8)", // Void Orb - Blue Violet
    ];

    return spellGlows[spellIndex] || "rgba(255, 255, 255, 0.8)"; // Default glow if index is out of range
  }
}
