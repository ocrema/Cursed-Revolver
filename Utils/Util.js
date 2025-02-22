import { Collider } from "../Entities/Collider.js";
import { GAME_ENGINE } from "../main.js";

/** Global Parameters Object */
const params = {};

/**
 * @param {Number} n
 * @returns Random Integer Between 0 and n-1
 */
export const randomInt = (n) => Math.floor(Math.random() * n);

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @returns String that can be used as a rgb web color
 */
const rgb = (r, g, b) => `rgba(${r}, ${g}, ${b})`;

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @param {Number} a Alpha Value
 * @returns String that can be used as a rgba web color
 */
const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;

/**
 * @param {Number} h Hue
 * @param {Number} s Saturation
 * @param {Number} l Lightness
 * @returns String that can be used as a hsl web color
 */
const hsl = (h, s, l) => `hsl(${h}, ${s}%, ${l}%)`;

/** Creates an alias for requestAnimationFrame for backwards compatibility */
window.requestAnimFrame = (() => {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    /**
     * Compatibility for requesting animation frames in older browsers
     * @param {Function} callback Function
     * @param {DOM} element DOM ELEMENT
     */
    ((callback, element) => {
      window.setTimeout(callback, 1000 / 60);
    })
  );
})();

/**
 * Returns distance from two points
 * @param {Number} p1, p2 Two objects with x and y coordinates
 * @returns Distance between the two points
 */
export const getDistance = (p1, p2) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export const getAngle = (p1, p2) => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
};

/**
 * Calculates the direction vector from one entity to another with a given speed.
 * @param {Object} source - The entity shooting the bullet (e.g., CowboyEnemy).
 * @param {Object} target - The entity being targeted (e.g., Player).
 * @param {number} speed - The speed of the bullet.
 * @returns {Object} - The x and y velocity values for the bullet.
 */
export function getDirection(source, target, speed) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return {
      x: (dx / distance) * speed,
      y: (dy / distance) * speed
  };
}

export const diffBetweenAngles = (a, b) => {
  return Math.PI - Math.abs(Math.abs(a - b) - Math.PI);
};

/*
export const newCollider = (w, h, x, y) => { 
    return {width: w, height: h, x_offset: x, y_offset: y}; 
};
    */

export const canSee = (A, B) => {
  return getDistance(A, B) < A.visualRadius;
};

// checks if o1 can see o2
export const canAttack = (o1, o2) => {
  
  // if o1 is colliding with o2
  if(o1.collider && o1.collider.colliding(o1.x, o1.y, o2.collider, o2.x, o2.y)) {
    return true;
  } else {
    // calculate velocity --> move based on collider size
    var distance = getDistance(o2, o1);
    let velocity = {x: (o2.x - o1.x) / distance * o1.collider.width, y: (o2.y - o1.y) / distance * o1.collider.height}
    
    // update velocity if too small
    velocity.x = Math.sign(velocity.x) * Math.max(5, Math.abs(velocity.x));
    velocity.y = Math.sign(velocity.y) * Math.max(5, Math.abs(velocity.y));
    
    // create moved object version of first object
    let tempObject = {
      x: o1.x + velocity.x,
      y: o1.y + velocity.y,
      collider: new Collider(o1.collider.width, o1.collider.height),
    };

    // if colliding with ANY platform
    for (let entity of GAME_ENGINE.entities) {
      if (entity.isPlatform &&
        entity.colliding(tempObject)   
      ) {
        return false;
      }
    }

    // recursion 
    return canAttack(tempObject, o2);
  }
}

/**
 * Distance From Camera Volume Multiplier
 * returns a value between 0 and 1 that represents how loud a sound should be based on distance from camera
 * use like this: 
 * window.ASSET_MANAGER.playAsset("./assets/sfx/lightning.wav", yourVolumeMult * Util.DFCVM(yourEntity));
 */
export const DFCVM = (e) => {
  if (!e || !GAME_ENGINE.camera) return 0;
  const maxVolumeDis = 2000;
  const minVolumeDis = 5000;
  const distance = getDistance(e, GAME_ENGINE.camera);
  if (distance < maxVolumeDis) return 1;
  if (distance > minVolumeDis) return 0;
  return 1 - (distance - maxVolumeDis) / (minVolumeDis - maxVolumeDis);
}
