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
// Player
// ASSET_MANAGER.queueDownload("./assets/player/Idle.png");
// ASSET_MANAGER.queueDownload("./assets/player/Run.png");
// ASSET_MANAGER.queueDownload("./assets/player/Jump.png");
// ASSET_MANAGER.queueDownload("./assets/player/Death.png");
// ASSET_MANAGER.queueDownload("./assets/player/Fall.png");

// // Enemy
// ASSET_MANAGER.queueDownload("./assets/cactus/cactus.png");

// // Enemy Attack
// ASSET_MANAGER.queueDownload("./assets/thorn/thorn.png");

// // Background
// ASSET_MANAGER.queueDownload("./assets/background/background.png");

// Pause Menu Buttons
ASSET_MANAGER.queueDownload("./assets/ui/menu/buttonResume.png");
ASSET_MANAGER.queueDownload("./assets/ui/menu/buttonSettings.png");
ASSET_MANAGER.queueDownload("./assets/ui/menu/buttonQuit.png");
ASSET_MANAGER.queueDownload("./assets/ui/menu/buttonStart.png");
ASSET_MANAGER.queueDownload("./assets/ui/menu/menuBackground.png");
ASSET_MANAGER.queueDownload("./assets/ui/menu/background_start.png");
ASSET_MANAGER.queueDownload("./assets/ui/menu/background_start2.png");
ASSET_MANAGER.queueDownload("./assets/ui/menu/desert.jpg");


//spells for hud
ASSET_MANAGER.queueDownload("./assets/ui/spells/fireball.gif");
ASSET_MANAGER.queueDownload("./assets/ui/spells/lightning.gif");
ASSET_MANAGER.queueDownload("./assets/ui/spells/water.gif");
ASSET_MANAGER.queueDownload("./assets/ui/spells/icicle.gif");
ASSET_MANAGER.queueDownload("./assets/ui/spells/vine.gif");
ASSET_MANAGER.queueDownload("./assets/ui/spells/void.gif");

//cowboy
ASSET_MANAGER.queueDownload("./assets/ui/cowboy.png");


//healthbar
ASSET_MANAGER.queueDownload("./assets/ui/cowboy.png");
ASSET_MANAGER.queueDownload("./assets/ui/healthbar.png");

// Loading Revolver Cylinder Sprites (Cylinder 1 to 10)
for (let i = 1; i <= 10; i++) {
  ASSET_MANAGER.queueDownload(`./assets/ui/revolver/cylinder${i}.png`);
}

ASSET_MANAGER.downloadAll(() => {
  const canvas = document.getElementById("gameWorld");
  const ctx = canvas.getContext("2d");

  GAME_ENGINE.init(ctx);

  //GAME_ENGINE.addEntity(new GameLogicController());

  GAME_ENGINE.start();
});
