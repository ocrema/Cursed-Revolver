import { Entity } from "../Entities/Entities.js";
import { Map } from "../Entities/Map/Map.js";
import { HUD } from "../Entities/HUD.js";
import { PauseMenu } from "../Entities/PauseMenu.js";
import { Wizard } from "../Entities/Enemy/Wizard.js";

export class GameLogicController extends Entity {
  constructor() {
    super();
    this.GAME_ENGINE = window.GameEngine;
   // this.hud = new HUD(map, this.settings); // Pass settings to HUD
    this.GAME_ENGINE.addEntity(this.hud);

    this.entityOrder = -1; // Ensure it updates early in the loop
    this.state = 0; // Game initialization state
    this.isPaused = false; // Pause state
    this.isGameOver = false;

    // Global Settings
    this.settings = {
      musicOn: true,
      sfxOn: true,
      debugMode: false,
      showFPS: false,  // Ensure FPS Display setting exists
    };

    const savedSettings = localStorage.getItem("gameSettings");
    if (savedSettings) {
        Object.assign(this.settings, JSON.parse(savedSettings)); // Merge saved settings
    }
    
  

    // Create and add the pause menu
    this.pauseMenu = new PauseMenu(this); // Pass GameLogicController as an argument
    this.pauseMenu.setVisibility(false); // Use setVisibility() instead of hide()
    
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
      window.ASSET_MANAGER.playTrack(1);
      const map = new Map();
      this.GAME_ENGINE.addEntity(map);
      map.load();
      this.hud = new HUD(map);
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

  // applySettings() {
  //   if (!this.settings) return;

  //   ASSET_MANAGER.toggleMusicMute(!this.settings.musicOn);
  //   ASSET_MANAGER.toggleMute(!this.settings.sfxOn);

  //   GAME_ENGINE.debug_colliders = this.settings.debugMode;
  //   console.log(`Debug Mode: ${this.settings.debugMode ? "ON" : "OFF"}`);

  //   // Ensure HUD updates when FPS setting changes
  //   if (this.hud) {
  //       this.hud.settings = this.settings; // Update HUD settings
  //   }

  //   localStorage.setItem("gameSettings", JSON.stringify(this.settings)); // Save settings
  // }

  toggleMusic() {
    this.settings.musicOn = !this.settings.musicOn;
    ASSET_MANAGER.toggleMusicMute(!this.settings.musicOn);
    localStorage.setItem("gameSettings", JSON.stringify(this.settings));
    console.log(`Music: ${this.settings.musicOn ? "ON" : "OFF"}`);
  }

  toggleSFX() {
      this.settings.sfxOn = !this.settings.sfxOn;
      ASSET_MANAGER.toggleMute(!this.settings.sfxOn);
      localStorage.setItem("gameSettings", JSON.stringify(this.settings));
      console.log(`Sound Effects: ${this.settings.sfxOn ? "ON" : "OFF"}`);
  }

  toggleDebug() {
      this.settings.debugMode = !this.settings.debugMode;
      GAME_ENGINE.debug_colliders = this.settings.debugMode;
      localStorage.setItem("gameSettings", JSON.stringify(this.settings));
      console.log(`Debug Mode: ${this.settings.debugMode ? "ON" : "OFF"}`);
  }

  toggleFPS() {
      this.settings.showFPS = !this.settings.showFPS;
      if (this.hud) {
          this.hud.settings = this.settings; // Update HUD settings
      }
      localStorage.setItem("gameSettings", JSON.stringify(this.settings));
      console.log(`FPS Display: ${this.settings.showFPS ? "ON" : "OFF"}`);
  }


}
