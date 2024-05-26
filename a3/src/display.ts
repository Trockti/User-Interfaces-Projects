// local imports
import View from "./view";
import { Model } from "./model";
import {SquareATTR, StarATTR , BullsEyeATTR, CatATTR} from "./shape";

import "./display.css";

export class display implements View {
  //#region observer pattern

  update() {
    this.container.replaceChildren();
    if (this.model.selectId != null && this.model.selected == 1) {
        // if there is a selected shape
   
        this.model.all().forEach((t) => {
          if (t.id == this.model.selectId) {
            const canvas = document.createElement('canvas');
            const gc = canvas.getContext('2d');
            if (!gc) {
              throw new Error('Unable to get 2D rendering context');
            }
            const w = canvas.width = 50;
            const h = canvas.height = 50;
            const type = t.attributes.type;
            const attributes = t.attributes as StarATTR;
            gc.fillStyle = `hsl(${t.hue}, 100%, 50%)`;
            if(type == 'square'){
              gc.fillRect(0, 0, w, h);
              gc.strokeStyle = 'black';
              gc.lineWidth = 1;
              gc.strokeRect(0, 0, w, h);
            }
            else if(type == 'star'){
              canvas.setAttribute('border','true')
              canvas.width = 100;
              canvas.height = 100;
            // Calculate the offset of the star
            let offset = attributes.spikes % 2 == 0 ? Math.PI / 2 : -Math.PI / (2);
        
            //Select the caracteristics of the star depending on the type
            gc.lineWidth = 2;          
            //Variables used for mathematical computations
            const angle = Math.PI / attributes.spikes;  
            gc.save();
            gc.translate(canvas.width/2, canvas.height/2);
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
            gc.fillStyle = `hsl(${t.hue}, 100%, 50%)`;
            gc.strokeStyle = 'black'
            gc.stroke();
            gc.fill();
            gc.restore();
            }
            else if(type == 'bullseye'){
              const attributes = t.attributes as BullsEyeATTR;
              canvas.setAttribute('border','true')
              canvas.width = 100;
              canvas.height = 100;
              let radius = 45;
              let rings = attributes.rings; 
              let hue = t.hue;
              let hue2 = attributes.hue2;
              let ringWidth = radius / rings;
              // draw the rings
              for (let i = 0; i < rings; i++) {
                  gc.beginPath();
                  gc.arc(50, 50, radius - i * ringWidth, 0, 2 * Math.PI);
                  gc.fillStyle = i % 2 == 0 ? `hsl(${hue}, 100%, 50%)` : `hsl(${hue2}, 100%, 50%)`;
                  gc.fill();
                  gc.strokeStyle = 'black';
                  gc.lineWidth = 1;
                  gc.stroke();
              }
            }
            else if(type == 'cat'){
              const attributes = t.attributes as CatATTR;
              canvas.setAttribute('border','true')
              canvas.width = 100;
              canvas.height = 100;
              let offset = 0;
              gc.save();
              gc.translate(50, 50);
              gc.fillStyle = `hsl(${t.hue}, 100%, 50%)`;
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
            this.container.appendChild(canvas);
              }
          });
      }
  }

  //#endregion

  // the view root container
  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model) {
    // setup the view root container
    this.container = document.createElement("div");
    this.container.id = "display";

    // register with the model
    this.model.addObserver(this);
  }
}
