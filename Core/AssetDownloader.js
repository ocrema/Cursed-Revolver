export class AssetDownloader {
  constructor(assetManager) {
    this.assetManager = assetManager;
  }

  downloadAll() {
    // Entities
    this.downloadPlayerAssets();
    this.downloadEnemyAssets();
    this.downloadEnemyAttackAssets();

    // Map
    this.downloadBackgroundAssets();
    this.downloadMapGroundAssets();
    this.downloadMapObjectAssets();
    this.downloadDestructibleObjectAssets();

    // UX
    this.downloadSFXAssets();

    // HUD
    this.downloadPauseMenuButtons();
    this.downloadHUDSpells();
    this.downloadHUDCowboyIcon();
    this.downloadHealthBarAssets();
    this.downloadRevolverCylinderSprites();
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

  downloadMapGroundAssets() {
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

  downloadDestructibleObjectAssets() {
    this.assetManager.queueDownload("./assets/objects/barrel.png");
    this.assetManager.queueDownload("./assets/effects/explosion/Sprites.png");
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

  downloadPauseMenuButtons() {
    this.assetManager.queueDownload("./assets/ui/menu/buttonResume.png");
    this.assetManager.queueDownload("./assets/ui/menu/buttonSettings.png");
    this.assetManager.queueDownload("./assets/ui/menu/buttonQuit.png");
    this.assetManager.queueDownload("./assets/ui/menu/buttonStart.png");
    this.assetManager.queueDownload("./assets/ui/menu/menuBackground.png");
    this.assetManager.queueDownload("./assets/ui/menu/background_start.png");
    this.assetManager.queueDownload("./assets/ui/menu/background_start2.png");
    this.assetManager.queueDownload("./assets/ui/menu/desert.jpg");
  }

  // HUD Assets

  downloadHUDSpells() {
    this.assetManager.queueDownload("./assets/ui/spells/fireball.gif");
    this.assetManager.queueDownload("./assets/ui/spells/lightning.gif");
    this.assetManager.queueDownload("./assets/ui/spells/water.gif");
    this.assetManager.queueDownload("./assets/ui/spells/icicle.gif");
    this.assetManager.queueDownload("./assets/ui/spells/vine.gif");
    this.assetManager.queueDownload("./assets/ui/spells/void.gif");
  }

  downloadHUDCowboyIcon() {
    this.assetManager.queueDownload("./assets/ui/cowboy.png");
  }

  downloadHealthBarAssets() {
    this.assetManager.queueDownload("./assets/ui/cowboy.png");
    this.assetManager.queueDownload("./assets/ui/healthbar.png");
  }

  downloadRevolverCylinderSprites() {
    for (let i = 1; i <= 10; i++) {
      this.assetManager.queueDownload(`./assets/ui/revolver/cylinder${i}.png`);
    }
  }
}
