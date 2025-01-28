import { Timer } from "../Utils/timer.js";
import { Camera } from "../Core/Camera.js";

export class GameEngine {
  constructor(options) {
    // if the instance already exists, return it
    if (!window.GAME_ENGINE) {
      window.GAME_ENGINE = this; // Singleton instance
    }
    // What you will use to draw
    // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
    this.ctx = null;

    // Everything that will be updated and drawn each frame
    this.entities = [];

    // Information on the input
    this.click = null;
    this.mouse = null;
    this.wheel = null;
    this.keys = {};

    // Options and the Details
    this.options = options || {
      debugging: false,
    };

    this.mouse = {x: 0, y: 0};

    this.width = 2000;
    this.height = 1000;

    this.camera = new Camera();
    this.addEntity(this.camera);
    this.debug_colliders = true;
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
    const getXandY = (e) => ({
      x:
        (e.clientX - this.ctx.canvas.getBoundingClientRect().left) /
          this.x_scale -
        this.width / 2,
      y:
        (e.clientY - this.ctx.canvas.getBoundingClientRect().top) /
          this.y_scale -
        this.height / 2,
    });

    this.ctx.canvas.addEventListener("mousemove", (e) => {
      if (this.options.debugging) {
        console.log("MOUSE_MOVE", getXandY(e));
      }
      this.mouse = getXandY(e);
    });

    this.ctx.canvas.addEventListener("click", (e) => {
      if (this.options.debugging) {
        console.log("CLICK", getXandY(e));
      }
      this.click = getXandY(e);
    });

    this.ctx.canvas.addEventListener("wheel", (e) => {
      if (this.options.debugging) {
        console.log("WHEEL", getXandY(e), e.wheelDelta);
      }
      e.preventDefault(); // Prevent Scrolling
      this.wheel = e;
    });

    this.ctx.canvas.addEventListener("contextmenu", (e) => {
      if (this.options.debugging) {
        console.log("RIGHT_CLICK", getXandY(e));
      }
      e.preventDefault(); // Prevent Context Menu
      this.rightclick = getXandY(e);
    });

    this.ctx.canvas.addEventListener(
      "keydown",
      (event) => (this.keys[event.key] = true)
    );
    this.ctx.canvas.addEventListener(
      "keyup",
      (event) => (this.keys[event.key] = false)
    );

    const getMouseButton = (event) => {
      if (event.button == 0) return 1;
      if (event.button == 2) return 2;
      else return -1;
    };

    this.ctx.canvas.addEventListener(
      'mousedown',
      (event) => {
        const button = getMouseButton(event);
        if (button != -1) {
          this.keys['m' + button] = true;
        }
      }
    );

    this.ctx.canvas.addEventListener(
      'mouseup',
      (event) => {
        const button = getMouseButton(event);
        if (button != -1) {
          this.keys['m' + button] = false;
        }
      }
    );
  }

  addEntity(entity) {
    //this.entities.push(entity);

    let start = 0;
    let end = this.entities.length - 1;
    const entityOrder = entity.entityOrder;
    let i = 0;
    while (i < this.entities.length && this.entities[i].entityOrder < entityOrder) i++;
  
    // Insert the entity at the determined index
    this.entities.splice(i, 0, entity);
  }

  draw() {
    // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    
    for (let i = 0; i < this.entities.length; i++) {
      //console.log(this.entities);
      this.entities[i].draw(this.ctx);
    }
    
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
    let entitiesCount = this.entities.length;

    for (let i = 0; i < entitiesCount; i++) {
      let entity = this.entities[i];

      if (!entity.removeFromWorld) {
        entity.update();
      }
    }

    for (let i = this.entities.length - 1; i >= 0; --i) {
      if (this.entities[i].removeFromWorld) {
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
