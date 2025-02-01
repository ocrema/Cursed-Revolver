import { GameMap } from "./Entities.js";
import { Player } from "./Player.js";
import { Background } from "./Background.js";
import { Cactus } from "./Enemy.js";
import { Structure } from "./Structure.js";

export class Map1 extends GameMap {
  load() {
    console.log("Loading Map 1");
    GAME_ENGINE.addEntity(new Player());
    GAME_ENGINE.addEntity(new Cactus());
    GAME_ENGINE.addEntity(new Background());
    // Platform Parameters - X, Y, Width, Height

    // Main Floor (long ground platform)

    const mainPlatform = new Structure(0,400); 

    mainPlatform.addPlatform(0, 0, 200, 10); // Main floor
     mainPlatform.addPlatform(5, -50, 5, 10); // Left Pillar
    // mainPlatform.addPlatform(3200, -200, 1, 300); // Right Pillar

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
