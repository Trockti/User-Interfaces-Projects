import { Drawable } from "./drawable";

export class Bullseye implements Drawable {
  constructor(public x: number, public y: number, public scale = 1.0, public type: number) {}
    
  draw(gc: CanvasRenderingContext2D) {
    gc.save();
    gc.translate(this.x, this.y);
    gc.scale(this.scale, this.scale);
    //Form of the figure
    const circle = (x: number, y: number, r: number) => {
        gc.beginPath();
        gc.arc(x, y, r, 0, Math.PI * 2);
        gc.fill();
        gc.stroke();
      };
    //Create the figure depending on the type
    if (this.type == 1) {
      gc.strokeStyle = "black";
    for(let i = 0; i < 3; i++){ 
    if (i%2 == 0) {
        gc.fillStyle = "red";
      }
    else{
        gc.fillStyle = "blue";
    }
   
    circle(0, 0, 80 - i*25);
      }
    }
    if(this.type == 2) {
      gc.strokeStyle = "black";
      gc.fillStyle = "black";
      gc.lineWidth = 2;
      circle(0, 0, 80);
      for(let i = 0; i < 3; i++){
        gc.fillStyle = "black";
        gc.strokeStyle = "white";
        circle(0, 0, 65 - i*20);
      }
    }
    if(this.type == 3) {
    gc.strokeStyle = "black";
    for(let i = 0; i < 5; i++){ 
    if (i%2 == 0) {
        gc.fillStyle = "blue";
      }
    else{
        gc.fillStyle = "red";
    }
   
    circle(0, 0, 80 - i*15);
      }
    }
    if(this.type == 4) {
      gc.strokeStyle = "black";
    for(let i = 0; i < 4; i++){ 
    if (i%2 == 0) {
        gc.fillStyle = "orange";
      }
    else{
        gc.fillStyle = "yellow";
    }
   
    circle(0, 0, 80 - i*20);
      }
    }
    if(this.type == 5) {
      gc.strokeStyle = "black";
    for(let i = 0; i < 3; i++){ 
    if (i%2 == 0) {
        gc.fillStyle = "green";
      }
    else{
        gc.fillStyle = "yellow";
    }
   
    circle(0, 0, 80 - i*25);
      }

    }
    gc.restore();
  }
}