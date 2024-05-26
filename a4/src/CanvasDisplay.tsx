import * as State from "./state";

import {
  useRef,
  useEffect,
  useState,
  useLayoutEffect,
} from "preact/hooks";

import {Shape, SquareATTR, StarATTR , BullsEyeATTR, CatATTR} from "./shape";

type CanvasProps = {
  width?: number;
  height?: number;
  shape: Shape;
};

export function CanvasDisplay({ width = 100, height = 100, shape }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const type = shape.attributes.type;

  // drawing
  // (try useEffect and see difference)
  useLayoutEffect(() => {
    const gc = canvasRef.current?.getContext("2d");
    if (gc) draw(gc);
  }, []);

  function draw(gc: CanvasRenderingContext2D) {

    const w = gc.canvas.width = 100;
    const h = gc.canvas.height = 100;

    gc.fillStyle = `hsl(${shape.hue}, 100%, 50%)`;

    if (type == "square") {
      gc.fillRect(0, 0, w, h);
      gc.strokeStyle = 'black';
      gc.lineWidth = 1;
      gc.strokeRect(0, 0, w, h);
    }

    else if (type == 'star'){
      const attributes = shape.attributes as StarATTR;


    // Calculate the offset of the star
    let offset = attributes.spikes % 2 == 0 ? Math.PI / 2 : -Math.PI / (2);

    //Select the caracteristics of the star depending on the type
    gc.lineWidth = 2;     
   //Variables used for mathematical computations
    const angle = Math.PI / attributes.spikes;  
    gc.save();
    gc.translate(gc.canvas.width/2, gc.canvas.height/2);
    // Translate the context to the center of the container
    gc.beginPath();
    //Compute the coordinates of the star
    for (let i = 0; i < 2 * attributes.spikes; i++) {
        let r = (i & 1) == 0 ? attributes.outerRadius: 15;
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
    gc.fillStyle = `hsl(${shape.hue}, 100%, 50%)`;
    gc.fill();
    gc.restore();
    
    }
    else if (type == 'bullseye'){
      const attributes = shape.attributes as BullsEyeATTR;
      let radius = 45;
      let rings = attributes.rings; 
      let hue1 = shape.hue;
      let hue2 = attributes.hue2;
      for (let i = rings; i > 0; i--) {
          gc.beginPath();
          gc.arc(gc.canvas.width / 2, gc.canvas.height / 2, radius * i / rings, 0, 2 * Math.PI);
          gc.closePath();

          // Alternate the fill color between the two hues
          gc.fillStyle = `hsl(${i % 2 === 0 ? hue1 : hue2}, 100%, 50%)`;
          gc.fill();
          gc.strokeStyle = 'black';
          gc.stroke();

            }
        }
    else if (type == 'cat'){const attributes = shape.attributes as CatATTR;
      let offset = 0;
      gc.save();
      gc.translate(50, 50);
      gc.fillStyle = `hsl(${shape.hue}, 100%, 50%)`;
      if (attributes.eyeDirection == 'right') {
        offset = -2;
      }
      if (attributes.eyeDirection == 'left') {
        offset = 2;
      }
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
      gc.ellipse(-16 , -9, 8, 14, 0, 0, Math.PI * 2);
      gc.fill();
      gc.stroke();
      // right
      gc.beginPath();
      gc.ellipse(16 , -9, 8, 14, 0, 0, Math.PI * 2);
      gc.fill();
      gc.stroke();
  
      // eyeballs
      gc.fillStyle = "black";
      gc.beginPath();
        // left
      gc.arc(-16 + offset, -9, 5, 0, Math.PI * 2);
      gc.fill();
      // right
      gc.beginPath();
      gc.arc(16 + offset, -9, 5, 0, Math.PI * 2);
      gc.fill();
      gc.restore();
    }
  }

  return (
    <canvas
    class="object-contain aspect-square"
    ref={canvasRef}

    />
);
}
