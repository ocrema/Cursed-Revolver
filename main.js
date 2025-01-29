import { GameEngine } from "./Core/GameEngine.js";
import { AssetManager } from "./Core/AssetManager.js";
import { GameLogicController } from "./Core/GameLogicController.js";


// Singleton instances
export const GAME_ENGINE = new GameEngine();
window.GameEngine = GAME_ENGINE; // Assign to global window object

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
ASSET_MANAGER.queueDownload("./assets/ui/spells/fireball.png");

// Loading Revolver Cylinder Sprites (Cylinder 1 to 10)
for (let i = 1; i <= 10; i++) {
  ASSET_MANAGER.queueDownload(`./assets/ui/revolver/cylinder${i}.png`);
}

ASSET_MANAGER.downloadAll(() => {
  const canvas = document.getElementById("gameWorld");
  const ctx = canvas.getContext("2d");

  GAME_ENGINE.init(ctx);

  GAME_ENGINE.addEntity(new GameLogicController());

  GAME_ENGINE.start();
});
