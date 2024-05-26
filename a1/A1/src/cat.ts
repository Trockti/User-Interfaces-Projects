import { Drawable } from "./drawable";

export class Cat implements Drawable {
  constructor(public x: number, public y: number, public scale = 1.0, public type: number) {}

  draw(gc: CanvasRenderingContext2D) {
    
    gc.save();
    gc.translate(this.x, this.y);
    gc.scale(this.scale, this.scale);
    let offset = 0;
    //Select the caracteristics of the cat depending on the type
    if (this.type == 1) {
      gc.fillStyle = "#CEA242";
    }
    if (this.type == 2) {
      gc.fillStyle = "#ff4500";
      offset = -2;
    }
    if (this.type == 3) {
      gc.fillStyle = "#1d91ff";
      offset = 2;
    }
    if (this.type == 4) {
      gc.fillStyle = "#2f4f4f";
    }
    if (this.type == 5) {
      gc.fillStyle = "#808080";
    }
    gc.strokeStyle = "white";
    gc.lineWidth = 8;
    // Code obtained from the demos
    // head white outline
    gc.beginPath();
    gc.arc(0, 0, 40, 0, 2 * Math.PI);
    gc.stroke();

    // ears
    gc.beginPath();
    // left
    gc.moveTo(-40, -48);
    gc.lineTo(-8, -36);
    gc.lineTo(-35, -14);
    gc.closePath();
    // right
    gc.moveTo(40, -48);
    gc.lineTo(8, -36);
    gc.lineTo(35, -14);
    gc.closePath();
    gc.stroke();
    gc.fill();

    // head
    gc.beginPath();
    gc.arc(0, 0, 40, 0, 2 * Math.PI);
    gc.fill();

    // whites of eyes
    gc.strokeStyle = "black";
    gc.fillStyle = "white";
    gc.lineWidth = 1;
    gc.beginPath();
    // left
    gc.ellipse(-16 + offset, -9, 8, 14, 0, 0, Math.PI * 2);
    gc.fill();
    gc.stroke();
    // right
    gc.beginPath();
    gc.ellipse(16 + offset, -9, 8, 14, 0, 0, Math.PI * 2);
    gc.fill();
    gc.stroke();

    // eyeballs
    gc.fillStyle = "black";
    gc.beginPath();
      // left
    gc.arc(-16, -9, 5, 0, Math.PI * 2);
    gc.fill();
    // right
    gc.beginPath();
    gc.arc(16, -9, 5, 0, Math.PI * 2);
    gc.fill();
    gc.restore();
    
  }
}
