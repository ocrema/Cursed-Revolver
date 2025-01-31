import { GameMap, Platform } from "./Entities.js";
import { Player } from "./Player.js";
import { Background } from "./Background.js";
import { Cactus } from "./Enemy.js";

export class Map1 extends GameMap {
    
    load() {
        console.log('Loading Map 1');
        GAME_ENGINE.addEntity(new Player());
        GAME_ENGINE.addEntity(new Cactus());
        GAME_ENGINE.addEntity(new Background());
        GAME_ENGINE.addEntity(new Platform(0, 400, 2000, 100));
        GAME_ENGINE.addEntity(new Platform(300, 200, 200, 400));
        GAME_ENGINE.addEntity(new Platform(1200, 200, 200, 400));
        GAME_ENGINE.addEntity(new Platform(-600, 0, 600, 100));

        const cactus1 = new Cactus();
        cactus1.x = 600;
        cactus1.y = -300;
        const cactus2 = new Cactus();
        cactus2.x = 1500;
        cactus2.y = -100;
        GAME_ENGINE.addEntity(cactus1);
        GAME_ENGINE.addEntity(cactus2);

    }
}