import { SpiderwebVisual } from "../../Objects/TileVisuals/SpiderwebVisual.js";
import { Collider } from "../../Collider.js";
import { Tile } from "./Tile.js";

export class SpiderwebTile extends Tile {
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
    this.entityOrder = -99999;
    this.x = x;
    this.y = y;
    this.tileID = tileID;
    this.tilesetImage = tilesetImage;
    this.tileSize = tileSize;
    this.tilesPerRow = tilesPerRow;
    this.firstGID = firstGID;
    this.scale = scale;
    this.isGround = true;
    this.isSpawnPoint = true;

    // Spawn a SpawnPoint entity for the visual effect
    this.spiderwebVisual = new SpiderwebVisual(this.x, this.y, this.scale);
    GAME_ENGINE.addEntity(this.spiderwebVisual);
  }
}
