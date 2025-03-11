import { Actor } from "../Actor.js";
import { Player } from "../Player/Player.js";
import * as Util from "../../Utils/Util.js";
import { Collider } from "../Collider.js";
import { GAME_ENGINE } from "../../main.js";
import { Tile } from "../Map/Tiles/Tile.js";
import { VoidExplosion } from "../Effects/VoidExplosion.js";
import { Fireball } from "../Spells/Fireball.js";
import { Icicle } from "../Spells/Icicle.js";
import { VoidOrb } from "../Spells/VoidOrb.js";
import { Entity } from "../Entities.js";
import {
  EFFECTS_SPRITESHEET,
  SPELLS_SPRITESHEET,
} from "../../Globals/Constants.js";

export class Wizard extends Actor {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.entityOrder = 3;
    this.width = 150;
    this.height = 200;
    this.scale = 3;
    this.health = 500;
    this.maxHealth = 500;
    this.isEnemy = true;
    this.isWizard = true;
    this.flip = false; // False = facing right, True = facing left
    this.scale = 2.2;
    this.spell = 2;

    this.collider = new Collider(this.width, this.height);
    this.locations = [];
    // this.locations = [
    //   { x: 29963, y: 2826 },
    //   { x: 30862, y: 2853 },
    //   { x: 31535, y: 2862 },
    //   { x: 32084, y: 2865 },
    // ];
    const mapPoints = window.MAP.wizardTeleportPoints;
    for (let i = 0; i < mapPoints.length; i++) {
      this.locations.push(mapPoints[i]);
    }
    this.locations.sort((a, b) => a.x - b.x);
    let i;
    if (this.locations.length % 2 === 0) {
      if (this.locations[Math.floor(this.locations.length/2)-1].y > this.locations[Math.floor(this.locations.length/2)].y) 
        i = Math.floor(this.locations.length/2);
      else 
        i = Math.floor(this.locations.length/2)-1;
    } else {
      i = Math.floor(this.locations.length/2);
    }
    let temp = this.locations[i];
    this.locations[i] = this.locations[0];
    this.locations[0] = temp;
    //console.log("locations" + this.locations);
    this.locationIndex = -1;
    this.spritesheets = {
      idle: window.ASSET_MANAGER.getAsset("./assets/enemy/wizard/Idle.png"),
      death: window.ASSET_MANAGER.getAsset("./assets/enemy/wizard/Death.png"),
      attack: window.ASSET_MANAGER.getAsset("./assets/enemy/wizard/Attack.png"),
    };
    this.animation = "idle";
    this.currentFrame = 0;

    this.timeSinceTeleport = 6;
    this.minTeleportTime = 2.5;
    this.maxTeleportTime = 8;

    this.timeSinceAttack = 0;
    this.maxAttackDelay = 3;
  }

  update() {
    super.update();
    this.recieveAttacks();
    this.recieveEffects();

    this.currentFrame = this.currentFrame + GAME_ENGINE.clockTick * 8;

    if (this.dead) {
      this.currentFrame = Math.min(this.currentFrame, 6);
      return;
    }
    if (this.animation === "idle") this.currentFrame %= 6;

    if (this.health <= 0) {
      this.animation = "death";
      this.currentFrame = 0;
      this.dead = true;
      return;
    }

    const player = window.PLAYER;

    if (!this.player) {
      if (player) {
        this.player = player;
      }
      //   for (let e of GAME_ENGINE.entities) {
      //     if (e instanceof Player) {
      //       this.player = e;
      //     }
      //   }
    }

    // spawn in
    if (this.locationIndex === -1) {
      if (Util.getDistance(this.locations[0], this.player) > 1000 || window.MAP.totalEnemies > 0) return;

      this.locationIndex = 0;
      this.x = this.locations[this.locationIndex].x;
      this.y = this.locations[this.locationIndex].y;
      for (let e of GAME_ENGINE.entities) {
        if (e instanceof Tile && e.colliding(this)) {
          this.moveAgainstY(e);
        }
      }
      GAME_ENGINE.addEntity(new VoidExplosion(this));
      this.recieved_attacks = [];
      window.ASSET_MANAGER.playTrack(2);
    }

    this.flip = this.x > this.player.x;

    // teleport
    this.timeSinceTeleport += GAME_ENGINE.clockTick;
    if (this.timeSinceTeleport > this.maxTeleportTime) {
      this.teleport();
    } else if (this.timeSinceTeleport > this.minTeleportTime) {
      if (
        this.effects.burn > 0 ||
        this.effects.shock > 0 ||
        this.effects.frozen > 0 ||
        this.effects.void > 0
      ) {
        this.teleport();
      } else if (Util.getDistance(this, this.player) < 300) {
        this.teleport();
      } else {
        for (let e of GAME_ENGINE.entities) {
          if (
            (e instanceof Fireball || e instanceof Icicle) &&
            Util.getDistance(this, e) < 300
          ) {
            this.teleport();
            break;
          }
        }
      }
    }

    // attack
    this.timeSinceAttack += GAME_ENGINE.clockTick;
    if (this.timeSinceAttack >= this.maxAttackDelay) {
      this.timeSinceAttack = 0;
      this.animation = "attack";
      this.currentFrame = 0;
      let spells = [];
      for (let i = 0; i < 3; i++) {
        if (i != this.spell) spells.push(i);
      }
      this.spell = spells[Math.floor(Math.random() * 2)];
      this.attackReleased = false;
      window.ASSET_MANAGER.playAsset(
        "./assets/sfx/wizard_charge.wav",
        2 * Util.DFCVM(this)
      );
    } else if (this.animation === "attack" && this.currentFrame >= 8) {
      this.animation = "idle";
      this.currentFrame = 0;
    } else if (
      this.animation === "attack" &&
      this.currentFrame >= 5 &&
      !this.attackReleased
    ) {
      this.attackReleased = true;
      const angle = Util.getAngle(this, this.player);
      if (this.spell === 0) {
        GAME_ENGINE.addEntity(new EvilFireballShower(this, this.flip, 500));
      } else if (this.spell === 1) {
        GAME_ENGINE.addEntity(new EvilIcicle(this, angle));
        GAME_ENGINE.addEntity(new EvilIcicle(this, angle + 0.2));
        GAME_ENGINE.addEntity(new EvilIcicle(this, angle - 0.2));
      } else if (this.spell === 2) {
        GAME_ENGINE.addEntity(new EvilVoidOrb(this, angle));
      }
    }
  }

  teleport() {
    this.timeSinceTeleport = 0;
    let index = Math.floor(Math.random() * (this.locations.length - 1));
    if (index >= this.locationIndex) index++;
    GAME_ENGINE.addEntity(
      new TeleportLightning(
        this.locations[this.locationIndex],
        this.locations[index]
      )
    );
    this.locationIndex = index;
    this.x = this.locations[this.locationIndex].x;
    this.y = this.locations[this.locationIndex].y;
    for (let e of GAME_ENGINE.entities) {
      if (e instanceof Tile && e.colliding(this)) {
        this.moveAgainstY(e);
      }
    }
    //GAME_ENGINE.addEntity(new VoidExplosion(this));
    this.recieved_attacks = [];
    this.effects = {};
  }

  draw(ctx) {
    if (this.locationIndex === -1) return;

    ctx.save(); // Save the current transformation state
    ctx.translate(-GAME_ENGINE.camera.x, -GAME_ENGINE.camera.y);
    // Apply horizontal flipping and scaling
    if (this.flip) {
      ctx.scale(-1, 1);
      ctx.translate(-this.x * 2, 0);
    }

    ctx.translate(this.x, this.y); // Move to the entity's position
    ctx.scale(this.scale, this.scale); // Apply scaling factor

    if (this.animation === "attack") {
      ctx.shadowBlur = 30;
      ctx.shadowColor = ["orange", "cyan", "purple"][this.spell];
    }

    ctx.drawImage(
      this.spritesheets[this.animation], // Image
      Math.floor(this.currentFrame) * 231, // Source X
      0, // Source Y (single row)
      231, // Source Width
      190, // Source Height
      -231 / 2, // Destination X (centered)
      -190 / 2, // Destination Y (centered)
      231, // Destination Width
      190 // Destination Height
    );

    ctx.restore(); // Restore the transformation state
    this.drawEffects(ctx, 1.3);
    this.drawHealthBar(ctx);
  }
}

class TeleportLightning extends Entity {
  constructor(start, end) {
    super();
    this.start = start;
    this.end = end;
    this.lifetime = 0.3;
    this.time = 0;
    this.entityOrder = 1;
    window.ASSET_MANAGER.playAsset("./assets/sfx/lightning.wav", 0.4);
  }
  update() {
    this.time += GAME_ENGINE.clockTick;
    if (this.time > this.lifetime) this.removeFromWorld = true;
  }
  draw(ctx) {
    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = "yellow";
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = Math.random() * 10 + 5;
    let maxOffset = 120;
    ctx.beginPath();
    ctx.moveTo(
      this.start.x -
        GAME_ENGINE.camera.x +
        Math.random() * maxOffset -
        maxOffset / 2,
      this.start.y -
        GAME_ENGINE.camera.y +
        Math.random() * maxOffset -
        maxOffset / 2
    );
    ctx.lineTo(
      this.end.x -
        GAME_ENGINE.camera.x +
        Math.random() * maxOffset -
        maxOffset / 2,
      this.end.y -
        GAME_ENGINE.camera.y +
        Math.random() * maxOffset -
        maxOffset / 2
    );

    ctx.stroke();

    ctx.strokeStyle = "white";
    ctx.lineWidth = Math.random() * 5 + 5;
    maxOffset = 120;
    ctx.beginPath();
    ctx.moveTo(
      this.start.x -
        GAME_ENGINE.camera.x +
        Math.random() * maxOffset -
        maxOffset / 2,
      this.start.y -
        GAME_ENGINE.camera.y +
        Math.random() * maxOffset -
        maxOffset / 2
    );
    ctx.lineTo(
      this.end.x -
        GAME_ENGINE.camera.x +
        Math.random() * maxOffset -
        maxOffset / 2,
      this.end.y -
        GAME_ENGINE.camera.y +
        Math.random() * maxOffset -
        maxOffset / 2
    );

    ctx.stroke();
    ctx.restore();
  }
}

class EvilFireballShower extends Entity {
  constructor(pos, flip, heightOffset) {
    super();
    this.x = pos.x;
    this.y = pos.y - heightOffset;
    this.flip = flip;
    this.timeBetweenFireballs = 0.15;
    this.time = 0;
    this.speed = 1200;
    this.numFireballs = 5;
    this.entityOrder = 2;
  }
  update() {
    this.time += GAME_ENGINE.clockTick;
    this.x = this.x + (this.flip ? -1 : 1) * this.speed * GAME_ENGINE.clockTick;
    if (this.time > this.timeBetweenFireballs) {
      this.time = 0;
      this.numFireballs--;
      GAME_ENGINE.addEntity(new EvilFireball(this));
      if (this.numFireballs === 0) this.removeFromWorld = true;
    }
  }
}

class EvilFireball extends Fireball {
  constructor(pos) {
    super(pos, Math.PI / 2, { x: 0, y: 0 });
  }
  update() {
    this.y += this.speed * GAME_ENGINE.clockTick;

    for (let e of GAME_ENGINE.entities) {
      if (e.isEnemy || e.isAttack) continue;

      if (this.colliding(e)) {
        if (e.isPlayer) {
          e.queueAttack({ damage: 25 });
        }
        this.removeFromWorld = true;
        window.ASSET_MANAGER.playAsset(
          "./assets/sfx/fireball_impact.wav",
          Util.DFCVM(this)
        );
        return;
      }
    }

    this.experationTimer -= GAME_ENGINE.clockTick;
    if (this.experationTimer <= 0) this.removeFromWorld = true;

    this.updateAnimation(GAME_ENGINE.clockTick);
  }
}

class EvilIcicle extends Icicle {
  constructor(pos, dir) {
    super(pos, dir, { x: 0, y: 0 });
  }
  update() {
    this.experationTimer -= GAME_ENGINE.clockTick;
    if (this.experationTimer <= 0) this.removeFromWorld = true;

    if (this.thingHit && this.experationTimer > 0.3) {
      this.x = this.thingHit.x + this.stuckXOffset;
      this.y = this.thingHit.y + this.stuckYOffset;
      return;
    } else if (this.thingHit) {
      this.spritesheet = SPELLS_SPRITESHEET.ICICLE_EXPLOSION;
      this.setAnimation(SPELLS_SPRITESHEET.ICICLE_EXPLOSION.NAME, true);
      this.updateAnimation(GAME_ENGINE.clockTick);
      return;
    }

    // WaterWave movement
    this.x += Math.cos(this.dir) * this.speed * GAME_ENGINE.clockTick;
    this.y += Math.sin(this.dir) * this.speed * GAME_ENGINE.clockTick;

    for (let e of GAME_ENGINE.entities) {
      if (e.isEnemy || e.isAttack) continue;

      if (this.colliding(e)) {
        if (e.isPlayer) {
          e.queueAttack({ damage: 25 });
        }
        this.thingHit = e;
        this.stuckXOffset = this.x - e.x;
        this.stuckYOffset = this.y - e.y;
        this.collider = null;
        this.experationTimer = 1;
        window.ASSET_MANAGER.playAsset(
          "./assets/sfx/icicle_impact.wav",
          0.7 * Util.DFCVM(this)
        );
        return;
      }
    }

    this.updateAnimation(GAME_ENGINE.clockTick);
  }
}

class EvilVoidOrb extends VoidOrb {
  constructor(pos, dir) {
    super(pos, dir, { x: 0, y: 0 });
    this.dps = 10;
    this.hitCooldown = 0;
    this.timeBetweenHits = 0.3;
    this.experationTimer = 4;
  }

  update() {
    this.x += Math.cos(this.dir) * this.speed * GAME_ENGINE.clockTick;
    this.y += Math.sin(this.dir) * this.speed * GAME_ENGINE.clockTick;

    const player = window.PLAYER;
    if (player) {
      if (this.hitCooldown === 0 && this.colliding(player)) {
        player.queueAttack({ damage: this.dps * this.timeBetweenHits });
        this.hitCooldown = this.timeBetweenHits;
      }
    }

    this.hitCooldown = Math.max(this.hitCooldown - GAME_ENGINE.clockTick, 0);

    this.experationTimer -= GAME_ENGINE.clockTick;
    if (this.experationTimer <= 0) this.removeFromWorld = true;
    this.updateAnimation(GAME_ENGINE.clockTick);
  }
}
