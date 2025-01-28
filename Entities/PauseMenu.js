import { Entity } from "./Entities.js";

export class PauseMenu extends Entity {
  constructor() {
    super();
    this.entityOrder = 9999999; // Render above all other entities
    this.isVisible = false; // Initially hidden
    this.menuOptions = ["Resume", "Quit"]; // Menu options
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
    if (!this.isVisible) return; // Skip updates if not visible

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
    if (!this.isVisible) return; // Skip drawing if not visible

    // Draw the semi-transparent background
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw the menu title
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Paused", ctx.canvas.width / 2, 200);

    // Draw the menu options
    this.menuOptions.forEach((option, index) => {
      ctx.fillStyle = index === this.selectedOption ? "yellow" : "white";
      ctx.fillText(option, ctx.canvas.width / 2, 250 + index * 40);
    });

    ctx.restore();
  }
}
