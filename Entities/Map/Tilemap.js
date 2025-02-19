import { Tile } from "./Tiles/Tile.js";
import { GAME_ENGINE } from "../../main.js";
import { WaterTile } from "./Tiles/WaterTile.js";

export class Tilemap {
  constructor(
    mapPath,
    tilesetImage,
    tileSize = 16,
    atlasWidth = 320,
    solidTileIDs = [],
    scale = 4
  ) {
    this.mapPath = mapPath;
    this.tilesetImage = tilesetImage;
    this.tileSize = tileSize;
    this.tilesPerRow = atlasWidth / tileSize;
    this.tiles = [];
    this.mapWidth = 0;
    this.mapHeight = 0;
    this.firstGID = 0;
    this.solidTiles = new Set(solidTileIDs);
    this.scale = scale;
  }

  async load() {
    try {
      const response = await fetch(this.mapPath);
      const data = await response.json();
      this.parseMap(data);
    } catch (error) {
      console.error("Error loading the map:", error);
    }
  }

  parseMap(data) {
    const tileLayer = data.layers.find((layer) => layer.type === "tilelayer");
    if (!tileLayer) {
      console.error("No tile layer found.");
      return;
    }

    this.tiles = tileLayer.data;
    this.mapWidth = tileLayer.width;
    this.mapHeight = tileLayer.height;

    if (data.tilesets.length > 0) {
      this.firstGID = data.tilesets[0].firstgid;
    }

    this.generateTiles();
  }

  generateTiles() {
    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {
        let tileID = this.tiles[y * this.mapWidth + x];

        if (tileID > 0) {
          // Ignore empty tiles
          let worldX = x * this.tileSize * this.scale;
          let worldY = y * this.tileSize * this.scale;

          if (tileID === 74 || tileID === 75) {
            let tile = new WaterTile(
              worldX,
              worldY,
              tileID,
              this.tilesetImage,
              this.tileSize,
              this.tilesPerRow,
              this.firstGID,
              this.solidTiles,
              this.scale
            );
            GAME_ENGINE.addEntity(tile);
          }

          let tile = new Tile(
            worldX,
            worldY,
            tileID,
            this.tilesetImage,
            this.tileSize,
            this.tilesPerRow,
            this.firstGID,
            this.solidTiles,
            this.scale
          );
          GAME_ENGINE.addEntity(tile);
        }
      }
    }
  }
}
