import { Entity } from "./Entities.js";

export class PauseMenu extends Entity {
  constructor() {
    super();
    this.entityOrder = 99999999;
    this.isVisible = false;
    this.menuOptions = ["Resume", "Settings", "Help", "Quit"];
    this.selectedOption = 0;
    this.showHelpMenu = false; // Renamed for clarity
    this.buttonPositions = {}; // Store button positions for click detection
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

    // **Close Help Menu if "X" key is pressed**
    if (this.showHelpMenu && GAME_ENGINE.keys["x"]) {
      console.log("Closing Help Menu via 'X' key");
      this.showHelpMenu = false;
      GAME_ENGINE.keys["x"] = false; // Prevent repeated input
      return;
    }

    // **Close Help Menu if "Escape" key is pressed**
    if (this.showHelpMenu && GAME_ENGINE.keys["Escape"]) {
      console.log("Closing Help Menu via 'Escape' key");
      this.showHelpMenu = false;
      GAME_ENGINE.keys["Escape"] = false; // Prevent repeated input
      return;
    }

    // **If Help Menu is open, prevent further navigation**
    if (this.showHelpMenu) return;

    // **Toggle Pause Menu with Escape Key**
    if (GAME_ENGINE.keys["Escape"]) {
      console.log("Toggling Pause Menu via Escape");
      this.setVisibility(!this.isVisible);
      GAME_ENGINE.keys["Escape"] = false;
    }

    // Navigate menu options
    if (GAME_ENGINE.keys["ArrowUp"]) {
      this.selectedOption = (this.selectedOption - 1 + this.menuOptions.length) % this.menuOptions.length;
      GAME_ENGINE.keys["ArrowUp"] = false;
    }

    if (GAME_ENGINE.keys["ArrowDown"]) {
      this.selectedOption = (this.selectedOption + 1) % this.menuOptions.length;
      GAME_ENGINE.keys["ArrowDown"] = false;
    }

    // Confirm selection
    if (GAME_ENGINE.keys["Enter"]) {
      this.executeSelectedOption();
      GAME_ENGINE.keys["Enter"] = false;
    }
  }

  draw(ctx) {
    if (!this.isVisible) return;

    const centerX = this.x / 2;
    const centerY = this.y / 2;

    if (this.showHelpMenu) {
      this.drawHelpMenu(ctx, centerX, centerY);
      return;
    }

    this.drawPauseMenu(ctx, centerX, centerY);
  }

  drawPauseMenu(ctx, centerX, centerY) {
    const menuWidth = 330;
    const menuHeight = 450;
    const menuX = centerX - menuWidth / 2;
    const menuY = centerY - menuHeight / 2;

    // Draw Background
    const backgroundImage = ASSET_MANAGER.getAsset("./assets/ui/menu/menuBackground.png");
    if (backgroundImage) {
      ctx.drawImage(backgroundImage, menuX, menuY, menuWidth, menuHeight);
    }

    // Button Positions
    this.buttonPositions = {
      Resume: { x: centerX - 125, y: menuY + 100 },
      Settings: { x: centerX - 125, y: menuY + 170 },
      Help: { x: centerX - 125, y: menuY + 240 },
      Quit: { x: centerX - 125, y: menuY + 310 }
    };

    // Draw Buttons
    this.drawButton(ctx, "Resume", "./assets/ui/menu/buttonResume.png", 0);
    this.drawButton(ctx, "Settings", "./assets/ui/menu/buttonSettings.png", 1);
    this.drawButton(ctx, "Help", "./assets/ui/menu/buttonHelp.png", 2);
    this.drawButton(ctx, "Quit", "./assets/ui/menu/buttonQuit.png", 3);
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
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(centerX - 350, centerY - 200, 700, 400);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("How to Play", centerX, centerY - 150);

    ctx.font = "24px Arial";
    ctx.textAlign = "left";

    const tutorialText = [
      "A  - Move Left",
      "D  - Move Right",
      "Space - Jump",
      "Shift - Dash",
      "Num Keys (1-6) - Switch Spells",
      "Click - Shoot",
      "Enemies drop potions when killed"
    ];

    tutorialText.forEach((text, index) => {
      ctx.fillText(text, centerX - 300, centerY - 100 + index * 35);
    });

    ctx.font = "20px Arial";
    ctx.fillStyle = "yellow";
    ctx.fillText("Press 'X' or 'ESC' to exit", centerX - 80, centerY + 160);
  }

  handleClick(mouseX, mouseY) {
    if (!this.isVisible) return;

    // **If Help Menu is Open, Ignore Other Clicks**
    if (this.showHelpMenu) return;

    // Handle menu clicks
    Object.entries(this.buttonPositions).forEach(([label, pos], index) => {
      if (
        mouseX >= pos.x && mouseX <= pos.x + 250 &&
        mouseY >= pos.y && mouseY <= pos.y + 60
      ) {
        this.selectedOption = index;
        this.executeSelectedOption();
      }
    });
  }

  executeSelectedOption() {
    const selectedOption = this.menuOptions[this.selectedOption];

    if (selectedOption === "Resume") {
      GAME_ENGINE.GAME_CONTROLLER.togglePause();
    } else if (selectedOption === "Settings") {
      console.log("Settings button clicked (not implemented)");
    } else if (selectedOption === "Help") {
      console.log("Help button clicked - Showing help menu");
      this.showHelpMenu = true;
    } else if (selectedOption === "Quit") {
      window.location.reload();
    }
  }
}


