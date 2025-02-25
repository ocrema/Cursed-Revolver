import { Collider } from "../../Collider.js";
import { Tile } from "./Tile.js";
import { Player } from "../../Player/Player.js";

export class SpikeTile extends Tile {
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
    super();
    this.entityOrder = -9;
    this.x = x;
    this.y = y;
    this.tileID = tileID;
    this.tilesetImage = tilesetImage;
    this.tileSize = tileSize;
    this.tilesPerRow = tilesPerRow;
    this.firstGID = firstGID;
    this.scale = scale; // Scale factor
    this.isGround = true;
    this.isSpike = true;

    this.collider = new Collider(
      this.tileSize * this.scale, // Scale width
      this.tileSize * this.scale // Scale height
    );
  }

  update() {
    for (let e of GAME_ENGINE.entities) {
      if (e instanceof Player && this.colliding(e)) {
        e.queueAttack({
          damage: 100,
          x: this.x,
          y: this.y,
          launchMagnitude: 0,
        });
      }
    }
  }
}
