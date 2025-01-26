const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

// Loading Sprite Sheets

// Player
ASSET_MANAGER.queueDownload("./assets/player/Idle.png");
ASSET_MANAGER.queueDownload("./assets/player/Run.png");
ASSET_MANAGER.queueDownload("./assets/player/Jump.png");

//Background
ASSET_MANAGER.queueDownload("./assets/background/background.png");

ASSET_MANAGER.downloadAll(() => {
  const canvas = document.getElementById("gameWorld");
  const ctx = canvas.getContext("2d");

  gameEngine.init(ctx);

  gameEngine.addEntity(new GameLogicController());

  gameEngine.start();
});
