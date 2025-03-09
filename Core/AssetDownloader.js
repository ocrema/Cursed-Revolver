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
    this.downloadMusicAssets();

    // HUD / UI
    this.downloadPauseMenuButtons();
    this.downloadHUDSpells();
    this.downloadHUDCowboyIcon();
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
    this.assetManager.queueDownload("./assets/player/Attack.png");
    this.assetManager.queueDownload("./assets/player/gun.png");
    this.assetManager.queueDownload("./assets/ui/aim.png");
  }

  downloadEnemyAssets() {
    // Spider Enemy
    this.assetManager.queueDownload("./assets/enemy/spider/attack.png");
    this.assetManager.queueDownload("./assets/enemy/spider/death.png");
    this.assetManager.queueDownload("./assets/enemy/spider/hurt.png");
    this.assetManager.queueDownload("./assets/enemy/spider/idle.png");
    this.assetManager.queueDownload("./assets/enemy/spider/move.png");

    // Cactus Enemy
    this.assetManager.queueDownload("./assets/enemy/cactus/cactus.png");
    this.assetManager.queueDownload("./assets/enemy/cactus/aggro.png");
    this.assetManager.queueDownload("./assets/enemy/cactus/attack.png");
    this.assetManager.queueDownload("./assets/enemy/cactus/damage.png");
    this.assetManager.queueDownload("./assets/enemy/cactus/die.png");
    this.assetManager.queueDownload("./assets/enemy/cactus/idle.png");
    this.assetManager.queueDownload("./assets/enemy/cactus/spawn.png");

    // Cowboy Enemy
    this.assetManager.queueDownload("./assets/cowboy/walk.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyIdle.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyWalking.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyDeath.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyHurt.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyDrawWeapon.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyQuickDrawShot.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyRapidFire.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyShoot.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoySmokingIdle.png");
    this.assetManager.queueDownload("./assets/cowboy/CowBoyBullet.png");

    // Crow Enemy
    this.assetManager.queueDownload("./assets/enemy/Crow/Fly/noshadow.png");
    this.assetManager.queueDownload("./assets/enemy/Crow/Hurt/noshadow.png");
    this.assetManager.queueDownload("./assets/enemy/Crow/Die/noshadow.png");
    this.assetManager.queueDownload("./assets/enemy/Crow/Attack/noshadow.png");

    // Earth Golem
    this.assetManager.queueDownload("./assets/enemy/golem/golem_walk.png");
    this.assetManager.queueDownload("./assets/enemy/golem/golem_idle.png");
    this.assetManager.queueDownload("./assets/enemy/golem/golem_hit.png");

    // Wizard
    this.assetManager.queueDownload("./assets/enemy/wizard/Idle.png");
    this.assetManager.queueDownload("./assets/enemy/wizard/Death.png");
    this.assetManager.queueDownload("./assets/enemy/wizard/Attack.png");
  }

  downloadEnemyAttackAssets() {
    this.assetManager.queueDownload("./assets/enemy/thorn/thorn.png");
  }

  downloadBackgroundAssets() {
    this.assetManager.queueDownload("./assets/background/AboveBackground.png");
    this.assetManager.queueDownload(
      "./assets/background/UndergroundBackground.png"
    );
    this.assetManager.queueDownload("./assets/background/SpiderBackground.png");
    this.assetManager.queueDownload(
      "./assets/background/SpiderBackground1.png"
    );
    this.assetManager.queueDownload("./assets/background/WizardBackground.png");
    this.assetManager.queueDownload("./assets/ui/gameend/win.png");
    this.assetManager.queueDownload("./assets/ui/gameend/lose.png");
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
    this.assetManager.queueDownload("./assets/map/CactusSpikes.png");
    this.assetManager.queueDownload("./assets/map/Saloon.png");
    this.assetManager.queueDownload(
      "./assets/map/SpawnPoints/PlayerSpawnPoint.png"
    );
    this.assetManager.queueDownload(
      "./assets/map/SpawnPoints/CactusSpawnPoint.png"
    );
    this.assetManager.queueDownload(
      "./assets/map/SpawnPoints/CowboySpawnPoint.png"
    );
    this.assetManager.queueDownload(
      "./assets/map/SpawnPoints/BirdSpawnPoint.png"
    );
    this.assetManager.queueDownload(
      "./assets/map/SpawnPoints/BarrelSpawnPoint.png"
    );
    this.assetManager.queueDownload(
      "./assets/map/SpawnPoints/BackgroundTrigger.png"
    );
    this.assetManager.queueDownload(
      "./assets/map/SpawnPoints/TumbleweedSpawnPoint.png"
    );
    this.assetManager.queueDownload(
      "./assets/map/SpawnPoints/SpiderwebSpawnPoint.png"
    );
    this.assetManager.queueDownload(
      "./assets/map/SpawnPoints/GrowingTreeSpawnPoint.png"
    );
    this.assetManager.queueDownload(
      "./assets/map/SpawnPoints/SpiderSpawnPoint.png"
    );
    this.assetManager.queueDownload(
      "./assets/map/SpawnPoints/GolemSpawnPoint.png"
    );
    this.assetManager.queueDownload(
      "./assets/map/SpawnPoints/BoulderSpawnPoint.png"
    );
    this.assetManager.queueDownload(
      "./assets/map/SpawnPoints/SpiderwebObstacleSpawnPoint.png"
    );
    this.assetManager.queueDownload(
      "./assets/map/SpawnPoints/MovingCowboySpawnPoint.png"
    );
    this.assetManager.queueDownload(
      "./assets/map/SpawnPoints/DeadTreeSpawnPoint.png"
    );
    this.assetManager.queueDownload("./assets/map/Skull2.png");
    this.assetManager.queueDownload("./assets/map/Skull1.png");
    this.assetManager.queueDownload("./assets/map/Spiderweb.png");
    this.assetManager.queueDownload("./assets/map/Signs.png");
    this.assetManager.queueDownload("./assets/map/Campfire.png");
    this.assetManager.queueDownload("./assets/map/ActivatedCampfire.png");
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
    this.assetManager.queueDownload("./assets/objects/Boulder.png");
    this.assetManager.queueDownload("./assets/objects/WebObstacle.png");
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
    this.assetManager.queueDownload("./assets/effects/healing/heal.png");
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
    this.assetManager.queueDownload("./assets/sfx/gunspin.ogg");
    this.assetManager.queueDownload("./assets/sfx/cactus_shoot.ogg");
    this.assetManager.queueDownload("./assets/sfx/frozen.wav");
    this.assetManager.queueDownload("./assets/sfx/golem_attack.wav");
    this.assetManager.queueDownload("./assets/sfx/golem_idle.wav");
    this.assetManager.queueDownload("./assets/sfx/golem_death.wav");
    this.assetManager.queueDownload("./assets/sfx/hitsound.ogg");
    this.assetManager.queueDownload("./assets/sfx/spider_attack.wav");
    this.assetManager.queueDownload("./assets/sfx/spider_idle.wav");
    this.assetManager.queueDownload("./assets/sfx/spider_death.wav");
    this.assetManager.queueDownload("./assets/sfx/temp_shock.ogg");
    this.assetManager.queueDownload("./assets/sfx/void_explosion.wav");
    this.assetManager.queueDownload("./assets/sfx/checkpoint.ogg");
    this.assetManager.queueDownload("./assets/sfx/wizard_charge.wav");
    this.assetManager.queueDownload("./assets/sfx/explosion.wav");
  }

  downloadMusicAssets() {
    this.assetManager.queueDownload("./assets/music/track1.mp3");
    this.assetManager.queueDownload("./assets/music/track2.mp3");
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
    const spells = ["fireball", "vine", "icicle", "water", "lightning", "void"];
    // Queue all animated frames (1-30) for each spell
    for (let spell of spells) {
      for (let i = 1; i <= 30; i++) {
        this.assetManager.queueDownload(
          `./assets/ui/spells/${spell}/${spell}${i}.png`
        );
      }
    }
  }

  downloadHUDCowboyIcon() {
    this.assetManager.queueDownload("./assets/ui/cowboy.png");
    this.assetManager.queueDownload("./assets/ui/cowboy1.png");
    this.assetManager.queueDownload("./assets/ui/cowboy2.png");
    for (let i = 1; i <= 6; i++) {
      this.assetManager.queueDownload(`./assets/ui/cowboy_flash${i}.png`);
    }
  }

  downloadRevolverCylinderSprites() {
    this.assetManager.queueDownload(`./assets/ui/revolver/cylinder1.png`);
    this.assetManager.queueDownload(`./assets/ui/revolver/bullets.png`);
  }

  downloadFonts() {
    this.assetManager.queueDownload("./assets/fonts/texas.ttf");
    this.assetManager.queueDownload("./assets/fonts/title.ttf");
  }
}
