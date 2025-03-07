// Background Spritesheet Constants

export const BACKGROUND_SPRITESHEET = {
  ABOVE: {
    NAME: "ABOVE",
    URL: "./assets/background/AboveBackground.png",
    FRAME_WIDTH: 640,
    FRAME_HEIGHT: 400,
    FRAME_COUNT: 40,
    FRAME_DURATION: 0.1,
  },
  UNDER: {
    NAME: "UNDER",
    URL: "./assets/background/UndergroundBackground.png",
    FRAME_WIDTH: 828,
    FRAME_HEIGHT: 358,
    FRAME_COUNT: 12,
    FRAME_DURATION: 0.1,
  },
  // UNDER1: {
  //   NAME: "UNDER1",
  //   URL: "./assets/background/UndergroundBackground1.png",
  //   FRAME_WIDTH: 1305,
  //   FRAME_HEIGHT: 720,
  //   FRAME_COUNT: 15,
  //   FRAME_DURATION: 0.1,
  // },
  SPIDER: {
    NAME: "SPIDER",
    URL: "./assets/background/SpiderBackground.png",
    FRAME_WIDTH: 576,
    FRAME_HEIGHT: 324,
    FRAME_COUNT: 1,
    FRAME_DURATION: 0.1,
  },
};

// PLAYER SECTION //
// All things player related are stored here
// Spritesheets
// Collider values

// Player Spritesheet Constants

export const PLAYER_SPRITESHEET = {
  IDLE: {
    NAME: "IDLE",
    URL: "./assets/player/Idle.png",
    FRAME_WIDTH: 600,
    FRAME_HEIGHT: 600,
    FRAME_COUNT: 5,
    FRAME_DURATION: 0.2,
  },
  RUN: {
    NAME: "RUN",
    URL: "./assets/player/Run.png",
    FRAME_WIDTH: 600,
    FRAME_HEIGHT: 600,
    FRAME_COUNT: 8,
    FRAME_DURATION: 0.15,
  },
  JUMP: {
    NAME: "JUMP",
    URL: "./assets/player/Jump.png",
    FRAME_WIDTH: 600,
    FRAME_HEIGHT: 600,
    FRAME_COUNT: 4,
    FRAME_DURATION: 0.15,
  },
  ATTACK1: {
    NAME: "ATTACK",
    URL: "./assets/player/Attack.png",
    FRAME_WIDTH: 600,
    FRAME_HEIGHT: 600,
    FRAME_COUNT: 5,
    FRAME_DURATION: 0.1,
  },
  FALL: {
    NAME: "FALL",
    URL: "./assets/player/Fall.png",
    FRAME_WIDTH: 600,
    FRAME_HEIGHT: 600,
    FRAME_COUNT: 4,
    FRAME_DURATION: 0.15,
  },
  HIT: {
    NAME: "HIT",
    URL: "./assets/player/Hit.png",
    FRAME_WIDTH: 600,
    FRAME_HEIGHT: 600,
    FRAME_COUNT: 2,
    FRAME_DURATION: 0.25,
  },
  DEAD: {
    NAME: "DEAD",
    URL: "./assets/player/Death.png",
    FRAME_WIDTH: 600,
    FRAME_HEIGHT: 600,
    FRAME_COUNT: 14,
    FRAME_DURATION: 0.25,
  },
};

// Player Collider Constants

export const PLAYER_COLLIDER = {
  WIDTH: 70,
  HEIGHT: 130,
  OFFSET_X: -11,
  OFFSET_Y: 0,
};

// Enemy SpriteSheets

export const CROW_SPRITESHEET = {
  FLY: {
    NAME: "CROWFLY",
    URL: "./assets/enemy/Crow/Fly/noshadow.png",
    FRAME_WIDTH: 40,
    FRAME_HEIGHT: 40,
    FRAME_COUNT: 5,
    FRAME_DURATION: 0.2,
  },
  ATTACK: {
    NAME: "CROWATTACK",
    URL: "./assets/enemy/Crow/Attack/noshadow.png",
    FRAME_WIDTH: 40,
    FRAME_HEIGHT: 40,
    FRAME_COUNT: 5,
    FRAME_DURATION: 0.15,
  },
  HURT: {
    NAME: "CROWHURT",
    URL: "./assets/enemy/Crow/Hurt/noshadow.png",
    FRAME_WIDTH: 40,
    FRAME_HEIGHT: 40,
    FRAME_COUNT: 5,
    FRAME_DURATION: 0.1,
  },
  DEATH: {
    NAME: "CROWDEATH",
    URL: "./assets/enemy/Crow/Die/noshadow.png",
    FRAME_WIDTH: 40,
    FRAME_HEIGHT: 40,
    FRAME_COUNT: 5,
    FRAME_DURATION: 0.2,
  },
};

export const SPIDER_SPRITESHEET = {
  RUN: {
    NAME: "run",
    URL: "./assets/enemy/spider/move.png",
    FRAME_WIDTH: 400,
    FRAME_HEIGHT: 500,
    FRAME_COUNT: 4,
    FRAME_DURATION: 0.1,
  },
  ROAM: {
    NAME: "roam",
    URL: "./assets/enemy/spider/move.png",
    FRAME_WIDTH: 400,
    FRAME_HEIGHT: 500,
    FRAME_COUNT: 4,
    FRAME_DURATION: 0.25,
  },
  AGGRESSIVE: {
    NAME: "aggressive",
    URL: "./assets/enemy/spider/attack.png",
    FRAME_WIDTH: 400,
    FRAME_HEIGHT: 500,
    FRAME_COUNT: 8,
    FRAME_DURATION: 0.1,
  },
  ATTACK: {
    NAME: "attack",
    URL: "./assets/enemy/spider/attack.png",
    FRAME_WIDTH: 400,
    FRAME_HEIGHT: 500,
    FRAME_COUNT: 8,
    FRAME_DURATION: 0.15,
  },
  IDLE: {
    NAME: "idle",
    URL: "./assets/enemy/spider/idle.png",
    FRAME_WIDTH: 400,
    FRAME_HEIGHT: 500,
    FRAME_COUNT: 8,
    FRAME_DURATION: 0.35,
  },
  DEATH: {
    NAME: "death",
    URL: "./assets/enemy/spider/death.png",
    FRAME_WIDTH: 400,
    FRAME_HEIGHT: 500,
    FRAME_COUNT: 8,
    FRAME_DURATION: 0.15,
  },
  HURT: {
    NAME: "hurt",
    URL: "./assets/enemy/spider/hurt.png",
    FRAME_WIDTH: 400,
    FRAME_HEIGHT: 500,
    FRAME_COUNT: 3,
    FRAME_DURATION: 0.25,
  },
};

export const CACTUS_SPRITESHEET = {
  AGGRESSIVE: {
    NAME: "aggressive",
    URL: "./assets/enemy/cactus/aggro.png",
    FRAME_WIDTH: 160,
    FRAME_HEIGHT: 160,
    FRAME_COUNT: 1,
    FRAME_DURATION: 0.25,
  },
  ATTACK: {
    NAME: "attack",
    URL: "./assets/enemy/cactus/attack.png",
    FRAME_WIDTH: 160,
    FRAME_HEIGHT: 160,
    FRAME_COUNT: 3,
    FRAME_DURATION: 0.15,
  },
  DEFAULT: {
    NAME: "default",
    URL: "./assets/enemy/cactus/cactus.png",
    FRAME_WIDTH: 160,
    FRAME_HEIGHT: 160,
    FRAME_COUNT: 1,
    FRAME_DURATION: 0.25,
  },
  DAMAGE: {
    NAME: "damage",
    URL: "./assets/enemy/cactus/damage.png",
    FRAME_WIDTH: 160,
    FRAME_HEIGHT: 160,
    FRAME_COUNT: 1,
    FRAME_DURATION: 0.25,
  },
  DIE: {
    NAME: "die",
    URL: "./assets/enemy/cactus/die.png",
    FRAME_WIDTH: 160,
    FRAME_HEIGHT: 160,
    FRAME_COUNT: 4,
    FRAME_DURATION: 0.2,
  },
  IDLE: {
    NAME: "idle",
    URL: "./assets/enemy/cactus/idle.png",
    FRAME_WIDTH: 160,
    FRAME_HEIGHT: 160,
    FRAME_COUNT: 8,
    FRAME_DURATION: 0.25,
  },
};

// Map Ground Constants

export const GROUND_SPRITESHEET = {
  GROUND_TOP: {
    URL: "./assets/map/Tileset/tileMain2.png",
  },
  GROUND_BOTTOM: {
    URL: "./assets/map/Tileset/tileMain5.png",
  },
  GROUND_TILESET: {
    URL: "./assets/map/deserttileset.png",
  },
};

// Map Object Constants

export const MAP_CONSTANTS = {
  CAMPFIRE: {
    NAME: "CAMPFIRE",
    URL: "./assets/map/Campfire.png",
    FRAME_WIDTH: 32,
    FRAME_HEIGHT: 64,
    FRAME_COUNT: 8,
    FRAME_DURATION: 0.25,
  },
  ACTIVATED_CAMPFIRE: {
    NAME: "ACTIVATEDCAMPFIRE",
    URL: "./assets/map/ActivatedCampfire.png",
    FRAME_WIDTH: 32,
    FRAME_HEIGHT: 64,
    FRAME_COUNT: 8,
    FRAME_DURATION: 0.25,
  },
  SPIDERWEB: {
    NAME: "SPIDERWEB",
    URL: "./assets/map/Spiderweb.png",
    FRAME_WIDTH: 32,
    FRAME_HEIGHT: 32,
    FRAME_COUNT: 15,
    FRAME_DURATION: 0.25,
  },
};

// Destructible Object Constants

export const DESTRUCTIBLE_OBJECTS_SPRITESHEET = {
  BARREL: {
    URL: "./assets/objects/barrel.png",
  },
  TUMBLEWEED: {
    NAME: "TUMBLEWEED",
    URL: "./assets/objects/tumbleweed.png",
    FRAME_WIDTH: 256,
    FRAME_HEIGHT: 256,
    FRAME_COUNT: 4,
    FRAME_DURATION: 0.1,
  },
};

// Spells Constants

export const SPELLS_SPRITESHEET = {
  FIREBALL: {
    NAME: "Fireball",
    URL: "./assets/spells/Fireball.png",
    FRAME_WIDTH: 64,
    FRAME_HEIGHT: 32,
    FRAME_COUNT: 5,
    FRAME_DURATION: 0.15,
  },
  WATERWAVE: {
    NAME: "WaterWave",
    URL: "./assets/spells/WaterWave.png",
    FRAME_WIDTH: 128,
    FRAME_HEIGHT: 128,
    FRAME_COUNT: 9,
    FRAME_DURATION: 0.05,
  },
  ICICLE: {
    NAME: "Icicle",
    URL: "./assets/spells/Icicle.png",
    FRAME_WIDTH: 128,
    FRAME_HEIGHT: 64,
    FRAME_COUNT: 6,
    FRAME_DURATION: 0.05,
  },
  ICICLE_EXPLOSION: {
    NAME: "Icicle_Explosion",
    URL: "./assets/spells/Icicle_Explosion.png",
    FRAME_WIDTH: 128,
    FRAME_HEIGHT: 128,
    FRAME_COUNT: 6,
    FRAME_DURATION: 0.05,
  },
  VOIDORB: {
    NAME: "Void_Orb",
    URL: "./assets/spells/Void_Orb.png",
    FRAME_WIDTH: 32,
    FRAME_HEIGHT: 32,
    FRAME_COUNT: 8,
    FRAME_DURATION: 0.1,
  },
  VINEGRAPPLE: {
    NAME: "Vine_Grapple",
    URL: "./assets/spells/Vine.png",
  },
};

// Effects Constants

export const EFFECTS_SPRITESHEET = {
  FIREBALL_EXPLOSION_SPRITESHEET: {
    NAME: "FIREBALLEXPLOSION",
    URL: "./assets/effects/explosion/FireballExplosionEffect.png",
    FRAME_WIDTH: 48,
    FRAME_HEIGHT: 48,
    FRAME_COUNT: 8,
    FRAME_DURATION: 0.15,
  },
  BARREL_EXPLOSION_SPRITESHEET: {
    NAME: "BARRELEXPLOSION",
    URL: "./assets/effects/explosion/BarrelExplosionEffect.png",
    FRAME_WIDTH: 32,
    FRAME_HEIGHT: 48,
    FRAME_COUNT: 7,
    FRAME_DURATION: 0.2,
  },
  BURNING_EFFECT: {
    NAME: "BURNING",
    URL: "./assets/effects/burning/BurningEffect.png",
    FRAME_WIDTH: 24,
    FRAME_HEIGHT: 32,
    FRAME_COUNT: 8,
    FRAME_DURATION: 0.1,
  },
  SHOCK_EFFECT: {
    NAME: "SHOCK",
    URL: "./assets/effects/shock.png",
    FRAME_WIDTH: 32,
    FRAME_HEIGHT: 32,
    FRAME_COUNT: 8,
    FRAME_DURATION: 0.1,
  },
  SOAKED_EFFECT: {
    NAME: "SOAKED",
    URL: "./assets/effects/soaked.png",
    FRAME_WIDTH: 32,
    FRAME_HEIGHT: 32,
    FRAME_COUNT: 7,
    FRAME_DURATION: 0.2,
  },
  ICE_EFFECT: {
    NAME: "ICE",
    URL: "./assets/effects/ice_cube.png",
    FRAME_WIDTH: 48,
    FRAME_HEIGHT: 32,
    FRAME_COUNT: 1,
    FRAME_DURATION: 0.2,
  },
  VOID_EFFECT: {
    NAME: "VOID",
    URL: "./assets/effects/void.png",
    FRAME_WIDTH: 32,
    FRAME_HEIGHT: 32,
    FRAME_COUNT: 8,
    FRAME_DURATION: 0.2,
  },
  VOID_EXPLOSION_EFFECT: {
    NAME: "VOID_EXPLOSION",
    URL: "./assets/effects/void_explosion.png",
    FRAME_WIDTH: 96,
    FRAME_HEIGHT: 80,
    FRAME_COUNT: 20,
    FRAME_DURATION: 0.05,
  },
};

// UI Constants

export const UI_SPRITESHEET = {
  FIREBALL_ICON: {
    NAME: "FIREBALLICON",
    URL: "./assets/ui/spells/fireballicon.png",
    FRAME_WIDTH: 32,
    FRAME_HEIGHT: 32,
    FRAME_COUNT: 20,
    FRAME_DURATION: 0.15,
  },
};
