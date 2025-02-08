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

    // **Enemies**
    GAME_ENGINE.addEntity(new Cactus(600, 80));
    GAME_ENGINE.addEntity(new Cactus(1200, 80));
    GAME_ENGINE.addEntity(new Cactus(-900, 80));
    GAME_ENGINE.addEntity(new Cactus(150, -900));
    GAME_ENGINE.addEntity(new Spider(1000, 70));
    GAME_ENGINE.addEntity(new Spider(-700, 70));

    // **Main Ground (Expanded)**
    GAME_ENGINE.addEntity(new Platform(0, 500, 140, 10));

    // **Two Tall Vertical Pillars at Ends**
    GAME_ENGINE.addEntity(new Platform(-2500, 250, 3, 40)); // Left pillar
    GAME_ENGINE.addEntity(new Platform(2500, 250, 3, 40)); // Right pillar

    // **Floating Platforms (Spread further apart & Moved up)**
    GAME_ENGINE.addEntity(new Platform(-800, -400, 10, 1));
    GAME_ENGINE.addEntity(new Platform(0, -750, 8, 1));
    GAME_ENGINE.addEntity(new Platform(600, -700, 6, 1));
    GAME_ENGINE.addEntity(new Platform(-600, -900, 7, 1));

    // **Vertical Pillar for Spider**
    GAME_ENGINE.addEntity(new Platform(0, 40, 2, 6));

    GAME_ENGINE.addEntity(new Platform(-1200, -100, 5, 1));
    GAME_ENGINE.addEntity(new Platform(1300, -300, 5, 1));
    GAME_ENGINE.addEntity(new Platform(300, -400, 6, 1));

    // **Destructible Objects (Barrels)**
    GAME_ENGINE.addEntity(new Barrel(-400, 120));
    GAME_ENGINE.addEntity(new Barrel(900, 120));
    GAME_ENGINE.addEntity(new Barrel(565, -800));
    GAME_ENGINE.addEntity(new Barrel(1250, -400));
    GAME_ENGINE.addEntity(new Barrel(-1100, -200));
    GAME_ENGINE.addEntity(new Barrel(-500, -500));

    // **Tumbleweeds**
    GAME_ENGINE.addEntity(new Tumbleweed(-800, -250, "right"));
    GAME_ENGINE.addEntity(new Tumbleweed(700, -300, "left"));
    GAME_ENGINE.addEntity(new Tumbleweed(200, -500, "right"));
    GAME_ENGINE.addEntity(new Tumbleweed(-1100, 80, "right"));
  }
}
