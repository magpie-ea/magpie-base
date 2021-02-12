import EventEmitter from 'events';
import Vue from 'vue';

export default class Mousetracking extends EventEmitter {
  constructor() {
    super();

    this.time = [0];
    this.x = [0];
    this.y = [0];
    this.startTime = 0;

    Vue.observable(this);
  }

  onMouseMove(e) {
    this.time.push(Date.now() - this.startTime);
    this.x.push(e.layerX);
    this.y.push(e.layerY);
  }

  /**
   * (re)start mouse tracking for the current screen
   * @param x{Number} Initial x coordinate
   * @param y{Number} Initial y coordinate
   * @public
   */
  start(x, y) {
    this.time = [0];
    this.x = [x || this.x[this.x.length - 1]];
    this.y = [y || this.y[this.y.length - 1]];
    this.startTime = Date.now();
  }

  /**
   * Get the mouse track since the appearance of the current screen
   * @public
   * @param rate{int} Time resolution in ms (optional; defaults to 15ms)
   * @returns {{mt_x: [], mt_y: [], mt_time: []}}
   */
  getMouseTrack(rate = 15) {
    const interpolated = {
      mt_time: [],
      mt_x: [],
      mt_y: [],
      mt_start_time: this.startTime
    };
    for (let i = 0; i < this.time.length; i++) {
      interpolated.mt_time.push(this.time[i]);
      interpolated.mt_x.push(this.x[i]);
      interpolated.mt_y.push(this.y[i]);
      if (i < this.time.length - 1 && this.time[i + 1] - this.time[i] > rate) {
        const steps = (this.time[i + 1] - this.time[i]) / rate - 1;
        const xDelta = (this.x[i + 1] - this.x[i]) / (steps + 1);
        const yDelta = (this.y[i + 1] - this.y[i]) / (steps + 1);
        const index = interpolated.mt_time.length - 1;
        for (let j = 0; j < steps; j++) {
          interpolated.mt_time.push(interpolated.mt_time[index + j] + rate);
          interpolated.mt_x.push(
            Math.round(interpolated.mt_x[index + j] + xDelta)
          );
          interpolated.mt_y.push(
            Math.round(interpolated.mt_y[index + j] + yDelta)
          );
        }
      }
    }
    return interpolated;
  }
}
