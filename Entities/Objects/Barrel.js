import { Actor } from "../Actor.js";
import { Collider } from "../Collider.js";
import { GAME_ENGINE } from "../../main.js";
import { BarrelExplosionEffect } from "../Effects/BarrelExplosionEffect.js";
import { DESTRUCTIBLE_OBJECTS_SPRITESHEET } from "../../Globals/Constants.js";
import { FireballExplosionEffect } from "../Effects/FireballExplosionEffect.js";

export class Barrel extends Actor {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.entityOrder = 2; // Render below spells
    this.assetManager = window.ASSET_MANAGER;
    this.isBreakable = true;
    this.exploded = false;
    this.scale = 4;

    // Load barrel sprite
    this.sprite = this.assetManager.getAsset(
      DESTRUCTIBLE_OBJECTS_SPRITESHEET.BARREL.URL
    );

    // Barrel spritesheet settings
    this.barrelSheetWidth = 448;
    this.barrelSheetHeight = 755;
    this.barrelCols = 7;
    this.barrelRows = 12;
    this.barrelFrameWidth = this.barrelSheetWidth / this.barrelCols;
    this.barrelFrameHeight = this.barrelSheetHeight / this.barrelRows;

    this.barrelRow = 0;
    this.barrelCol = 0;

    this.collider = new Collider(this.barrelFrameWidth, this.barrelFrameHeight);

    this.health = 1;
  }

  update() {
    if (this.exploded) return;

    for (let e of GAME_ENGINE.entities) {
      if (e instanceof FireballExplosionEffect && this.colliding(e)) {
        this.recieveAttacks();
        if (this.health <= 0) {
          this.explode();
        }
      }
    }
  }

  explode() {
    if (this.exploded) return;
    this.exploded = true;
    this.collider = null;

    // Spawn explosion effect
    GAME_ENGINE.addEntity(new BarrelExplosionEffect(this.x, this.y, 20));

    this.removeFromWorld = true;
  }

  draw(ctx) {
    if (this.exploded) return;

    if (this.sprite) {
      ctx.drawImage(
        this.sprite,
        this.barrelCol * this.barrelFrameWidth,
        this.barrelRow * this.barrelFrameHeight,
        this.barrelFrameWidth,
        this.barrelFrameHeight,
        this.x -
          GAME_ENGINE.camera.x -
          (this.barrelFrameWidth * this.scale) / 2,
        this.y -
          GAME_ENGINE.camera.y -
          (this.barrelFrameHeight * this.scale) / 2,
        this.barrelFrameWidth * this.scale,
        this.barrelFrameHeight * this.scale
      );
    }
  }
}
