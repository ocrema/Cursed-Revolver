import { Entity } from "./Entities.js";

export class PauseMenu extends Entity {
  constructor() {
    super();
    this.entityOrder = 99999999; // Render above all other entities
    this.isVisible = false; // Initially hidden
    this.menuOptions = ["Resume", "Settings", "Quit"]; // Menu options
    this.selectedOption = 0; // Default selected menu option
  }

  setVisibility(visible) {
    console.log(`Setting PauseMenu visibility to: ${visible}`); // Debug visibility
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
      console.log("PauseMenu is hidden, skipping update");
      return;
    }

    console.log("PauseMenu is updating");

    // Navigate through menu options
    if (GAME_ENGINE.keys["ArrowUp"]) {
      this.selectedOption =
        (this.selectedOption - 1 + this.menuOptions.length) %
        this.menuOptions.length; // Wrap around to the last option
      GAME_ENGINE.keys["ArrowUp"] = false; // Prevent repeated input
      console.log("ArrowUp pressed, selectedOption:", this.selectedOption);
    }

    if (GAME_ENGINE.keys["ArrowDown"]) {
      this.selectedOption =
        (this.selectedOption + 1) % this.menuOptions.length; // Wrap around to the first option
      GAME_ENGINE.keys["ArrowDown"] = false; // Prevent repeated input
      console.log("ArrowDown pressed, selectedOption:", this.selectedOption);
    }

    // Handle menu selection
    if (GAME_ENGINE.keys["Enter"]) {
      const selectedOption = this.menuOptions[this.selectedOption];
      if (selectedOption === "Resume") {
        //GAME_ENGINE.keys["Escape"] = true; // Trigger game resume
        GAME_ENGINE.GAME_CONTROLLER.togglePause();
      } else if (selectedOption === "Quit") {
        console.log("Quit selected");
        // Add logic for quitting the game (e.g., reload the page or navigate to the main menu)
        window.location.reload(); // Example: Reload the page to restart
      }
      GAME_ENGINE.keys["Enter"] = false; // Prevent repeated input
    }
  }

  draw(ctx) {
    if (!this.isVisible) {
      console.log("PauseMenu is hidden, skipping draw");
      return;
    }
  
    console.log("Drawing PauseMenu");
  
    // Calculate the center of the screen
    const centerX = this.x / 2;
    const centerY = this.y / 2;
  
    // Define menu dimensions (adjust as needed)
    const menuWidth = 330; // Width of the pause menu
    const menuHeight = 330; // Height of the pause menu
  
    // Calculate the top-left corner of the menu to center it
    const menuX = centerX - menuWidth / 2;
    const menuY = centerY - menuHeight / 2;
  
    // Draw menu background image
    const backgroundImage = ASSET_MANAGER.getAsset("./assets/ui/menuBackground.png");
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
    const resumeButton = ASSET_MANAGER.getAsset("./assets/ui/buttonResume.png");
    if (resumeButton) {
      if (this.selectedOption === 0) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 5;
        ctx.strokeRect(resumeX - 5, resumeY - 5, buttonWidth + 10, buttonHeight + 10);
      }
      ctx.drawImage(resumeButton, resumeX, resumeY, buttonWidth, buttonHeight);
    }
  
    const settingsButton = ASSET_MANAGER.getAsset("./assets/ui/buttonSettings.png");
    if (settingsButton) {
      if (this.selectedOption === 1) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 5;
        ctx.strokeRect(settingsX - 5, settingsY - 5, buttonWidth + 10, buttonHeight + 10);
      }
      ctx.drawImage(settingsButton, settingsX, settingsY, buttonWidth, buttonHeight);
    }
  
    const quitButton = ASSET_MANAGER.getAsset("./assets/ui/buttonQuit.png");
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

}
