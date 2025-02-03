import { GameMap } from "./Entities.js";
import { Player } from "./Player.js";
import { Background } from "./Background.js";
import { Cactus } from "./Enemy.js";
import { Structure } from "./Structure.js";
import { GAME_ENGINE } from "../main.js";
import { Platform } from "./Platform.js";

export class Map1 extends GameMap {
  load() {
    console.log("Loading Map 1");
    GAME_ENGINE.addEntity(new Player());
    GAME_ENGINE.addEntity(new Cactus(10, 10));
    GAME_ENGINE.addEntity(new Background());
    // Platform Parameters - X, Y, Width, Height

    // Main Floor (long ground platform)

    // const mainPlatform = new Structure(0, 800);
    // mainPlatform.addPlatform(0, 0, 100, 10); // Main floor
    // mainPlatform.addPlatform(5, -200, 1, 12); // Left Pillar
    GAME_ENGINE.addEntity(new Platform(0, 800, 100, 10));
    GAME_ENGINE.addEntity(new Platform(150, 400, 1, 6));
    GAME_ENGINE.addEntity(new Platform(-300, 20, 10, 1));
    //mainPlatform.addPlatform(50, -200, 1, 12); // Right Pillar

    // // Floating Platforms (Jumping platforms)
    // const horizontalFloatingPlatforms = new Structure(-200, 0);

    // // Parameters - x, y, width, height, scaleX, scaleY
    // horizontalFloatingPlatforms.addPlatform(-400, 100, 2, 80); // Left floating platform
    // horizontalFloatingPlatforms.addPlatform(100, 50, 2, 80); // Right floating platform
    // horizontalFloatingPlatforms.addPlatform(-100, -50, 3, 80); // Center higher platform
    // horizontalFloatingPlatforms.scale(2, 1);

    // Vertical Pillars
    //const verticalPillars = new Structure(1200, 400);

    // verticalPillars.addPlatform(300, -200, 1, 300); // Left Pillar
    // verticalPillars.addPlatform(600, -200, 1, 300); // Right Pillar
    // verticalPillars.scale(1.5,1.1);
  }
}
