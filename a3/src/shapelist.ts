// local imports
import View from "./view";
import { Model } from "./model";
import {Shape, SquareATTR, StarATTR , BullsEyeATTR, CatATTR} from "./shape";

import "./shapelist.css";

export class shapelist implements View {
  //#region observer pattern
    // Helper functions to create shapes
  update() {
    // clear the container
    this.container.replaceChildren();
    this.model.all().forEach((t) => {
      const canvas = document.createElement('canvas');
      const gc = canvas.getContext('2d');
      if (!gc) {
        throw new Error('Unable to get 2D rendering context');
    }
      const w = canvas.width;
      const h = canvas.height;

      gc.fillStyle = `hsl(${t.hue}, 100%, 50%)`;
      const type = t.attributes.type;
      if (type == 'square'){
        gc.fillRect(0, 0, w, h);
        gc.strokeStyle = 'black';
        gc.lineWidth = 1;
        gc.strokeRect(0, 0, w, h);
      }
      else if (type == 'star'){
        const attributes = t.attributes as StarATTR;
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
      gc.fill();
      gc.restore();
      
      }
      else if (type == 'bullseye'){
        const attributes = t.attributes as BullsEyeATTR;
        canvas.setAttribute('border','true')
        canvas.width = 100;
        canvas.height = 100;
        let radius = 45;
        let rings = attributes.rings; 
        let hue1 = t.hue;
        let hue2 = attributes.hue2;
        console.log(hue1);
        console.log(hue2);
        for (let i = rings; i > 0; i--) {
            gc.beginPath();
            gc.arc(canvas.width / 2, canvas.height / 2, radius * i / rings, 0, 2 * Math.PI);
            gc.closePath();

            // Alternate the fill color between the two hues
            gc.fillStyle = `hsl(${i % 2 === 0 ? hue1 : hue2}, 100%, 50%)`;
            gc.fill();
            gc.strokeStyle = 'black';
            gc.stroke();

              }
          }
      else if (type == 'cat'){const attributes = t.attributes as CatATTR;
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

      canvas.addEventListener('click', () => {
        this.model.select(t.id);
      });
      canvas.addEventListener('mouseenter', (e) => {
        this.model.canClear = false;
      });
      canvas.addEventListener('mouseleave', (e) => {
        this.model.canClear = true;

      });
      if (t.clicked) {
        canvas.setAttribute('clicked', 'true');
      }
      else {
        canvas.setAttribute('clicked', 'false');
      }

      this.container.appendChild(canvas);

    });
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
    this.container.id = "shapelist";

    
    window.addEventListener('keydown', (e) => {
      
      if (e.key === 'Shift') {
        // Detect if the shift key is pressed
        this.model.shiftPressed(true);
      }
      if(e.key === 'z' && e.ctrlKey && !e.shiftKey){
        // Undo the last action if the user presses ctrl + z
        console.log('Undo triggered');
        this.model.undo();
      }
      if(e.key === 'Z' && e.ctrlKey && e.shiftKey){
        // Redo the last action if the user presses ctrl + shift + z
        this.model.redo();
      }
    });
    window.addEventListener('keyup', (e) => {
     
      if (e.key === 'Shift') {
        this.model.shiftPressed(false);
      }
      
    });
    this.container.addEventListener('mousedown', (e) => {
      // Prevent the default action of the mouse down event
      if (e.shiftKey) {
        e.preventDefault();
      }
    });


    this.container.addEventListener('click', () => {
      this.model.clearSelected();
    });


    this.model.initialize();
    // register with the model
    this.model.addObserver(this);
  }
}
