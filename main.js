import { GameEngine } from "./Core/GameEngine.js";
import { AssetManager } from "./Core/AssetManager.js";
import { AssetDownloader } from "./Core/AssetDownloader.js";

// Singleton instances
export const GAME_ENGINE = new GameEngine();
window.GameEngine = GAME_ENGINE; // Assign to global window object

const ASSET_MANAGER = new AssetManager();
window.ASSET_MANAGER = ASSET_MANAGER; // Assign to global window object
const ASSET_DOWNLOADER = new AssetDownloader(ASSET_MANAGER);

// Downloads all sprite sheets from asset downloader
ASSET_DOWNLOADER.downloadAll();

ASSET_MANAGER.downloadAll(() => {
  const canvas = document.getElementById("gameWorld");
  const ctx = canvas.getContext("2d");

  GAME_ENGINE.init(ctx);

  GAME_ENGINE.start();
});

window.addEventListener("keydown", (event) => {
  //console.log(`Key Pressed: ${event.key} (code: ${event.code})`);
});

