export class AssetDownloader {
  constructor(assetManager) {
    this.assetManager = assetManager;
  }

  downloadAll() {
    // Entities
    this.downloadPlayerAssets();
    this.downloadEnemyAssets();
    this.downloadEnemyAttackAssets();

    // Spells
    this.downloadSpellAssets();

    // Effects
    this.downloadEffectAssets();

    // Map
    this.downloadBackgroundAssets();
    this.downloadMapGroundAssets();
    this.downloadMapObjectAssets();
    this.downloadDestructibleObjectAssets();
    this.downloadEnvironmentalAssets();

    // UX
    this.downloadSFXAssets();

    // HUD / UI
    this.downloadPauseMenuButtons();
    this.downloadHUDSpells();
    this.downloadHUDCowboyIcon();
    this.downloadHealthBarAssets();
    this.downloadRevolverCylinderSprites();
    this.downloadFonts();
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
    this.assetManager.queueDownload("./assets/cowboy/walk.png");
    this.assetManager.queueDownload("./assets/enemy/spider/Walk.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyIdle.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyWalking.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyDrawWeapon.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyQuickDrawShot.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyRapidFire.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyShoot.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoySmokingIdle.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyBullet.png");
    this.assetManager.queueDownload("./assets/enemy/cactus/cactus.png");
    this.assetManager.queueDownload("./assets/enemy/cactus/newcactus.png");
    this.assetManager.queueDownload("./assets/enemy/spider/Walk.png");

    // Crow Enemy
    this.assetManager.queueDownload("./assets/enemy/Crow/Fly/noshadow.png");
    this.assetManager.queueDownload("./assets/enemy/Crow/Hurt/noshadow.png");
    this.assetManager.queueDownload("./assets/enemy/Crow/Die/noshadow.png");
    this.assetManager.queueDownload("./assets/enemy/Crow/Attack/noshadow.png");

    // Earth Golem
    this.assetManager.queueDownload("./assets/enemy/golem/golem_walk.png");
  }

  downloadEnemyAttackAssets() {
    this.assetManager.queueDownload("./assets/enemy/thorn/thorn.png");
  }

  downloadCowboyAssets() {
    this.assetManager.queueDownload("./assets/cowboy/CowBoyIdle.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyWalking.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyDrawWeapon.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyQuickDrawShot.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyRapidFire.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyShoot.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoySmokingIdle.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyBullet.png");
  }

  downloadBackgroundAssets() {
    this.assetManager.queueDownload("./assets/background/AboveBackground.png");
    this.assetManager.queueDownload(
      "./assets/background/UndergroundBackground.png"
    );
    this.assetManager.queueDownload(
      "./assets/background/UndergroundBackground1.png"
    );
  }

  downloadMapGroundAssets() {
    this.assetManager.queueDownload("./assets/map/Atlas.png");
    this.assetManager.queueDownload("./assets/map/deserttileset.png");
  }

  downloadMapObjectAssets() {
    this.assetManager.queueDownload("./assets/map/Rock1.png");
    this.assetManager.queueDownload("./assets/map/props/rocks2.png");
    this.assetManager.queueDownload("./assets/map/props/rocks3.png");
    this.assetManager.queueDownload("./assets/map/props/rocks4.png");
    this.assetManager.queueDownload("./assets/map/props/tree01.png");
    this.assetManager.queueDownload("./assets/map/props/tree02.png");
    this.assetManager.queueDownload("./assets/map/props/tree03.png");
    this.assetManager.queueDownload("./assets/map/props/tree04.png");
    this.assetManager.queueDownload("./assets/map/Spikes.png");
    this.assetManager.queueDownload("./assets/map/CactusSpikes.png");
    this.assetManager.queueDownload("./assets/map/Saloon.png");
    this.assetManager.queueDownload("./assets/map/SpawnPoint.png");
    this.assetManager.queueDownload("./assets/map/Signs.png");
    this.assetManager.queueDownload("./assets/map/Campfire.png");
  }

  downloadSpellAssets() {
    this.assetManager.queueDownload("./assets/spells/Fireball.png");
    this.assetManager.queueDownload("./assets/spells/WaterWave.png");
    this.assetManager.queueDownload("./assets/spells/Icicle.png");
    this.assetManager.queueDownload("./assets/spells/Icicle_Explosion.png");
    this.assetManager.queueDownload("./assets/spells/Void_Orb.png");
    this.assetManager.queueDownload("./assets/spells/Vine.png");
  }

  // Objects

  downloadDestructibleObjectAssets() {
    this.assetManager.queueDownload("./assets/objects/barrel.png");
    this.assetManager.queueDownload("./assets/objects/tumbleweed.png");
    this.assetManager.queueDownload("./assets/objects/growing_tree.png");
    this.assetManager.queueDownload("./assets/objects/health_potion.png");
  }

  downloadEnvironmentalAssets() {
    this.assetManager.queueDownload("./assets/enemy/stampede/horse.png");
  }

  // Effects

  downloadEffectAssets() {
    this.assetManager.queueDownload(
      "./assets/effects/explosion/FireballExplosionEffect.png"
    );
    this.assetManager.queueDownload(
      "./assets/effects/explosion/BarrelExplosionEffect.png"
    );
    this.assetManager.queueDownload(
      "./assets/effects/burning/BurningEffect.png"
    );
    this.assetManager.queueDownload("./assets/effects/dust/landingdust.png");
    this.assetManager.queueDownload("./assets/effects/dust/dashdust.png");
    this.assetManager.queueDownload("./assets/effects/shock.png");
    this.assetManager.queueDownload("./assets/effects/soaked.png");
    this.assetManager.queueDownload("./assets/effects/ice_cube.png");
    this.assetManager.queueDownload("./assets/effects/void.png");
    this.assetManager.queueDownload("./assets/effects/void_explosion.png");
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
    this.assetManager.queueDownload("./assets/sfx/waterwave.wav");
    this.assetManager.queueDownload("./assets/sfx/void.wav");
    this.assetManager.queueDownload("./assets/sfx/vine.wav");
  }

  downloadPauseMenuButtons() {
    this.assetManager.queueDownload("./assets/ui/menu/buttonResume.png");
    this.assetManager.queueDownload("./assets/ui/menu/buttonSettings.png");
    this.assetManager.queueDownload("./assets/ui/menu/buttonHelp.png");
    this.assetManager.queueDownload("./assets/ui/menu/buttonQuit.png");
    this.assetManager.queueDownload("./assets/ui/menu/buttonStart.png");
    this.assetManager.queueDownload("./assets/ui/menu/menuBackground.png");
    this.assetManager.queueDownload("./assets/ui/menu/background_start.png");
    this.assetManager.queueDownload("./assets/ui/menu/background_start2.png");
    this.assetManager.queueDownload("./assets/ui/menu/desert.jpg");
  }

  // HUD Assets

  downloadHUDSpells() {
    this.assetManager.queueDownload("./assets/ui/spells/fireballicon.png");
    this.assetManager.queueDownload("./assets/ui/spells/fireball.png");
    this.assetManager.queueDownload("./assets/ui/spells/lightning.png");
    this.assetManager.queueDownload("./assets/ui/spells/water.png");
    this.assetManager.queueDownload("./assets/ui/spells/icicle.png");
    this.assetManager.queueDownload("./assets/ui/spells/vine.png");
    this.assetManager.queueDownload("./assets/ui/spells/void.png");
  }

  downloadHUDCowboyIcon() {
    this.assetManager.queueDownload("./assets/ui/cowboy.png");
    this.assetManager.queueDownload("./assets/ui/cowboy1.png");
    this.assetManager.queueDownload("./assets/ui/cowboy2.png");
    this.assetManager.queueDownload("./assets/ui/cowboy_spell.png");
    for (let i = 1; i <= 6; i++) {
      this.assetManager.queueDownload(`./assets/ui/cowboy_spell${i}.png`);
    }
    for (let i = 1; i <= 6; i++) {
      this.assetManager.queueDownload(`./assets/ui/cowboy_flash${i}.png`);
    }
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

  downloadFonts() {
    this.assetManager.queueDownload("./assets/fonts/texas.ttf");
  }
}
