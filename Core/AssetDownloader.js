export class AssetDownloader { 
  constructor(assetManager) {
    this.assetManager = assetManager;
  }

  downloadAll() {
    this.downloadPlayerAssets();
    this.downloadEnemyAssets();
    this.downloadEnemyAttackAssets();
    this.downloadBackgroundAssets();
  }

  downloadPlayerAssets() { 
    this.assetManager.queueDownload("./assets/player/Idle.png");
    this.assetManager.queueDownload("./assets/player/Run.png");
    this.assetManager.queueDownload("./assets/player/Jump.png");
    this.assetManager.queueDownload("./assets/player/Death.png");
    this.assetManager.queueDownload("./assets/player/Fall.png");
    this.assetManager.queueDownload("./assets/player/Hit.png");
  }

  downloadEnemyAssets() {
    this.assetManager.queueDownload("./assets/cactus/cactus.png");

    this.assetManager.queueDownload("./assets/spider/Walk.png");
  }

  downloadEnemyAttackAssets() {
    this.assetManager.queueDownload("./assets/thorn/thorn.png");
  }

  downloadBackgroundAssets() {
    this.assetManager.queueDownload("./assets/background/background.png");
  }
}