import { Tile } from "./Tiles/Tile.js";
import { GAME_ENGINE } from "../../main.js";
import { SaloonTile } from "./Tiles/SaloonTile.js";
import { SpawnPointTile } from "./Tiles/SpawnPointTile.js";
import { TreeTile } from "./Tiles/TreeTile.js";
import { BackgroundTriggerTile } from "./Tiles/BackgroundTriggerTile.js";
import { SpiderwebTile } from "./Tiles/SpiderwebTile.js";
import { DeadTreeTile } from "./Tiles/DeadTreeTile.js";
import { SpiderWebObstacle } from "../Objects/SpiderWebObstacle.js";
import { SignTile } from "./Tiles/SignTile.js";
import { SIGN_TEXT } from "../../Globals/Constants.js";

export class Tilemap {
  constructor(
    mapPath,
    tilesetImages,
    tileSize = 16,
    atlasWidth = 320,
    solidTileIDs = [],
    scale = 4
  ) {
    window.TILEMAP = this;
    window.ENEMY_LIST = [];
    window.SOLID_TILES = [];
    this.mapPath = mapPath;
    this.tilesetImages = tilesetImages; // Store all tileset images
    this.tileSize = tileSize;
    this.tilesPerRow = atlasWidth / tileSize;
    this.tiles = [];
    this.mapWidth = 0;
    this.mapHeight = 0;
    this.tilesets = [];
    this.solidTiles = new Set(solidTileIDs);
    this.signTextIndex = 0;
    this.scale = scale;
    this.cactusSpawnPoints = [];
    this.cowboySpawnPoints = [];
    this.birdSpawnPoints = [];
    this.barrelSpawnPoints = [];
    this.backgroundTriggerPoints = [];
    this.tumbleweedTriggerPoints = [];
    this.spiderwebTriggerPoints = [];
    this.spiderSpawnPoints = [];
    this.growingTreeSpawnPoints = [];
    this.golemSpawnPoints = [];
    this.boulderSpawnPoints = [];
    this.spiderwebObstacleSpawnPoints = [];
    this.movingCowboySpawnPoints = [];
    this.wizardTeleportPoints = [];
    this.tileGrid = [];
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

    // Initialize tileGrid
    this.tileGrid = Array.from({ length: this.mapHeight }, () =>
      new Array(this.mapWidth).fill(null)
    );

    // Store tilesets with their firstGID
    this.tilesets = data.tilesets.map((tileset, index) => ({
      firstGID: tileset.firstgid,
      image: this.tilesetImages[index], // Map to corresponding image
    }));

    // console.log(this.tilesetImages);
    // console.log(this.tilesets);

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
    let signTiles = [];
    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {
        let tileID = this.tiles[y * this.mapWidth + x];

        if (tileID > 0) {
          let tileset = this.getTilesetForTile(tileID);
          if (!tileset) continue;

          if (!tileset.image) {
            console.error(`Tileset GID ${tileset.firstGID} image is undefined`);
          }
          let adjustedTileID = tileID; // Adjust tile ID relative to tileset
          let worldX = x * this.tileSize * this.scale;
          let worldY = y * this.tileSize * this.scale;

          let tileClass = Tile;
          let hideEnemySpawnPoints = false;
          switch (tileID) {
            case 105:
              tileClass = SpawnPointTile;
              break;

            case 102:
              tileClass = SaloonTile;
              break;
            case 103:
              tileClass = SignTile;
              break;
            case 104:
              tileClass = TreeTile;
              break;

            case 107:
              this.cactusSpawnPoints.push({ x: worldX, y: worldY });
              hideEnemySpawnPoints = true;
              break;

            case 108:
              this.cowboySpawnPoints.push({ x: worldX, y: worldY });
              hideEnemySpawnPoints = true;
              break;

            case 109:
              this.birdSpawnPoints.push({ x: worldX, y: worldY });
              hideEnemySpawnPoints = true;
              break;
            case 110:
              this.barrelSpawnPoints.push({ x: worldX, y: worldY });
              hideEnemySpawnPoints = true;
              break;
            case 111:
              tileClass = BackgroundTriggerTile;
              this.backgroundTriggerPoints.push({ x: worldX, y: worldY });
              break;
            case 112:
              this.tumbleweedTriggerPoints.push({ x: worldX, y: worldY });
              hideEnemySpawnPoints = true;
              break;
            case 113:
              tileClass = SpiderwebTile;
              this.spiderwebTriggerPoints.push({ x: worldX, y: worldY });
              break;
            case 114:
              this.spiderSpawnPoints.push({ x: worldX, y: worldY });
              hideEnemySpawnPoints = true;
              break;
            case 115:
              this.growingTreeSpawnPoints.push({ x: worldX, y: worldY });
              hideEnemySpawnPoints = true;
              break;
            case 116:
              this.golemSpawnPoints.push({ x: worldX, y: worldY });
              hideEnemySpawnPoints = true;
              break;
            case 117:
              this.boulderSpawnPoints.push({ x: worldX, y: worldY });
              hideEnemySpawnPoints = true;
              break;
            case 118:
              this.spiderwebObstacleSpawnPoints.push({ x: worldX, y: worldY });
              hideEnemySpawnPoints = true;
              break;
            case 119:
              this.movingCowboySpawnPoints.push({ x: worldX, y: worldY });
              hideEnemySpawnPoints = true;
              break;
            case 120:
              tileClass = DeadTreeTile;
              break;
            case 123:
              this.wizardTeleportPoints.push({ x: worldX, y: worldY });
              hideEnemySpawnPoints = true;
              break;
            default:
              break;
          }

          let tile = new tileClass(
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

          if (tile.tileID === 103) {
            signTiles.push({ x: worldX, y: worldY, tile: tile });
          }

          if (hideEnemySpawnPoints) {
            tile.entityOrder = -10000;
          }
          this.tileGrid[y][x] = tile;

          // excludes interior tile, water tiles, and any spawnpoint tiles
          if (
            tile.tileID != 6 &&
            tile.tileID != 75 &&
            tile.tileID != 76 &&
            tile.tileID < 101
          ) {
            window.SOLID_TILES.push(tile);
          }

          if (
            tile.tileID == 6 || // interior 
            tile.tileID == 75 || // water 
            tile.tileID == 76 || // water 
            (tile.tileID >= 101 && tile.tileID <= 123) // all spawnpoints/props/etc
          ) {
            GAME_ENGINE.addTile(tile);
          } else {
            GAME_ENGINE.addEntity(tile);
          }
        }
      }
      signTiles.sort((a, b) => a.x - b.x);

      // Step 3: Assign sign texts sequentially
      signTiles.forEach((signObj, index) => {
        signObj.tile.signText = SIGN_TEXT[index] || "NOT WORK";
      });
    }
  }

  getTileAt(x, y) {
    let gridX = Math.floor(x / (this.tileSize * this.scale));
    let gridY = Math.floor(y / (this.tileSize * this.scale));

    if (
      gridX < 0 ||
      gridX >= this.mapWidth ||
      gridY < 0 ||
      gridY >= this.mapHeight
    ) {
      return null;
    }
    return this.tileGrid[gridY][gridX];
  }

  getCactusSpawnPoints() {
    return this.cactusSpawnPoints;
  }

  getCowboySpawnPoints() {
    return this.cowboySpawnPoints;
  }

  getBirdSpawnPoints() {
    return this.birdSpawnPoints;
  }

  getBarrelSpawnPoints() {
    return this.barrelSpawnPoints;
  }

  getBackgroundTriggerPoints() {
    return this.backgroundTriggerPoints;
  }

  getTumbleweedTriggerPoints() {
    return this.tumbleweedTriggerPoints;
  }

  getSpiderwebTriggerPoints() {
    return this.spiderwebTriggerPoints;
  }

  getSpiderSpawnPoints() {
    return this.spiderSpawnPoints;
  }

  getGrowingTreeSpawnPoints() {
    return this.growingTreeSpawnPoints;
  }
  getGolemSpawnPoints() {
    return this.golemSpawnPoints;
  }

  getBoulderSpawnPoints() {
    return this.boulderSpawnPoints;
  }

  getSpiderwebObstacleSpawnPoints() {
    return this.spiderwebObstacleSpawnPoints;
  }

  getMovingCowboySpawnPoints() {
    return this.movingCowboySpawnPoints;
  }

  getWizardTeleportPoints() {
    return this.wizardTeleportPoints;
  }
}
