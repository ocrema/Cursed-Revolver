// Background Spritesheet Constants

export const BACKGROUND_SPRITESHEET = {
  URL: "./assets/background/background1.png",
  FRAME_WIDTH: 640,
  FRAME_HEIGHT: 400,
  FRAME_COUNT: 40,
  FRAME_DURATION: 0.1,
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
    FRAME_WIDTH: 231,
    FRAME_HEIGHT: 190,
    FRAME_COUNT: 6,
    FRAME_DURATION: 0.2,
  },
  RUN: {
    NAME: "RUN",
    URL: "./assets/player/Run.png",
    FRAME_WIDTH: 231,
    FRAME_HEIGHT: 190,
    FRAME_COUNT: 8,
    FRAME_DURATION: 0.1,
  },
  JUMP: {
    NAME: "JUMP",
    URL: "./assets/player/Jump.png",
    FRAME_WIDTH: 231,
    FRAME_HEIGHT: 190,
    FRAME_COUNT: 2,
    FRAME_DURATION: 0.5,
  },
  ATTACK1: {
    NAME: "ATTACK1",
    URL: "./assets/player/Attack1.png",
    FRAME_WIDTH: 231,
    FRAME_HEIGHT: 190,
    FRAME_COUNT: 8,
    FRAME_DURATION: 0.075,
  },
  ATTACK2: {
    NAME: "ATTACK2",
    URL: "./assets/player/Attack2.png",
    FRAME_WIDTH: 231,
    FRAME_HEIGHT: 190,
    FRAME_COUNT: 8,
    FRAME_DURATION: 0.075,
  },
  FALL: {
    NAME: "FALL",
    URL: "./assets/player/Fall.png",
    FRAME_WIDTH: 231,
    FRAME_HEIGHT: 190,
    FRAME_COUNT: 2,
    FRAME_DURATION: 0.5,
  },
  HIT: {
    NAME: "HIT",
    URL: "./assets/player/Hit.png",
    FRAME_WIDTH: 231,
    FRAME_HEIGHT: 190,
    FRAME_COUNT: 1,
    FRAME_DURATION: 1,
  },
  DEAD: {
    NAME: "DEAD",
    URL: "./assets/player/Death.png",
    FRAME_WIDTH: 231,
    FRAME_HEIGHT: 190,
    FRAME_COUNT: 7,
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

export const MAP_TREES_AND_ROCKS = {
  ROCK1_URL: "./assets/map/props/rocks1.png",
  ROCK2_URL: "./assets/map/props/rocks2.png",
  ROCK3_URL: "./assets/map/props/rocks3.png",
  ROCK4_URL: "./assets/map/props/rocks4.png",
  ROCK5_URL: "./assets/map/props/rocks5.png",
  TREE1_URL: "./assets/map/props/tree01.png",
  TREE2_URL: "./assets/map/props/tree02.png",
  TREE3_URL: "./assets/map/props/tree03.png",
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
    FRAME_DURATION: 0.15,
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
};
