import { GameEngine } from "./Core/GameEngine.js";
import { AssetManager } from "./Core/AssetManager.js";
import { GameLogicController } from "./Core/GameLogicController.js";

// Singleton instances
const GAME_ENGINE = new GameEngine();

const ASSET_MANAGER = new AssetManager();

// Loading Sprite Sheets

// Player
ASSET_MANAGER.queueDownload("./assets/player/Idle.png");
ASSET_MANAGER.queueDownload("./assets/player/Run.png");
ASSET_MANAGER.queueDownload("./assets/player/Jump.png");
ASSET_MANAGER.queueDownload("./assets/player/Death.png");

ASSET_MANAGER.queueDownload("./assets/cactus/cactus.png");

ASSET_MANAGER.queueDownload("./assets/thorn/thorn.png");

//Background
ASSET_MANAGER.queueDownload("./assets/background/background.png");

ASSET_MANAGER.downloadAll(() => {
  const canvas = document.getElementById("gameWorld");
  const ctx = canvas.getContext("2d");

  GAME_ENGINE.init(ctx);

  GAME_ENGINE.addEntity(new GameLogicController());

  GAME_ENGINE.start();
});
