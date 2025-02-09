import { Collider } from "../Collider.js";
import { Entity } from "../Entities.js";
import * as Util from "../../Utils/Util.js";
import {
    EFFECTS_SPRITESHEET,
    SPELLS_SPRITESHEET,
} from "../../Globals/Constants.js";
import { GAME_ENGINE } from '../../main.js';

export class WaterWave extends Entity {
    constructor(pos, dir) {
        super();
        this.x = pos.x;
        this.y = pos.y;
        this.dir = dir;
        this.entityOrder = 3;
        this.speed = 2000;
        this.isAttack = true;
        this.experationTimer = .7;
        this.spriteScale = 3;
        this.thingsHit = [];

        window.ASSET_MANAGER.playAsset("./assets/sfx/waterwave.wav");


        this.addAnimation(
            SPELLS_SPRITESHEET.WATERWAVE.NAME,
            window.ASSET_MANAGER.getAsset(SPELLS_SPRITESHEET.WATERWAVE.URL),
            SPELLS_SPRITESHEET.WATERWAVE.FRAME_WIDTH,
            SPELLS_SPRITESHEET.WATERWAVE.FRAME_HEIGHT,
            SPELLS_SPRITESHEET.WATERWAVE.FRAME_COUNT,
            SPELLS_SPRITESHEET.WATERWAVE.FRAME_DURATION
        );
        this.setAnimation(SPELLS_SPRITESHEET.WATERWAVE.NAME, true);
        this.collider = new Collider(100, 100);
    }

    update() {

        // WaterWave movement
        this.x += Math.cos(this.dir) * this.speed * GAME_ENGINE.clockTick;
        this.y += Math.sin(this.dir) * this.speed * GAME_ENGINE.clockTick;

        for (let e of GAME_ENGINE.entities) {
            if (e.isPlayer || e.isAttack) continue;

            if (this.colliding(e) && !this.thingsHit.includes(e)) {
                if (e.isActor) {
                    e.queueAttack({ damage: 1, soaked: 10, stun: .4, x: this.x, y: this.y, launchMagnitude: 100 });
                    this.thingsHit.push(e);
                }
            }
        }

        this.experationTimer -= GAME_ENGINE.clockTick;
        if (this.experationTimer <= 0) this.removeFromWorld = true;

        this.updateAnimation(GAME_ENGINE.clockTick);
    }

    draw(ctx) {

        let frameWidth = SPELLS_SPRITESHEET.WATERWAVE.FRAME_WIDTH;
        let frameHeight = SPELLS_SPRITESHEET.WATERWAVE.FRAME_HEIGHT;


        ctx.save();
        ctx.translate(
            this.x - GAME_ENGINE.camera.x,
            this.y - GAME_ENGINE.camera.y
        );
        ctx.rotate(this.dir); // Rotate to match movement direction

        ctx.drawImage(
            window.ASSET_MANAGER.getAsset(
                SPELLS_SPRITESHEET.WATERWAVE.URL
            ),
            this.currentFrame * frameWidth,
            0,
            frameWidth,
            frameHeight,
            // using specified fireball scaling
            (-frameWidth * this.spriteScale) / 2,
            (-frameHeight * this.spriteScale) / 2,
            frameWidth * this.spriteScale,
            frameHeight * this.spriteScale
        );

        ctx.restore();

    }
}