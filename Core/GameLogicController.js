import { Entity } from "../Entities/Entities.js";
import { Player } from "../Entities/Player.js";
import { Cactus } from "../Entities/Enemy.js";
import { Background } from "../Entities/Background.js";
import { Map1 } from "../Entities/Map1.js";
import { HUD } from "../Entities/HUD.js";
import { PauseMenu } from "../Entities/PauseMenu.js"; // Import the PauseMenu

export class GameLogicController extends Entity {
  constructor() {
    super();
    // Assigns game engine from window game engine singleton
    this.GAME_ENGINE = window.GameEngine;
    this.entityOrder = -1;
    this.state = 0;
    this.isPaused = false; // Pause state
    this.pauseMenu = null; // Placeholder for PauseMenu instance
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      // Pause game updates
      if (!this.pauseMenu) {
        this.pauseMenu = new PauseMenu();
        GAME_ENGINE.addEntity(this.pauseMenu);
      }
    } else {
      // Resume game updates
      GAME_ENGINE.entities = GAME_ENGINE.entities.filter(
        (entity) => !(entity instanceof PauseMenu)
      );
      this.pauseMenu = null;
    }
  }

  update() {
    // Handle game initialization
    if (this.state === 0) {
      this.state = 1;
      this.map = new Map1();
      GAME_ENGINE.addEntity(this.map);
      this.map.load();
      GAME_ENGINE.addEntity(new HUD());
    }

    // Toggle pause menu when 'Escape' is pressed
    if (GAME_ENGINE.keys["Escape"]) {
      this.togglePause();
      GAME_ENGINE.keys["Escape"] = false; // Prevent repeat toggling
    }

    // Skip game logic updates when paused
    if (this.isPaused) {
      return; // Stop updating game logic while paused
    }

    // Normal game logic updates (e.g., player actions, enemy movements)
    // Add any additional logic here if needed
  }
}



