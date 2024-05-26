//Shape used to build the card
export abstract class Shape {
  fill: string = "white";
  stroke: string = "black";
  strokeWidth = 1;
  reveal: number = 0;
  match: number = 0;
  gesture: number = 0;
  //Coordinates used for animations
  imagex: number = 0;
  imagey: number = 0;
  rotation: number = 0;
  get isFilled() {
    return this.fill != "";
  }

  get isStroked() {
    return this.stroke != "" && this.strokeWidth > 0;
  }

  // this is the "drawable" part of Shape
  abstract draw(gc: CanvasRenderingContext2D): void;

  abstract hitTest(mx: number, my: number): boolean;
}
