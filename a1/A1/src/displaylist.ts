import { Card } from "./card";
//List used to store cards drawn on the canvas
export class DisplayCards {
  list: Card[] = [];

  add(drawable: Card) {
    this.list = [...this.list, drawable];
  }

  remove(drawable: Card) {
    this.list = this.list.filter((d) => d !== drawable);
  }

  draw(gc: CanvasRenderingContext2D) {
    this.list.forEach((d) => {
      d.draw(gc);
    });
  }
}
