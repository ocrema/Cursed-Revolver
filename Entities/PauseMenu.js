import { Entity } from "./Entities.js";

export class PauseMenu extends Entity {
  constructor() {
    super();
    this.entityOrder = 99999999; 
    this.isVisible = false; 
    this.menuOptions = ["Resume", "Settings", "Quit"]; 
    this.selectedOption = 0; 
    this.showSettings = false;
  }

  setVisibility(visible) {
   //console.log(`Setting PauseMenu visibility to: ${visible}`);

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
      //console.log("PauseMenu is hidden, skipping update");
      return;
    }

    if (this.showSettings) {
      // **Exit settings menu when pressing Escape**
      if (GAME_ENGINE.keys["Escape"]) {
        this.showSettings = false;
        //this.show();
        GAME_ENGINE.keys["Escape"] = false;
        return;
      }
      //return;
    }

    console.log("PauseMenu is updating");

    // Navigate through menu options
    if (GAME_ENGINE.keys["ArrowUp"]) {
      this.selectedOption =
        (this.selectedOption - 1 + this.menuOptions.length) %
        this.menuOptions.length; // Wrap around to the last option
      GAME_ENGINE.keys["ArrowUp"] = false; // Prevent repeated input
      //console.log("ArrowUp pressed, selectedOption:", this.selectedOption);
    }

    if (GAME_ENGINE.keys["ArrowDown"]) {
      this.selectedOption =
        (this.selectedOption + 1) % this.menuOptions.length; // Wrap around to the first option
      GAME_ENGINE.keys["ArrowDown"] = false; // Prevent repeated input
      //console.log("ArrowDown pressed, selectedOption:", this.selectedOption);
    }

    // Handle menu selection
    if (GAME_ENGINE.keys["Enter"]) {
      this.executeSelectedOption();
      GAME_ENGINE.keys["Enter"] = false;
    }
  }


  draw(ctx) {
    if (!this.isVisible) {
      //console.log("PauseMenu is hidden, skipping draw");
      return;
    }
  
    //console.log("Drawing PauseMenu");
  
    // Calculate the center of the screen
    const centerX = this.x / 2;
    const centerY = this.y / 2;
  

    if (this.showSettings) {
      this.drawSettings(ctx, centerX, centerY);
      return;
    }

    // Define menu dimensions (adjust as needed)
    const menuWidth = 330; // Width of the pause menu
    const menuHeight = 330; // Height of the pause menu
  
    // Calculate the top-left corner of the menu to center it
    const menuX = centerX - menuWidth / 2;
    const menuY = centerY - menuHeight / 2;
  
    // Draw menu background image
    const backgroundImage = ASSET_MANAGER.getAsset("./assets/ui/menu/menuBackground.png");
    if (backgroundImage) {
      ctx.drawImage(backgroundImage, menuX, menuY, menuWidth, menuHeight);
    }
  
    // Button dimensions
    const buttonWidth = 250;
    const buttonHeight = 60;
  
    // Button Positions
    const resumeX = centerX - buttonWidth / 2;
    const resumeY = menuY + 70;
  
    const settingsX = centerX - buttonWidth / 2;
    const settingsY = menuY + 140;
  
    const quitX = centerX - buttonWidth / 2;
    const quitY = menuY + 210;
  
    // Draw buttons with PNG images
    const resumeButton = ASSET_MANAGER.getAsset("./assets/ui/menu/buttonResume.png");
    if (resumeButton) {
      if (this.selectedOption === 0) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 5;
        ctx.strokeRect(resumeX - 5, resumeY - 5, buttonWidth + 10, buttonHeight + 10);
      }
      ctx.drawImage(resumeButton, resumeX, resumeY, buttonWidth, buttonHeight);
    }
  
    const settingsButton = ASSET_MANAGER.getAsset("./assets/ui/menu/buttonSettings.png");
    if (settingsButton) {
      if (this.selectedOption === 1) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 5;
        ctx.strokeRect(settingsX - 5, settingsY - 5, buttonWidth + 10, buttonHeight + 10);
      }
      ctx.drawImage(settingsButton, settingsX, settingsY, buttonWidth, buttonHeight);
    }
  
    const quitButton = ASSET_MANAGER.getAsset("./assets/ui/menu/buttonQuit.png");
    if (quitButton) {
      if (this.selectedOption === 2) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 5;
        ctx.strokeRect(quitX - 5, quitY - 5, buttonWidth + 10, buttonHeight + 10);
      }
      ctx.drawImage(quitButton, quitX, quitY, buttonWidth, buttonHeight);
    }
  
    ctx.restore();
  }  

  drawSettings(ctx, centerX, centerY) {
    // **Draw a semi-transparent black background**
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(centerX - 350, centerY - 200, 700, 400);

    // **Draw title**
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("How to Play", centerX, centerY - 150);

    // **Draw tutorial instructions**
    ctx.font = "24px Arial";
    ctx.textAlign = "left";

    const tutorialText = [
      "A  - Move Left",
      "D  - Move Right",
      "Space - Jump",
      "Shift - Dash",
      "Num Keys (1-6) - Switch Spells",
      "Click - Shoot",
      "Enemies drop potions when killed",
    ];

    tutorialText.forEach((text, index) => {
      ctx.fillText(text, centerX - 300, centerY - 100 + index * 35);
    });

    // **Display a hint for exiting tutorial**
    ctx.font = "20px Arial";
    ctx.fillStyle = "yellow";
    ctx.fillText("Press ESC to return", centerX-80, centerY + 160);
  }

  handleClick(mouseX, mouseY) {
    if (!this.isVisible) return;
  
    const buttonWidth = 250;
    const buttonHeight = 60;
  
    const centerX = this.x / 2;
    const centerY = this.y / 2;
  
    // Button Positions
    const resumeX = centerX - buttonWidth / 2;
    const resumeY = centerY - 95;
  
    const settingsX = centerX - buttonWidth / 2;
    const settingsY = centerY - 25;
  
    const quitX = centerX - buttonWidth / 2;
    const quitY = centerY + 45;
  
    // Update selection if clicking on a button
    if (mouseX >= resumeX && mouseX <= resumeX + buttonWidth &&
        mouseY >= resumeY && mouseY <= resumeY + buttonHeight) {
      this.selectedOption = 0; // "Resume" selected
    }
  
    if (mouseX >= settingsX && mouseX <= settingsX + buttonWidth &&
        mouseY >= settingsY && mouseY <= settingsY + buttonHeight) {
      this.selectedOption = 1; // "Settings" selected
    }
  
    if (mouseX >= quitX && mouseX <= quitX + buttonWidth &&
        mouseY >= quitY && mouseY <= quitY + buttonHeight) {
      this.selectedOption = 2; // "Quit" selected
    }
  
    // Simulate pressing "Enter" after selecting
    this.executeSelectedOption();
  }
  
  executeSelectedOption() {
    const selectedOption = this.menuOptions[this.selectedOption];
  
    if (selectedOption === "Resume") {
      GAME_ENGINE.GAME_CONTROLLER.togglePause();
    } else if (selectedOption === "Settings") {
      console.log("Settings button clicked (not implemented)");
      //this.isVisible = true;
      //this.showSettings = true; 
    } else if (selectedOption === "Quit") {
      window.location.reload();
    }
  }
  
}