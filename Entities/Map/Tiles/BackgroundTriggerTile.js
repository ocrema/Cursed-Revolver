import { Collider } from "../../Collider.js";
import { Tile } from "./Tile.js";
import { Player } from "../../Player/Player.js";
import { Background } from "../Background.js";
import { GAME_ENGINE } from "../../../main.js";

export class BackgroundTriggerTile extends Tile {
  constructor(
    x,
    y,
    tileID,
    tilesetImage,
    tileSize,
    tilesPerRow,
    firstGID,
    solidTiles,
    scale = 1
  ) {
    super(
      x,
      y,
      tileID,
      tilesetImage,
      tileSize,
      tilesPerRow,
      firstGID,
      solidTiles,
      scale
    );
    this.entityOrder = -9;
    this.isBackgroundTrigger = true;
    this.hasTriggered = false;

    this.collider = new Collider(
      this.tileSize * this.scale * 5,
      this.tileSize * this.scale
    );
  }

  update() {
    for (let e of GAME_ENGINE.entities) {
      if (e instanceof Player && this.colliding(e) && !this.hasTriggered) {
        this.hasTriggered = true; // Prevent retriggering immediately
        let background = GAME_ENGINE.entities.find(
          (entity) => entity instanceof Background
        );
        if (background) {
          background.nextBackground(); // Move to the next background
        }
      }
    }
  }
}
