import { Entity } from "./Entities.js";

export class PauseMenu extends Entity {
  constructor(gameController) {
    super();
    this.gameController = gameController;
    this.entityOrder = 99999999;
    this.isVisible = false;
    this.menuOptions = ["Resume", "Settings", "Help", "Quit"];
    this.settingsOptions = ["Music", "Mute ALL", "Debug Mode", "FPS Display"];
    this.selectedOption = 0;
    this.selectedSettingsOption = 0;
    this.showSettingsMenu = false;
    this.showHelpMenu = false;
    this.buttonPositions = {};
    this.keyState = {}; // Track key states to prevent sticky navigation
  }

  setVisibility(visible) {
    this.isVisible = visible;
  }

  toggleVisibility() {
    this.setVisibility(!this.isVisible);
  }

  hide() {
    this.setVisibility(false);
  }

  show() {
    this.setVisibility(true);
  }

  update() {
    if (!this.isVisible) return;

    const now = performance.now();

    if (this.showSettingsMenu) {
      this.handleKeyState("ArrowUp", () => this.navigateSettings(-1), now);
      this.handleKeyState("ArrowDown", () => this.navigateSettings(1), now);
      this.handleKeyState("Enter", () => this.toggleSetting(), now);
      this.handleKeyState("Escape", () => (this.showSettingsMenu = false), now);
      if (GAME_ENGINE.keys["x"] ) {
        this.showSettingsMenu = false;
        this.showHelpMenu = false;
        this.pauseMenu = false;
        GAME_ENGINE.keys["Escape"] = false;
      }
      return;
    }

    if (this.showHelpMenu) {
      if (GAME_ENGINE.keys["Escape"] || GAME_ENGINE.keys["x"] ) {
        this.showHelpMenu = false;
        GAME_ENGINE.keys["Escape"] = false;
      }
      return;
    }


    this.handleKeyState("Escape", () => this.toggleVisibility(), now);
    this.handleKeyState("ArrowUp", () => this.navigateMenu(-1), now);
    this.handleKeyState("ArrowDown", () => this.navigateMenu(1), now);
    this.handleKeyState("Enter", () => this.executeSelectedOption(), now);
  }

  handleKeyState(key, action, timestamp) {
    if (GAME_ENGINE.keys[key] && !this.keyState[key]) {
      action();
      this.keyState[key] = timestamp;
    } else if (!GAME_ENGINE.keys[key]) {
      this.keyState[key] = null; // Reset when key is released
    }
  }

  navigateMenu(direction) {
    this.selectedOption = (this.selectedOption + direction + this.menuOptions.length) % this.menuOptions.length;
  }

  navigateSettings(direction) {
    this.selectedSettingsOption = (this.selectedSettingsOption + direction + this.settingsOptions.length) % this.settingsOptions.length;
  }
  
  
  toggleSetting() {
    if (!this.gameController.settings) return;
  
    const setting = this.settingsOptions[this.selectedSettingsOption];
  
    if (setting === "Music") {
      if (!this.gameController.settings.muteAll && !this.gameController.hud.debugMode) {
        this.gameController.toggleMusic(!this.gameController.settings.musicOn);
      }
    } else if (setting === "Mute ALL") {
      if (!this.gameController.hud.debugMode) {
        this.gameController.toggleMuteAll(!this.gameController.settings.muteAll);
      }
    } else if (setting === "Debug Mode") {
      this.gameController.toggleDebug(!this.gameController.hud.debugMode);
  
      if (this.gameController.hud.debugMode) {
        // Disable Music and Mute All when Debug is ON
        this.gameController.toggleMuteAll(true);
      }
    } else if (setting === "FPS Display") {
      this.gameController.toggleFPS(!this.gameController.settings.showFPS);
    }
  
    localStorage.setItem("gameSettings", JSON.stringify(this.gameController.settings));
  }



  closeHelpMenu() {
    if (this.showHelpMenu) {
      this.showHelpMenu = false;
    }
  }

  draw(ctx) {
    if (!this.isVisible) return;

    const centerX = this.x / 2;
    const centerY = this.y / 2;

    if (this.showHelpMenu) {
      this.drawHelpMenu(ctx, centerX, centerY);
    } else if (this.showSettingsMenu) {
      this.drawSettingsMenu(ctx, centerX, centerY);
    } else {
      this.drawPauseMenu(ctx, centerX, centerY);
    }
  }

  drawPauseMenu(ctx, centerX, centerY) {
    const menuWidth = 330;
    const menuHeight = 450;
    const menuX = centerX - menuWidth / 2;
    const menuY = centerY - menuHeight / 2;

    // === Draw Full-Screen Purple Background ===
    ctx.fillStyle = "rgba(131, 40, 153, 0.8)"; // Deep purple, semi-transparent
    ctx.fillRect(-ctx.canvas.width*5, -ctx.canvas.width*5, ctx.canvas.width*1000, ctx.canvas.height*1000);

    const customFont = ASSET_MANAGER.getAsset("./assets/fonts/texas.ttf");
    // Draw "Pause Menu" header
    ctx.fillStyle = "#F1EDB3";
    ctx.font = `69px ${customFont || "Arial"}`; // Use custom font
    ctx.textAlign = "center";
    ctx.fillText("Pause Menu", centerX, menuY + 50);

    // Define button positions dynamically
    this.buttonPositions = this.menuOptions.reduce((positions, label, index) => {
      positions[label] = { x: centerX - 125, y: menuY + 100 + index * 70 };
      return positions;
    }, {});

    // Draw Buttons
    this.menuOptions.forEach((label, index) => {
      this.drawButton(ctx, label, `./assets/ui/menu/button${label}.png`, index);
    });

     // === Draw "ESC to Exit" Below Buttons ===
     ctx.fillStyle = "#F1EDB3";
     ctx.font = `32px ${customFont || "Arial"}`;
     ctx.fillText("ESC to exit", centerX, menuY + menuHeight - 20);
  }

  drawButton(ctx, label, imagePath, optionIndex) {
    const buttonWidth = 250;
    const buttonHeight = 60;
    const { x, y } = this.buttonPositions[label];

    const buttonImage = ASSET_MANAGER.getAsset(imagePath);
    if (buttonImage) {
      if (this.selectedOption === optionIndex) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 5;
        ctx.strokeRect(x - 5, y - 5, buttonWidth + 10, buttonHeight + 10);
      }
      ctx.drawImage(buttonImage, x, y, buttonWidth, buttonHeight);
    }
  }

  drawHelpMenu(ctx, centerX, centerY) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    const menuWidth = 1000;
    const menuHeight = 650;
    const menuX = centerX - menuWidth / 2;
    const menuY = centerY - menuHeight / 2;

    // === Draw Full-Screen Purple Background ===
    ctx.fillStyle = "rgba(131, 40, 153, 0.8)"; // Deep purple, semi-transparent
    ctx.fillRect(-ctx.canvas.width*5, -ctx.canvas.width*5, ctx.canvas.width*1000, ctx.canvas.height*1000);

    const customFont = ASSET_MANAGER.getAsset("./assets/fonts/texas.ttf");

    // === Draw Help Menu Box ===
    ctx.fillStyle = "rgba(131, 40, 153, 0.8)"; // Darker purple for contrast
    ctx.fillRect(menuX, menuY, menuWidth, menuHeight);

    ctx.strokeStyle = "#FFD700"; // Gold Border
    //ctx.strokeStyle = "grey";
    ctx.lineWidth = 4;
    ctx.strokeRect(menuX, menuY, menuWidth, menuHeight);

    // === Draw "HOW TO PLAY" Header ===
    ctx.fillStyle = "#F1EDB3"; // Light gold text
    ctx.font = `55px ${customFont || "Arial"}`; // Custom font or fallback
    ctx.textAlign = "center";
    ctx.fillText("HOW TO PLAY", centerX, menuY + 60);

    // === Instructions (Two Equal Columns) ===
    
    ctx.font = `32px ${customFont || "Arial"}`;
    ctx.fillStyle = "#F1EDB3";
    ctx.textAlign = "left";

    const tutorialText = [
        ["A / D", "Move Left / Right"],
        ["Space", "Jump"],
        ["Shift", "Dash"],
        ["1 - 6", "Switch Spells"],
        ["Scroll Wheel", "Switch Spells"],
        ["Click", "Shoot"],
        ["H", "Respawn at Campfire"],
        ["Tumbleweeds", "Can be set on fire"],
        ["Fireball", "Detonates barrels"],
        ["Water Wave", "Grows trees"],
    ];

    const columnWidth = menuWidth / 2 - 50; // Ensures equal column spacing
    let leftX = menuX + 50;
    let rightX = menuX + columnWidth + 70;
    let textY = menuY + 120;
    const rowSpacing = 40;
    const keySpacing = 170; // Space between key and description
    
    tutorialText.forEach(([key, action], index) => {
        const xPos = index < tutorialText.length / 2 ? leftX : rightX;
        const yPos = textY + (index % (tutorialText.length / 2)) * rowSpacing;
    
        ctx.fillStyle = "#F1EDB3"; // SAME COLOR AS "HOW TO PLAY"
        ctx.fillText(key, xPos, yPos);
        ctx.fillText(action, xPos + keySpacing, yPos);
    });

    // === Draw "Spell Combos" Section Below Instructions ===
    const spellComboY = menuY + 350; // Position spell combos below tutorial text
    ctx.fillStyle = "#F1EDB3"; // Same color as title
    ctx.font = `55px ${customFont || "Arial"}`;
    ctx.textAlign = "center";
    ctx.fillText("SPELL COMBOS", centerX, spellComboY);

    ctx.font = `32px ${customFont || "Arial"}`;
    ctx.textAlign = "left";

    const spellCombos = {
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

    let comboTextY = spellComboY + 50; // Start below the "SPELL COMBOS" title
    Object.entries(spellCombos).forEach(([baseSpell, combos]) => {
        let comboText = `${baseSpell.charAt(0).toUpperCase() + baseSpell.slice(1)}: `;
        combos.forEach((combo, i) => {
            comboText += `${combo.spell.charAt(0).toUpperCase() + combo.spell.slice(1)} → ${combo.effect}`;
            if (i < combos.length - 1) comboText += ", ";
        });

        ctx.fillText(comboText, menuX + 50, comboTextY);
        comboTextY += 35;
    });    

    // === Draw "ESC to exit" Below Instructions ===
    ctx.font = `32px ${customFont || "Arial"}`;
    ctx.fillStyle = "#F1EDB3";
    ctx.textAlign = "center";
    ctx.fillText("Press 'X' to close or 'ESC' to exit menu", centerX, menuY + menuHeight - 30);
  }

  drawSettingsMenu(ctx, centerX, centerY) {
    const menuWidth = 600;
    const menuHeight = 350;
    const menuX = centerX - menuWidth / 2;
    const menuY = centerY - menuHeight / 2;

    // === Draw Full-Screen Purple Background ===
    ctx.fillStyle = "rgba(131, 40, 153, 0.8)"; // Deep purple, semi-transparent
    ctx.fillRect(-ctx.canvas.width*2, -ctx.canvas.width*2, ctx.canvas.width*1000, ctx.canvas.height*1000);

    
    const customFont = ASSET_MANAGER.getAsset("./assets/fonts/texas.ttf");


    // === Draw Settings Menu Box ===
    ctx.fillStyle = "rgba(131, 40, 153, 0.8)"; // Darker purple for contrast
    ctx.fillRect(menuX, menuY, menuWidth, menuHeight);
    

    ctx.strokeStyle = "#FFD700"; // Gold Border
    ctx.lineWidth = 4;
    ctx.strokeRect(menuX, menuY, menuWidth, menuHeight);
    

    // === Draw Settings Title ===
    ctx.fillStyle = "#F1EDB3";
    ctx.font = `40px ${customFont}`;
    ctx.textAlign = "center";
    ctx.fillText("SETTINGS", centerX, menuY + 50);

    ctx.font = `28px ${customFont}`;
    ctx.textAlign = "left";

    const settingsX = menuX + 50;
    let textY = menuY + 100;
    const settingSpacing = 50;

    this.settingsOptions.forEach((setting, index) => {
        let isOn = this.gameController.settings[setting.toLowerCase().replace(/ /g, "")] || false;

        const isDebugMode = this.gameController.settings.debugMode;
        const isMuteAllOn = this.gameController.settings.muteAll;
        
        // FIX: Allow toggling back when Debug Mode is OFF
        const isDisabled = (isDebugMode && (setting === "Music" || setting === "Mute ALL"));

        // Highlight selected option
        if (this.selectedSettingsOption === index) {
            ctx.fillStyle = isDisabled ? "rgba(150, 150, 150, 0.4)" : "rgba(255, 215, 0, 0.2)";
            ctx.fillRect(settingsX - 20, textY - 30, 500, 40);
        }

        // Display setting text
        ctx.fillStyle = isDisabled ? "gray" : "#F1EDB3";
        ctx.fillText(setting, settingsX, textY);

        // Show ON/OFF state
        ctx.fillStyle = isOn ? "#00FF00" : "#FF0000";
        ctx.fillText(isOn ? "ON" : "OFF", settingsX + 300, textY);

        textY += settingSpacing;
    });

    // === Draw "ESC to exit" Below Everything ===
    ctx.font = `28px ${customFont}`;
    ctx.fillStyle = "#F1EDB3";
    ctx.textAlign = "center";
    ctx.fillText("Press 'X' to close or 'ESC' to exit menu", centerX, menuY + menuHeight - 30);
  }

  drawSlider(ctx, x, y, value) {
    const barWidth = 120;
    const barHeight = 10;
    const fillWidth = (value / 100) * barWidth;

    // Slider Background
    ctx.fillStyle = "#444"; // Dark background for contrast
    ctx.fillRect(x, y - 5, barWidth, barHeight);

    // Filled Slider (Progress)
    ctx.fillStyle = "#FFD700"; // Gold color to match theme
    ctx.fillRect(x, y - 5, fillWidth, barHeight);

    // Slider Value Indicator
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(value + "%", x + barWidth + 10, y + 5);
  }


  handleClick(mouseX, mouseY) {
    if (!this.isVisible) return;
  
    if (this.showSettingsMenu) {
      const settingsX = this.x / 2 - 250;
      let textY = this.y / 2 - 120;
      const settingSpacing = 50;
  
      this.settingsOptions.forEach((setting, index) => {
        if (
          mouseX >= settingsX &&
          mouseX <= settingsX + 400 &&
          mouseY >= textY - 20 &&
          mouseY <= textY + 20
        ) {
          this.selectedSettingsOption = index;
          this.toggleSetting(); // Apply the setting when clicked
        }
        textY += settingSpacing;
      });
      return;
    }
  
    if (this.showHelpMenu) {
      this.showHelpMenu = false;
      return;
    }
  
    Object.entries(this.buttonPositions).forEach(([label, pos], index) => {
      if (mouseX >= pos.x && mouseX <= pos.x + 250 && mouseY >= pos.y && mouseY <= pos.y + 60) {
        this.selectedOption = index;
        this.executeSelectedOption();
      }
    });
  }
  

  executeSelectedOption() {
    switch (this.menuOptions[this.selectedOption]) {
      case "Resume":
        GAME_ENGINE.GAME_CONTROLLER.togglePause();
        break;
      case "Settings":
        this.showSettingsMenu = true;
        break;
      case "Help":
        console.log("Opening Help Menu");
        this.showHelpMenu = true;
        break;
      case "Quit":
        window.location.reload();
        break;
    }
  }

}