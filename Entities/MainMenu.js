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
    if (!this.isVisible) return;

    if (this.showHelp) {
      if (GAME_ENGINE.keys["Escape"]) {
        this.showHelp = false;
        GAME_ENGINE.keys["Escape"] = false;
      }
      return;
    }

    if (GAME_ENGINE.keys["ArrowUp"]) {
      this.selectedOption = (this.selectedOption - 1 + 3) % 3;
      GAME_ENGINE.keys["ArrowUp"] = false;
    }

    if (GAME_ENGINE.keys["ArrowDown"]) {
      this.selectedOption = (this.selectedOption + 1) % 3;
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

    // const backgroundImage = ASSET_MANAGER.getAsset(
    //   "./assets/ui/menu/background_start2.png"
    // );

    // if (backgroundImage) {
    //   ctx.drawImage(backgroundImage, menuX, menuY, menuWidth, menuHeight);
    // }

    const buttonWidth = 280;
    const buttonHeight = 90;

    const startX = centerX - buttonWidth / 2;
    const startY = menuY + 230;

    const quitX = centerX - buttonWidth / 2;
    const quitY = menuY + 450;

    const helpX = centerX - buttonWidth / 2;
    const helpY = menuY + 340; 

    if (this.showHelp) {
      this.drawSettings(ctx, centerX, centerY);
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

    const quitButton = ASSET_MANAGER.getAsset(
      "./assets/ui/menu/buttonQuit.png"
    );
    if (quitButton) {
      if (this.selectedOption === 1) {
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

    // **Help Button**
    const helpButton = ASSET_MANAGER.getAsset(
      "./assets/ui/menu/buttonHelp.png"
    );
    if (helpButton) {
      if (this.selectedOption === 2) {
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
    if (
      mouseX >= startX &&
      mouseX <= startX + buttonWidth &&
      mouseY >= startY &&
      mouseY <= startY + buttonHeight
    ) {
      this.selectedOption = 0; // "Start Game" is selected
    }

    if (
      mouseX >= quitX &&
      mouseX <= quitX + buttonWidth &&
      mouseY >= quitY &&
      mouseY <= quitY + buttonHeight
    ) {
      this.selectedOption = 1; // "Quit" is selected
    }

    // Simulate pressing "Enter" after selecting
    this.executeSelectedOption();
  }

  executeSelectedOption() {
    const selectedOption = this.selectedOption;

    if (selectedOption === 0) {
      this.hide();
      GAME_ENGINE.startGame();
    } else if (selectedOption === 1) {
      window.location.reload();
    } else if (selectedOption === 2) {
      // Help option
      this.showHelp = true;
    }
  }

  drawSettings(ctx, centerX, centerY) {
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
      "Cowboy Enemies drop health potions when killed",
      "Tumbleweeds can be set on fire using fireball",
      "Fireball detonates barrels",
    ];

    tutorialText.forEach((text, index) => {
      ctx.fillText(text, centerX - 300, centerY - 100 + index * 35);
    });

    ctx.font = "20px Arial";
    ctx.fillStyle = "yellow";
    ctx.fillText("Press ESC to return", centerX - 80, centerY + 240);
  }
}
