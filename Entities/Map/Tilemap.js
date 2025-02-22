import { Tile } from "./Tiles/Tile.js";
import { GAME_ENGINE } from "../../main.js";
import { WaterTile } from "./Tiles/WaterTile.js";
import { SpikeTile } from "./Tiles/SpikeTile.js";
import { SaloonTile } from "./Tiles/SaloonTile.js";

export class Tilemap {
  constructor(
    mapPath,
    tilesetImages,
    tileSize = 16,
    atlasWidth = 320,
    solidTileIDs = [],
    scale = 4
  ) {
    this.mapPath = mapPath;
    this.tilesetImages = tilesetImages; // Store all tileset images
    this.tileSize = tileSize;
    this.tilesPerRow = atlasWidth / tileSize;
    this.tiles = [];
    this.mapWidth = 0;
    this.mapHeight = 0;
    this.tilesets = [];
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

    // Store tilesets with their firstGID
    this.tilesets = data.tilesets.map((tileset, index) => ({
      firstGID: tileset.firstgid,
      image: this.tilesetImages[index], // Map to corresponding image
    }));

    this.generateTiles();
  }

  getTilesetForTile(tileID) {
    // Find the correct tileset for the given tile ID
    let selectedTileset = null;
    for (let i = this.tilesets.length - 1; i >= 0; i--) {
      if (tileID >= this.tilesets[i].firstGID) {
        selectedTileset = this.tilesets[i];
        break;
      }
    }
    return selectedTileset;
  }

  generateTiles() {
    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {
        let tileID = this.tiles[y * this.mapWidth + x];

        if (tileID > 0) {
          let tileset = this.getTilesetForTile(tileID);
          if (!tileset) continue;

          let adjustedTileID = tileID; // Adjust tile ID relative to tileset
          let worldX = x * this.tileSize * this.scale;
          let worldY = y * this.tileSize * this.scale;

          if (tileID === 74 || tileID === 75) {
            let tile = new WaterTile(
              worldX,
              worldY,
              adjustedTileID,
              tileset.image,
              this.tileSize,
              this.tilesPerRow,
              tileset.firstGID,
              this.solidTiles,
              this.scale
            );
            GAME_ENGINE.addEntity(tile);
          }

          if (tileID == 101) {
            let spikeTile = new SpikeTile(
              worldX,
              worldY,
              adjustedTileID,
              tileset.image,
              this.tileSize,
              this.tilesPerRow,
              tileset.firstGID,
              this.solidTiles,
              this.scale
            );
            GAME_ENGINE.addEntity(spikeTile);
          }

          if (tileID == 103) {
            console.log(tileset.image);
            let saloonTile = new SaloonTile(
              worldX,
              worldY,
              adjustedTileID,
              tileset.image,
              this.tileSize,
              this.tilesPerRow,
              tileset.firstGID,
              this.solidTiles,
              this.scale
            );
            GAME_ENGINE.addEntity(saloonTile);
          }

          let tile = new Tile(
            worldX,
            worldY,
            adjustedTileID,
            tileset.image,
            this.tileSize,
            this.tilesPerRow,
            tileset.firstGID,
            this.solidTiles,
            this.scale
          );
          GAME_ENGINE.addEntity(tile);
        }
      }
    }
  }
}
