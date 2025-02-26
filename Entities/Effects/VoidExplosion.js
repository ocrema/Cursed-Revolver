import { GAME_ENGINE } from "../../main.js";
import { Collider } from "../Collider.js";
import { EFFECTS_SPRITESHEET } from "../../Globals/Constants.js";


export class VoidExplosion extends Entity {
    constructor(pos) {
        super();
        this.x = pos.x;
        this.y = pos.y;
        this.isAttack = true;
        /*
        this.collider = new Collider(500, 500);
        for (let e of GAME_ENGINE.entities) {
            if (e.isEnemy && e.isColliding(this)) {
                e.queueAttack({ damage: 30, void: 4 });
            }
        }*/
        this.collider = null;
        window.ASSET_MANAGER.playAsset("./assets/sfx/explosion.wav");
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
            this.currentFrame * EFFECTS_SPRITESHEET.VOID_EXPLOSION_EFFECT.FRAME_WIDTH,
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

    }
}