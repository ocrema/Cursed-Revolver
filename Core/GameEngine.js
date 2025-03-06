import { Timer } from "../Utils/Timer.js";
import { Camera } from "../Core/Camera.js";
import { PauseMenu } from "../Entities/PauseMenu.js";
import { MainMenu } from "../Entities/MainMenu.js";
import { GameLogicController } from "../Core/GameLogicController.js";

export class GameEngine {
  constructor(options) {
    if (!window.GAME_ENGINE) {
      window.GAME_ENGINE = this;
    }

    this.ctx = null;
    this.entities = [];
    this.options = options || { debugging: false };
    this.width = 2000;
    this.height = 1000;
    this.camera = Camera.getInstance();
    this.addEntity(this.camera);
    this.debug_colliders = false;

    this.click = null;
    this.mouse = { x: 0, y: 0 };
    this.wheel = null;
    this.keys = {};

    this.GAME_CONTROLLER = null;
    this.MAIN_MENU = new MainMenu();
    this.addEntity(this.MAIN_MENU);

    return window.GAME_ENGINE;
  }

  startGame() {
    console.log("Starting game...");
    this.entities = this.entities.filter(
      (entity) => !(entity instanceof MainMenu)
    );
    this.GAME_CONTROLLER = new GameLogicController();
    this.addEntity(this.GAME_CONTROLLER);
    window.dispatchEvent(new Event("resize"));
  }

  start() {
    this.running = true;
    const gameLoop = () => {
      this.loop();
      requestAnimFrame(gameLoop, this.ctx.canvas);
    };
    gameLoop();
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

    document.addEventListener("mousemove", (e) => {
      this.mouse = getXandY(e);
      //console.log("Mouse moved:", this.mouse);
    });

    document.addEventListener("click", (e) => {
      this.click = getXandY(e);
      //console.log("Mouse clicked at:", this.click);

      // Check if click is inside Main Menu
      if (this.MAIN_MENU.isVisible) {
        this.MAIN_MENU.handleClick(this.click.x, this.click.y);
      }

      // Check if click is inside Pause Menu
      if (this.GAME_CONTROLLER && this.GAME_CONTROLLER.isPaused) {
        for (let entity of this.entities) {
          if (entity instanceof PauseMenu && entity.isVisible) {
            entity.handleClick(this.click.x, this.click.y);
          }
        }
      }
    });

    document.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        this.keys["m1"] = true;
        //console.log("Left mouse button pressed");
      }
    });

    document.addEventListener("mouseup", (e) => {
      if (e.button === 0) {
        this.keys["m1"] = false;
        //console.log("Left mouse button released");
      }
    });

    document.addEventListener("wheel", (e) => {
      this.keys[(e.deltaY < 0 ? "wheelUp" : "wheelDown")] = true;

      //console.log("Mouse wheel used:", e.deltaY);
    });

    this.ctx.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    document.addEventListener("blur", (e) => {
      this.keys = {};
    });

    document.addEventListener("keydown", (event) => {
      this.keys[
        event.key.length === 1 ? event.key.toLowerCase() : event.key
      ] = true;

      //console.log(`Key pressed: ${event.key}`);

      if (
        this.GAME_CONTROLLER.isGameOver == true &&
        event.key.toLowerCase() === "r"
      ) {
        console.log("R key detected!"); //check
        this.GAME_CONTROLLER.restartGame();
      }

      if (event.key === "Escape") {
        console.log("Escape key pressed - Toggling pause menu...");
        //GAME_ENGINE.GAME_CONTROLLER.togglePause();
        if (this.GAME_CONTROLLER) {
          this.GAME_CONTROLLER.togglePause();
        }
        this.keys["Escape"] = false; // Prevent repeated toggling
      }

      if (this.GAME_CONTROLLER && this.GAME_CONTROLLER.isPaused) {
        //line 167
        if (
          event.key === "ArrowUp" ||
          event.key === "ArrowDown" ||
          event.key === "Enter"
        ) {
          this.keys[event.key] = true;
          this.GAME_CONTROLLER.pauseMenu.update(); // Force Pause Menu update
        }
      }
    });

    document.addEventListener("keyup", (event) => {
      this.keys[
        event.key.length === 1 ? event.key.toLowerCase() : event.key
      ] = false;
    });
  }

  addEntity(entity) {
    if (
      !entity ||
      typeof entity.update !== "function" ||
      typeof entity.draw !== "function"
    ) {
      console.warn("Invalid entity added:", entity);
      return;
    }

    const entityOrder = entity.entityOrder || 0;
    let i = 0;
    while (
      i < this.entities.length &&
      this.entities[i].entityOrder < entityOrder
    )
      i++;

    this.entities.splice(i, 0, entity);
    // console.log(
    //   "Entity added:",
    //   entity.constructor.name,
    //   "Total entities:",
    //   this.entities.length
    // );
  }

  draw() {
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.clearRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].draw(this.ctx);
    }

    if (this.debug_colliders) {
      this.ctx.lineWidth = 5;
      this.ctx.strokeStyle = "limegreen";
      for (let e of this.entities) {
        if (e.collider) {
          this.ctx.strokeRect(
            e.x - this.camera.x - e.collider.width / 2,
            e.y - this.camera.y - e.collider.height / 2,
            e.collider.width,
            e.collider.height
          );
          this.ctx.strokeRect(
            e.x - this.camera.x - 2,
            e.y - this.camera.y - 2,
            4,
            4
          );
        }
      }
    }
  }

  update() {
    if (this.MAIN_MENU.isVisible) {
      this.MAIN_MENU.update();
      return;
    }

    if (this.GAME_CONTROLLER && this.GAME_CONTROLLER.isPaused) {
      for (let entity of this.entities) {
        if (entity instanceof PauseMenu && entity.isVisible) {
          entity.update();
        }
      }
      return;
    }

    for (let entity of this.entities) {
      if (
        entity &&
        typeof entity.update === "function" &&
        !entity.removeFromWorld
      ) {
        entity.update();
      }
    }

    for (let i = this.entities.length - 1; i >= 0; --i) {
      if (this.entities[i] && this.entities[i].removeFromWorld) {
        this.entities.splice(i, 1);
        this.GAME_CONTROLLER.hud.checkWin();
      }
    }
   // console.log("Entities in game:", GAME_ENGINE.entities.map(e => e.constructor.name));

  }

  loop() {
    this.clockTick = Math.min(this.timer.tick(), 1 / 20);
    this.update();
    this.draw();
  }
}

// KV Le was here :)
