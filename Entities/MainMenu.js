import { Entity } from "./Entities.js";

export class MainMenu extends Entity {
  constructor() {
    super();
    this.entityOrder = 99999999;
    this.isVisible = true;
    this.menuOptions = ["Start Game", "Help", "Quit"];
    this.selectedOption = 0;
  }

  setVisibility(visible) {
    this.isVisible = visible;
  }

  hide() {
    this.setVisibility(false);
  }

  show() {
    this.setVisibility(true);
  }

  update() {
    if (!this.isVisible) return;

    if (this.showHelp) {
      if (GAME_ENGINE.keys["Escape"] || GAME_ENGINE.keys["x"] ) {
        this.showHelp = false;
        GAME_ENGINE.keys["Escape"] = false;
      }
      return;
    }

    if (GAME_ENGINE.keys["ArrowUp"]) {
      this.selectedOption = (this.selectedOption - 1 + this.menuOptions.length) % this.menuOptions.length;
      GAME_ENGINE.keys["ArrowUp"] = false;
    }
    
    if (GAME_ENGINE.keys["ArrowDown"]) {
      this.selectedOption = (this.selectedOption + 1) % this.menuOptions.length;
      GAME_ENGINE.keys["ArrowDown"] = false;
    }
    

    if (GAME_ENGINE.keys["Enter"]) {
      this.executeSelectedOption();
      GAME_ENGINE.keys["Enter"] = false;
    }
  }

  draw(ctx) {
    if (!this.isVisible) return;

    const centerX = this.x / 2;
    const centerY = this.y / 2;

    const menuWidth = 700;
    const menuHeight = 600;
    const menuX = centerX - menuWidth / 2;
    const menuY = centerY - menuHeight / 2;

    const customFont = ASSET_MANAGER.getAsset("./assets/fonts/title.ttf");
    const gradient = ctx.createLinearGradient(0, 0, 10, 10);
    // gradient.addColorStop(0, "gray");
    // gradient.addColorStop(0, "white");
    // gradient.addColorStop(1, "gray");
    gradient.addColorStop(0, "#CFCBA0"); // Slightly darker shade for contrast
    gradient.addColorStop(0.5, "#F1EDB3"); // Main text color
    gradient.addColorStop(1, "#CFCBA0"); // Slightly darker shade
    ctx.fillStyle = gradient;
    //ctx.fillStyle = "#F1EDB3";

    //ctx.fillStyle = "gray";
    ctx.font = `165px title `;
    
    ctx.fillText(`CURSED REVOLVER`, -350, -100);

    const buttonWidth = 280;
    const buttonHeight = 90;

    const startX = centerX - buttonWidth / 2;
    const startY = menuY + 230;

    const quitX = centerX - buttonWidth / 2;
    const quitY = menuY + 450;

    const helpX = centerX - buttonWidth / 2;
    const helpY = menuY + 340;

    if (this.showHelp) {
      this.drawHelp(ctx, centerX, centerY);
      return;
    }

    const startButton = ASSET_MANAGER.getAsset(
      "./assets/ui/menu/buttonStart.png"
    );
    if (startButton) {
      if (this.selectedOption === 0) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 5;
        ctx.strokeRect(
          startX - 5,
          startY - 5,
          buttonWidth + 10,
          buttonHeight + 10
        );
      }
      ctx.drawImage(startButton, startX, startY, buttonWidth, buttonHeight);
    }

        // **Help Button**
        const helpButton = ASSET_MANAGER.getAsset(
          "./assets/ui/menu/buttonHelp.png"
        );
        if (helpButton) {
          if (this.selectedOption === 1) {
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = 5;
            ctx.strokeRect(
              helpX - 5,
              helpY - 5,
              buttonWidth + 10,
              buttonHeight + 10
            );
          }
          ctx.drawImage(helpButton, helpX, helpY, buttonWidth, buttonHeight);
        }

    const quitButton = ASSET_MANAGER.getAsset(
      "./assets/ui/menu/buttonQuit.png"
    );
    if (quitButton) {
      if (this.selectedOption === 2) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 5;
        ctx.strokeRect(
          quitX - 5,
          quitY - 5,
          buttonWidth + 10,
          buttonHeight + 10
        );
      }
      ctx.drawImage(quitButton, quitX, quitY, buttonWidth, buttonHeight);
    }

    ctx.restore();
  }


  handleClick(mouseX, mouseY) {
    if (!this.isVisible) return;

    const buttonWidth = 280;
    const buttonHeight = 90;

    const centerX = this.x / 2;
    const centerY = this.y / 2;

    // Corrected menuY to match draw()
    const menuHeight = 600;
    const menuY = centerY - menuHeight / 2; // Same as draw()

    // Use same Y positions as draw()
    const startX = centerX - buttonWidth / 2;
    const startY = menuY + 230;

    const helpX = centerX - buttonWidth / 2;
    const helpY = menuY + 340;

    const quitX = centerX - buttonWidth / 2;
    const quitY = menuY + 450;

    // Check if "Start Game" is clicked
    if (
        mouseX >= startX &&
        mouseX <= startX + buttonWidth &&
        mouseY >= startY &&
        mouseY <= startY + buttonHeight
    ) {
        this.selectedOption = 0;
        this.executeSelectedOption();
    }

    // Check if "Help" is clicked
    if (
        mouseX >= helpX &&
        mouseX <= helpX + buttonWidth &&
        mouseY >= helpY &&
        mouseY <= helpY + buttonHeight
    ) {
        this.selectedOption = 1;
        this.executeSelectedOption();
    }

    // Check if "Quit" is clicked
    if (
        mouseX >= quitX &&
        mouseX <= quitX + buttonWidth &&
        mouseY >= quitY &&
        mouseY <= quitY + buttonHeight
    ) {
        this.selectedOption = 2;
        this.executeSelectedOption();
    }
}


  executeSelectedOption() {
    const selectedOption = this.menuOptions[this.selectedOption];

    if (selectedOption === "Start Game") {
        this.hide();
        document.getElementById("gameWorld").style.backgroundImage = "none";
        GAME_ENGINE.startGame();
    } else if (selectedOption === "Help") {
        this.showHelp = true;
    }  else if (selectedOption === "Quit") {
       window.location.reload();
    }
  }


  drawHelp(ctx, centerX, centerY) {
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
}
