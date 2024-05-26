import { Drawable } from "./drawable";

export class Star implements Drawable {
  constructor(public x: number, public y: number, public scale = 1.0, public type: number) {}

  draw(gc: CanvasRenderingContext2D) {

    gc.save();
    gc.translate(this.x, this.y);
    gc.scale(this.scale, this.scale);

    let spikes = 0;
    let offset = 0;

    //Select the caracteristics of the star depending on the type
    gc.lineWidth = 5;
    if (this.type == 1) {
      gc.fillStyle = "#fdff04";
      spikes = 5;
      offset = -Math.PI / (spikes*2); 
      
    }
    if (this.type == 2) {
      gc.fillStyle = "#fdff04";
      spikes = 7;
      offset = Math.PI / (spikes*2);
    }
    if (this.type == 3) {
      gc.fillStyle = "#ff8c00";
      spikes = 6;
      offset = Math.PI / (spikes);
    }
    if (this.type == 4) {
      gc.fillStyle = "#ffd700";
      spikes = 10;
      offset = Math.PI / (spikes);
    }
    if (this.type == 5) {
      gc.fillStyle = "#ffd800";
      spikes = 4;
    }
    gc.strokeStyle = "black";
    
    //Variables used for mathematical computations
    let rOuter = 150;
    let rInner = 75;
    const angle = Math.PI / spikes;  

      


    gc.beginPath();
    //Compute the coordinates of the star
    for (let i = 0; i < 2 * spikes; i++) {
        let r = (i & 1) == 0 ? rOuter : rInner;
            let x =  Math.cos(i * angle + offset) * r;
            let y =  Math.sin(i * angle + offset) * r;
        if (i == 0) {
            gc.moveTo(x,y);
        }
        else {
            gc.lineTo(x,y);
        }
    }
    gc.closePath();
    gc.stroke();
    gc.fill();
    gc.restore();
  }
    
    
}