import { Entity } from "../Entities/Entities.js";
import { GAME_ENGINE } from "../main.js";

export class PauseMenu extends Entity {
  constructor() {
    super();
    this.entityOrder = 99999; // Highest render priority
    this.paused = false;
    this.menuOptions = ["Resume", "Quit"];
    this.selectedOption = 0;
    this.removeFromWorld = false;
  }

  togglePause() {
    console.log(`Pause toggled: ${!this.paused}`);
    this.paused = !this.paused;
  }

  update() {
    // Ensure GAME_ENGINE.keys is initialized
    if (!GAME_ENGINE.keys) {
      console.warn("GAME_ENGINE.keys is not defined.");
      return;
    }

    // Toggle pause
    if (GAME_ENGINE.keys["Escape"]) {
      this.togglePause();
      GAME_ENGINE.keys["Escape"] = false; // Prevent repeat toggling
    }

    if (this.paused) {
      // Handle menu navigation
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
        const selectedOption = this.menuOptions[this.selectedOption];
        if (selectedOption === "Resume") {
          this.togglePause();
        } else if (selectedOption === "Quit") {
          console.log("Quit selected");
          // Add logic to quit or restart the game
        }
        GAME_ENGINE.keys["Enter"] = false;
      }
    }
  }

  draw(ctx) {
    if (!this.paused) return;

    // Draw semi-transparent background
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw menu title
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Paused", ctx.canvas.width / 2, 200);

    // Draw menu options
    this.menuOptions.forEach((option, index) => {
      ctx.fillStyle = index === this.selectedOption ? "yellow" : "white";
      ctx.fillText(option, ctx.canvas.width / 2, 250 + index * 40);
    });

    ctx.restore();
  }
}
