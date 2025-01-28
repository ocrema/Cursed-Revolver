import { Timer } from "../Utils/timer.js";
import { Camera } from "../Core/Camera.js";
import { PauseMenu } from "../Entities/PauseMenu.js"; // Adjust path if necessary


export class GameEngine {
  constructor(options) {
    // Singleton instance
    if (!window.GAME_ENGINE) {
      window.GAME_ENGINE = this;
    }

    this.ctx = null; // Canvas context
    this.entities = [];
    this.keys = {};
    this.mouse = { x: 0, y: 0 };
    this.options = options || { debugging: false };
    this.width = 2000;
    this.height = 1000;
    this.camera = new Camera();
    this.addEntity(this.camera);
    this.debug_colliders = true;

    // Reference to GameLogicController
    this.GAME_CONTROLLER = null;

    return window.GAME_ENGINE;
  }

  init(ctx) {
    this.ctx = ctx;
    this.startInput();
    this.timer = new Timer();

    const resize = () => {
      const current_aspect_ratio = window.innerWidth / window.innerHeight;
      const desired_aspect_ratio = this.width / this.height;

      ctx.resetTransform();

      if (desired_aspect_ratio > current_aspect_ratio) {
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerWidth / desired_aspect_ratio;
      } else {
        this.ctx.canvas.height = window.innerHeight;
        this.ctx.canvas.width = window.innerHeight * desired_aspect_ratio;
      }
      this.x_scale = this.ctx.canvas.width / this.width;
      this.y_scale = this.ctx.canvas.height / this.height;
      ctx.scale(this.x_scale, this.y_scale);
      ctx.translate(this.width / 2, this.height / 2);
    };

    window.addEventListener("resize", resize);
    resize();
  }

  start() {
    this.running = true;
    const gameLoop = () => {
      this.loop();
      requestAnimFrame(gameLoop, this.ctx.canvas);
    };
    gameLoop();
  }

  startInput() {
    this.ctx.canvas.addEventListener("keydown", (event) => {
      this.keys[event.key] = true;
      console.log(`Key down: ${event.key}`); // Debugging input
    });

    this.ctx.canvas.addEventListener("keyup", (event) => {
      this.keys[event.key] = false;
      console.log(`Key up: ${event.key}`); // Debugging input
    });

    this.ctx.canvas.addEventListener("mousemove", (e) => {
      const getXandY = {
        x:
          (e.clientX - this.ctx.canvas.getBoundingClientRect().left) /
            this.x_scale -
          this.width / 2,
        y:
          (e.clientY - this.ctx.canvas.getBoundingClientRect().top) /
            this.y_scale -
          this.height / 2,
      };
      this.mouse = getXandY;
    });
  }

  addEntity(entity) {
    if (!entity || typeof entity.update !== "function" || typeof entity.draw !== "function") {
      console.warn("Invalid entity added to GameEngine:", entity);
      return;
    }

    const entityOrder = entity.entityOrder || 0; // Default entity order
    let i = 0;
    while (i < this.entities.length && this.entities[i].entityOrder < entityOrder) i++;

    // Insert the entity at the determined index
    this.entities.splice(i, 0, entity);
  }

  draw() {
    // Clear the canvas
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    // Draw each entity
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].draw(this.ctx);
    }

    // Debugging: Draw colliders
    if (this.debug_colliders) {
      this.ctx.lineWidth = 5;
      this.ctx.strokeStyle = "green";
      for (let e of this.entities) {
        if (e.colliders) {
          for (let c of e.colliders) {
            this.ctx.strokeRect(
              e.x - this.camera.x + c.x_offset - c.width / 2,
              e.y - this.camera.y + c.y_offset - c.height / 2,
              c.width,
              c.height
            );
          }
        }
      }
    }
  }

  update() {
    // If the game is paused, update only the PauseMenu entity
    if (this.GAME_CONTROLLER && this.GAME_CONTROLLER.isPaused) {
      for (let entity of this.entities) {
        if (entity instanceof PauseMenu && entity.isVisible) {
          console.log("Updating PauseMenu"); // Debug PauseMenu updates
          entity.update(); // Ensure PauseMenu processes input
        }
      }
      return; // Skip updates for all other entities
    }

    // Normal update logic when not paused
    for (let entity of this.entities) {
      if (entity && typeof entity.update === "function" && !entity.removeFromWorld) {
        entity.update();
      }
    }

    // Remove entities marked for removal
    for (let i = this.entities.length - 1; i >= 0; --i) {
      const entity = this.entities[i];
      if (entity && entity.removeFromWorld) {
        this.entities.splice(i, 1);
      }
    }
  }

  loop() {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
  }
}



// KV Le was here :)
