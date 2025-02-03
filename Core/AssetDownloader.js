export class AssetDownloader {
  constructor(assetManager) {
    this.assetManager = assetManager;
  }

  downloadAll() {
    this.downloadPlayerAssets();
    this.downloadEnemyAssets();
    this.downloadEnemyAttackAssets();
    this.downloadBackgroundAssets();
    this.downloadMapAssets();
    this.downloadMapObjectAssets();
    this.downloadSFXAssets();
  }

  downloadPlayerAssets() {
    this.assetManager.queueDownload("./assets/player/Idle.png");
    this.assetManager.queueDownload("./assets/player/Run.png");
    this.assetManager.queueDownload("./assets/player/Jump.png");
    this.assetManager.queueDownload("./assets/player/Death.png");
    this.assetManager.queueDownload("./assets/player/Fall.png");
    this.assetManager.queueDownload("./assets/player/Hit.png");
    this.assetManager.queueDownload("./assets/player/Attack1.png");
    this.assetManager.queueDownload("./assets/player/Attack2.png");
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
    this.assetManager.queueDownload("./assets/background/background1.png");
  }

  downloadMapAssets() {
    this.assetManager.queueDownload("./assets/map/Tileset/tileMain2.png");
    this.assetManager.queueDownload("./assets/map/Tileset/tileMain5.png");
    this.assetManager.queueDownload("./assets/map/Tileset/platforms10.png");
    this.assetManager.queueDownload("./assets/map/deserttileset.png");
  }

  downloadMapObjectAssets() {
    this.assetManager.queueDownload("./assets/map/props/rocks1.png");
    this.assetManager.queueDownload("./assets/map/props/rocks2.png");
    this.assetManager.queueDownload("./assets/map/props/rocks3.png");
    this.assetManager.queueDownload("./assets/map/props/rocks4.png");
    this.assetManager.queueDownload("./assets/map/props/rocks5.png");
    this.assetManager.queueDownload("./assets/map/props/tree01.png");
    this.assetManager.queueDownload("./assets/map/props/tree02.png");
    this.assetManager.queueDownload("./assets/map/props/tree03.png");
    this.assetManager.queueDownload("./assets/map/props/tree04.png");
  }

  downloadSFXAssets() {
    this.assetManager.queueDownload("./assets/sfx/click1.ogg");
    this.assetManager.queueDownload("./assets/sfx/click2.ogg");
    this.assetManager.queueDownload("./assets/sfx/fireball.wav");
    this.assetManager.queueDownload("./assets/sfx/fireball_impact.wav");
    this.assetManager.queueDownload("./assets/sfx/footstep.wav");
    this.assetManager.queueDownload("./assets/sfx/icicle.wav");
    this.assetManager.queueDownload("./assets/sfx/icicle_impact.wav");
    this.assetManager.queueDownload("./assets/sfx/lightning.wav");
    this.assetManager.queueDownload("./assets/sfx/revolver_shot.ogg");
    this.assetManager.queueDownload("./assets/sfx/jump.ogg");
    this.assetManager.queueDownload("./assets/sfx/landing.wav");
  }
}
