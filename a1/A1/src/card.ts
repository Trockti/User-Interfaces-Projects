import { Shape } from "./shape";
import {
  edgeHitTestRectangle,
  insideHitTestRectangle,
} from "./hittest";
import {Cat} from "./cat";
import {Star} from "./star";
import {Bullseye} from "./bullseye";

export class Card extends Shape{
  constructor(public x: number, public y: number, public scale = 1.0, public start : number, public figure: Cat | Star | Bullseye) 
  {
    super();
  }

  draw(gc: CanvasRenderingContext2D) {
    gc.save();
    gc.translate(this.x, this.y);
    gc.scale(this.scale, this.scale);
    //Used for rotation animation
    gc.rotate(this.rotation);
    
    //Form of the card
    const square = (x: number, y: number, size: number) => {
      gc.beginPath();
      gc.rect(
        x - size / 2,
        y - size / 2,
        size,
        size
      );
      gc.fill();
      gc.stroke();
  };
    gc.strokeStyle = this.stroke;
    gc.fillStyle = this.fill;
    square(0, 0, 80);
    if (this.isFilled) gc.fill();
    if (this.isStroked) gc.stroke();
    if(this.start == 0 || this.reveal == 1) {
    this.figure.draw(gc);
    }
    //If the game has started, and the card is not revealed, don't show the figure
    if((this.start == 1) && (this.reveal == 0)){
      gc.fillStyle = "skyblue";
      square(0, 0, 70);
      if (this.isFilled) gc.fill();

    }
    //Make the card's color ligther if it is a match
    if (this.match == 1) {
      gc.strokeStyle = this.stroke;
      gc.fillStyle = "rgb(255 255 255 / 50%)";
      square(0, 0, 80);
    }
    gc.restore();
  }

  hitTest(mx: number, my: number) {
    let hit = false;
    
    if (this.isFilled) {
      hit ||= insideHitTestRectangle(
        mx,
        my,
        this.x-40,
        this.y-40,
        80,
        80
      );
    }
    if (this.isStroked) {
      hit ||= edgeHitTestRectangle(
        mx,
        my,
        this.x-40,
        this.y-40,
        80,
        80,
        1
      );
    }
    return hit;
  }
} 