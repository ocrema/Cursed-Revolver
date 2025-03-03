import { GAME_ENGINE } from "../../main.js";
import { Collider } from "../Collider.js";
import { EFFECTS_SPRITESHEET } from "../../Globals/Constants.js";
import { Entity } from "../Entities.js";
import * as Util from "../../Utils/Util.js";

export class VoidExplosion extends Entity {
    constructor(pos) {
        super();
        this.x = pos.x;
        this.y = pos.y;
        this.isAttack = true;
        this.timer = 0;
        this.expiration_time = 1.5;
        this.entityOrder = -.5;
        this.collider = new Collider(1000, 1000);
        for (let e of GAME_ENGINE.entities) {
            if (e.isEnemy && e.colliding(this)) {
                e.queueAttack({ damage: 40, void: 4 });
            }
        }
        this.collider = null;
        window.ASSET_MANAGER.playAsset("./assets/sfx/void_explosion.wav", 1 * Util.DFCVM(this));
    }

    draw(ctx) {
        ctx.save();
        ctx.shadowColor = "purple";
        ctx.shadowBlur = 10;
        ctx.translate(
            this.x - GAME_ENGINE.camera.x,
            this.y - GAME_ENGINE.camera.y
        );
        ctx.drawImage(
            window.ASSET_MANAGER.getAsset(
                EFFECTS_SPRITESHEET.VOID_EXPLOSION_EFFECT.URL
            ),
            Math.floor((this.timer / this.expiration_time) * 20) * EFFECTS_SPRITESHEET.VOID_EXPLOSION_EFFECT.FRAME_WIDTH,
            0,
            EFFECTS_SPRITESHEET.VOID_EXPLOSION_EFFECT.FRAME_WIDTH,
            EFFECTS_SPRITESHEET.VOID_EXPLOSION_EFFECT.FRAME_HEIGHT,
            -250,
            -250,
            500,
            500
        );
        ctx.restore();
    }

    update() {
        this.timer += GAME_ENGINE.clockTick;
        if (this.timer >= this.expiration_time) this.removeFromWorld = true;
    }
}