import { Collider } from "../Collider.js";
import { Entity } from "../Entities.js";
import * as Util from "../../Utils/Util.js";
import {
    EFFECTS_SPRITESHEET,
    SPELLS_SPRITESHEET,
} from "../../Globals/Constants.js";
import { GAME_ENGINE } from '../../main.js';

export class VoidOrb extends Entity {
    constructor(pos, dir) {
        super();
        this.x = pos.x;
        this.y = pos.y;
        this.dir = dir;
        this.entityOrder = 3;
        this.speed = 150;
        this.isAttack = true;
        this.experationTimer = 5;
        this.spriteScale = 7;

        //window.ASSET_MANAGER.playAsset("./assets/sfx/waterwave.wav");


        this.addAnimation(
            SPELLS_SPRITESHEET.VOIDORB.NAME,
            window.ASSET_MANAGER.getAsset(SPELLS_SPRITESHEET.VOIDORB.URL),
            SPELLS_SPRITESHEET.VOIDORB.FRAME_WIDTH,
            SPELLS_SPRITESHEET.VOIDORB.FRAME_HEIGHT,
            SPELLS_SPRITESHEET.VOIDORB.FRAME_COUNT,
            SPELLS_SPRITESHEET.VOIDORB.FRAME_DURATION
        );
        this.setAnimation(SPELLS_SPRITESHEET.VOIDORB.NAME, true);
        this.collider = new Collider(400, 400);

        this.x += Math.cos(this.dir) * 100;
        this.y += Math.sin(this.dir) * 100;
    }

    update() {

        this.x += Math.cos(this.dir) * this.speed * GAME_ENGINE.clockTick;
        this.y += Math.sin(this.dir) * this.speed * GAME_ENGINE.clockTick;

        /*
        for (let e of GAME_ENGINE.entities) {
            if (e.isPlayer || e.isAttack) continue;

            if (this.colliding(e) && !this.thingsHit.includes(e)) {
                if (e.isActor) {
                    e.queueAttack({ damage: 1, soaked: 10, stun: .4, x: this.x, y: this.y, launchMagnitude: 100 });
                    this.thingsHit.push(e);
                }
            }
        }
            */

        this.experationTimer -= GAME_ENGINE.clockTick;
        if (this.experationTimer <= 0) this.removeFromWorld = true;

        this.updateAnimation(GAME_ENGINE.clockTick);
    }

    draw(ctx) {

        let frameWidth = SPELLS_SPRITESHEET.VOIDORB.FRAME_WIDTH;
        let frameHeight = SPELLS_SPRITESHEET.VOIDORB.FRAME_HEIGHT;


        ctx.save();
        ctx.translate(
            this.x - GAME_ENGINE.camera.x,
            this.y - GAME_ENGINE.camera.y
        );
        //ctx.rotate(this.dir); // Rotate to match movement direction

        ctx.drawImage(
            window.ASSET_MANAGER.getAsset(
                SPELLS_SPRITESHEET.VOIDORB.URL
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