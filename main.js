import { GameEngine } from "./Core/GameEngine.js";
import { AssetManager } from "./Core/AssetManager.js";
import { GameLogicController } from "./Core/GameLogicController.js";
import { AssetDownloader } from "./Core/AssetDownloader.js";

// Singleton instances
export const GAME_ENGINE = new GameEngine();
window.GameEngine = GAME_ENGINE; // Assign to global window object

const ASSET_MANAGER = new AssetManager();

const ASSET_DOWNLOADER = new AssetDownloader(ASSET_MANAGER);
// Loading Sprite Sheets

ASSET_DOWNLOADER.downloadAll();



ASSET_MANAGER.downloadAll(() => {
  const canvas = document.getElementById("gameWorld");
  const ctx = canvas.getContext("2d");

  GAME_ENGINE.init(ctx);

  //GAME_ENGINE.addEntity(new GameLogicController());

  GAME_ENGINE.start();
});
