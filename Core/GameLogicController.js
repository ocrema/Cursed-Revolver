import { Entity } from "../Entities/Entities.js";
import { Map } from "../Entities/Map/Map.js";
import { HUD } from "../Entities/HUD.js";
import { PauseMenu } from "../Entities/PauseMenu.js";
import { Wizard } from "../Entities/Enemy/Wizard.js";

export class GameLogicController extends Entity {
  constructor() {
    super();
    this.GAME_ENGINE = window.GameEngine;
    this.GAME_ENGINE.addEntity(this.hud);

    this.entityOrder = -1; // Ensure it updates early in the loop
    this.state = 0; // Game initialization state
    this.isPaused = false; // Pause state
    this.isGameOver = false;

    // Global Settings
    this.settings = {
      musicOn: true,
      sfxOn: true,
      muteAll: false,
      debugMode: false,
      showFPS: false, // Ensure FPS Display setting exists
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

    window.MAP.spawnEntities(window.MAP.gamemap);

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

  toggleMusic(state) {
    if (this.settings.musicOn === state) return; // Prevent redundant toggling
    this.settings.musicOn = state;
    ASSET_MANAGER.toggleMusicMute(!state);
    this.saveSettings();
    console.log(`Music: ${state ? "ON" : "OFF"}`);
  }

  toggleSFX(state) {
    if (this.settings.sfxOn === state) return;
    this.settings.sfxOn = state;
    ASSET_MANAGER.toggleMute(!state);
    this.saveSettings();
    console.log(`Sound Effects: ${state ? "ON" : "OFF"}`);
  }

  // toggleDebug(state) {
  //   if (this.settings.debugMode === state) return;
  //   this.settings.debugMode = state;
  //   GAME_ENGINE.debug_colliders = state;

  //   // Disable music and mute all when debug mode is ON
  //   if (state) {
  //     this.toggleMuteAll(true);
  //     this. toggleMusic(true);
  //     //this.toggleSFX(true);
  //   }

  //   this.saveSettings();
  //   console.log(`Debug Mode: ${state ? "ON" : "OFF"}`);
  // }

  toggleDebug(state) {
    if (this.hud && this.hud.debugMode !== state) {
      this.hud.debugMode = state;
      this.toggleMuteAll(state);
      GAME_ENGINE.debug_colliders = state; // Enable/Disable collider visuals
      console.log(`Debug Mode: ${state ? "ON" : "OFF"}`);
    }
  }

  toggleFPS(state) {
    if (this.settings.showFPS === state) return;
    this.settings.showFPS = state;
    if (this.hud) this.hud.settings = this.settings;
    this.saveSettings();
    console.log(`FPS Display: ${state ? "ON" : "OFF"}`);
  }

  toggleMuteAll(state) {
    if (this.settings.muteAll === state) return;

    this.settings.muteAll = state;
    this.toggleMusic(!state);
    this.toggleSFX(!state);

    this.saveSettings();
    console.log(`Mute All: ${state ? "ON" : "OFF"}`);
  }

  saveSettings() {
    localStorage.setItem("gameSettings", JSON.stringify(this.settings));
  }
}
