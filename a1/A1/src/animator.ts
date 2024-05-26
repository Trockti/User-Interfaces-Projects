// linear interpolation function
const lerp = (start: number, end: number, t: number) =>
  start + (end - start) * t;

// basic animation object
export class Animator {
  constructor(
    public startValue: number,
    public endValue: number,
    public duration: number,
    public updateValue: (p: number) => void
  ) {}

  private startTime: number | undefined;

  start(time: number) {
    this.startTime = time;
    this._isRunning = true;
  }

  get isRunning() {
    return this._isRunning;
  }
  private _isRunning = false;

  update(time: number) {
    if (!this._isRunning || this.startTime === undefined) return;

    // proportion of time elapsed
    const t = Math.min(1, (time - this.startTime) / this.duration);

    // calculate the new value
    const value = lerp(this.startValue, this.endValue, t);

    // call the update callback
    this.updateValue(value);

    if (t >= 1) {
      this.startTime = undefined;
      this._isRunning = false;
    }
  }
}
