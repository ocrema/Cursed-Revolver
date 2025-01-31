import { Entity } from "./Entities.js";

export class MainMenu extends Entity {
  constructor() {
    super();
    this.entityOrder = 99999999; 
    this.isVisible = true; 
    this.menuOptions = ["Start Game", "Quit"]; 
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
    if (!this.isVisible) {
      return;
    }

    // Navigate through menu options
    if (GAME_ENGINE.keys["ArrowUp"]) {
      this.selectedOption =
        (this.selectedOption - 1 + this.menuOptions.length) %
        this.menuOptions.length;
      GAME_ENGINE.keys["ArrowUp"] = false;
    }

    if (GAME_ENGINE.keys["ArrowDown"]) {
      this.selectedOption =
        (this.selectedOption + 1) % this.menuOptions.length;
      GAME_ENGINE.keys["ArrowDown"] = false;
    }

     // Handle menu selection
    if (GAME_ENGINE.keys["Enter"]) {
      this.executeSelectedOption();
      GAME_ENGINE.keys["Enter"] = false;
    }
  }

  draw(ctx) {
    if (!this.isVisible) {
      return;
    }

    // Get canvas dimensions
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    const centerX = this.x / 2;
    const centerY = this.y / 2;

    // Define menu dimensions
    const menuWidth = 700;
    const menuHeight = 500;

    // Calculate the top-left corner of the menu
    const menuX = centerX - menuWidth / 2;
    const menuY = centerY - menuHeight / 2;

    // Draw menu background image
    const backgroundImage = ASSET_MANAGER.getAsset("./assets/ui/menu/background_start2.png");
    if (backgroundImage) {
      ctx.drawImage(backgroundImage, menuX, menuY, menuWidth, menuHeight);
    }

    // Draw game title
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    //ctx.fillText("Sixfold Curse", centerX, menuY + 50);

    // Button dimensions
    const buttonWidth = 280;
    const buttonHeight = 90;

    // Button positions
    const startX = centerX - buttonWidth / 2;
    const startY = menuY + 230;

    const quitX = centerX - buttonWidth / 2;
    const quitY = menuY + 340;

    // Draw buttons with PNG images
    const startButton = ASSET_MANAGER.getAsset("./assets/ui/menu/buttonStart.png");
    if (startButton) {
      if (this.selectedOption === 0) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 5;
        ctx.strokeRect(startX - 5, startY - 5, buttonWidth + 10, buttonHeight + 10);
      }
      ctx.drawImage(startButton, startX, startY, buttonWidth, buttonHeight);
    }

    const quitButton = ASSET_MANAGER.getAsset("./assets/ui/menu/buttonQuit.png");
    if (quitButton) {
      if (this.selectedOption === 1) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 5;
        ctx.strokeRect(quitX - 5, quitY - 5, buttonWidth + 10, buttonHeight + 10);
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
  
    const startX = centerX - buttonWidth / 2;
    const startY = centerY + 230;
  
    const quitX = centerX - buttonWidth / 2;
    const quitY = centerY + 340;
  
    // Update selection if clicking on a button
    if (mouseX >= startX && mouseX <= startX + buttonWidth &&
        mouseY >= startY && mouseY <= startY + buttonHeight) {
      this.selectedOption = 0; // "Start Game" is selected
    }
  
    if (mouseX >= quitX && mouseX <= quitX + buttonWidth &&
        mouseY >= quitY && mouseY <= quitY + buttonHeight) {
      this.selectedOption = 1; // "Quit" is selected
    }
  
    // Simulate pressing "Enter" after selecting
    this.executeSelectedOption();
  }

  executeSelectedOption() {
    const selectedOption = this.menuOptions[this.selectedOption];
  
    if (selectedOption === "Start Game") {
      this.hide();
      GAME_ENGINE.startGame();
    } else if (selectedOption === "Quit") {
      window.location.reload();
    }
  }
  
  
  
}