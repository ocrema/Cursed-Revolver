import { GameMap } from "../Entities.js";
import { Player } from "../Player/Player.js";
import { Background } from "./Background.js";
import { Cactus, Spider } from "../Enemy/Enemy.js";
import { GAME_ENGINE } from "../../main.js";
import { Platform } from "./Platform.js";
import { Barrel } from "../Objects/Barrel.js";
import { Tumbleweed } from "../Objects/Tumbleweed.js";

export class Map1 extends GameMap {
  load() {
    // ground level is 80 
    GAME_ENGINE.addEntity(new Player());
    GAME_ENGINE.addEntity(new Background());

    // Enemies
    GAME_ENGINE.addEntity(new Cactus(500, 80));
    GAME_ENGINE.addEntity(new Cactus(1000, 80));
    GAME_ENGINE.addEntity(new Spider(800, 70));
    GAME_ENGINE.addEntity(new Cactus(250, -450)); 
    GAME_ENGINE.addEntity(new Cactus(-450, 80)); 


    // Main Ground
    GAME_ENGINE.addEntity(new Platform(0, 500, 100, 10));

    // Platforms Under Barrels
    GAME_ENGINE.addEntity(new Platform(-600, -200, 7, 1)); 
    GAME_ENGINE.addEntity(new Platform(1000, -270, 7, 1)); 
    GAME_ENGINE.addEntity(new Platform(200, -310, 7, 1)); 
    GAME_ENGINE.addEntity(new Platform(800, -430, 7, 1)); 
    GAME_ENGINE.addEntity(new Platform(-1000, -120, 7, 1)); 
    GAME_ENGINE.addEntity(new Platform(-400, -420, 7, 1)); 

    // **Destructible Objects (Barrels)**
    GAME_ENGINE.addEntity(new Barrel(-200, 120));
    GAME_ENGINE.addEntity(new Barrel(800, 120));
    GAME_ENGINE.addEntity(new Barrel(-600, -280));
    GAME_ENGINE.addEntity(new Barrel(1000, -330));
    GAME_ENGINE.addEntity(new Barrel(110, -400));
    GAME_ENGINE.addEntity(new Barrel(800, -480));
    GAME_ENGINE.addEntity(new Barrel(-1000, -180));
    GAME_ENGINE.addEntity(new Barrel(-400, -480));

    // Tumbleweeds
    GAME_ENGINE.addEntity(new Tumbleweed(-500, -250, "right"));
    GAME_ENGINE.addEntity(new Tumbleweed(500, -250, "left"));
    GAME_ENGINE.addEntity(new Tumbleweed(100, -400, "right")); // Bouncing off a platform
  }
}
