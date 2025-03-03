import { Entity } from "../Entities/Entities.js";
import { Map } from "../Entities/Map/Map.js";
import { HUD } from "../Entities/HUD.js";
import { PauseMenu } from "../Entities/PauseMenu.js";

export class GameLogicController extends Entity {
  constructor() {
    super();
    this.GAME_ENGINE = window.GameEngine;
    this.entityOrder = -1; // Ensure it updates early in the loop
    this.state = 0; // Game initialization state
    this.isPaused = false; // Pause state
    this.isGameOver = false; 

    // Create and add the pause menu
    this.pauseMenu = new PauseMenu();
    this.pauseMenu.hide(); // Initially hide the menu
    this.GAME_ENGINE.addEntity(this.pauseMenu);

    // Storing hud as an entity to be constructed later
    this.hud = null;

    // Register this as the game controller
    this.GAME_ENGINE.GAME_CONTROLLER = this;
  }

  togglePause() {
    if (this.isGameOver) return; // Don't allow pause when game over
    this.isPaused = !this.isPaused;
    this.pauseMenu.setVisibility(this.isPaused);
  }

  setGameOver() {
    this.isGameOver = true;
    this.isPaused = true;
  }

  restartGame() {
    console.log("Reloading game...");

    if (this.hud.gameWon) {
      window.location.reload(); // Reloads the game (resets everything)
      return;
    }

    for (let entity of GAME_ENGINE.entities) {
      if (entity.isPlayer) {
        entity.respawn();
      }
    }

    this.isGameOver = false;
    this.isPaused = false;

    
    // window.location.reload(); // Reloads the game (resets everything)
  }

  update() {
    // Initialize the game
    if (this.state === 0) {
      this.state = 1;
      const map = new Map();
      this.GAME_ENGINE.addEntity(map);
      map.load();
      this.hud = new HUD();
      this.GAME_ENGINE.addEntity(this.hud);
    }

    if (this.isGameOver) {
      return; // Prevent further updates when game over
    }

    // Toggle pause menu
    if (this.GAME_ENGINE.keys["Escape"]) {
      this.togglePause();
      this.GAME_ENGINE.keys["Escape"] = false; // Prevent repeated toggling
    }

    // Skip updates when the game is paused
    if (this.isPaused) return;

    // Add additional game logic here
  }
}
