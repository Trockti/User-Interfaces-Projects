import {
    SKContainer,
    Layout,
    requestKeyboardFocus,
    SKKeyboardEvent,
    SKMouseEvent,
  } from "simplekit/imperative-mode";
  // local imports
  import { Observer } from "./observer";
  import { Model } from "./model";
  import { SKSquare } from "./SKSquare";
  import { SKStar } from "./SKStar";


  export class ShapeList extends SKContainer implements Observer {
    //#region observer pattern
    
    // Helper functions to create shapes
    makeSquare(id: string): SKSquare {
      const container = new SKSquare(this.model);
      container.id = id;
      container.width = 50;
      container.height = 50;

      container.border = "black";
      return container;
      
    }
    makeStar(id: string): SKStar {
      const container = new SKStar(this.model);
      container.id = id;
      container.width = 50;
      container.height = 50;
      container.border = "black";
      return container;
    }
    update(): void {

      this.clearChildren(); 
      // Draw all the shapes
       this.model.all().forEach((t) => {
        if(t.square == true){
          // if the shape is a square
          let square = this.makeSquare(t.id)
        square.updateColor(t.hue)
        square.addEventListener("action", () => {
          this.model.select((square.id).toString());
        });
        // if the shape is selected, change the color
        if (this.model.selectedIds.includes(square.id)) {
          square.clicked = true;
        }
        else {
          square.clicked = false;
        }
        this.addChild(square);
        }
        else {
          // if the shape is a star
          let star = this.makeStar(t.id)
          console.log("star", star.innerRadius, star.outerRadius,);
          star.updateColor(t.hue)
          star.updateSpikes(t.spikes);
          star.updateOuterRadius(t.outerRadius);
          star.addEventListener("action", () => {
            this.model.select((star.id).toString());
            console.log("clicked", star.id);
          });
          // if the shape is selected, change the color
          if (this.model.selectedIds.includes(star.id)) {
            star.clicked = true;
          }
          else {
            star.clicked = false;
          }
          this.addChild(star);
        }
       });

     }

      handleMouseEvent(me: SKMouseEvent) { 
        switch (me.type) {
          // if the mouse is over the shape list, request the keyboard focus
          case "mouseenter":
            requestKeyboardFocus(this);            
            return true;
            break;
          case "click":
            // if the mouse is clicked inside the shapelist, clear the selected shapes
            this.model.clearSelected();
            return true;
            break;
        }
      return false;
    }

    handleKeyboardEvent(ke: SKKeyboardEvent) {
      switch (ke.type) {
        case "focusout":
          return true;
          break;
        case "focusin":
          return true;
          break;
        case "keydown":
          // if the shift key is pressed, set the shiftPressed property to true
          if (ke.key === "Shift") {
            this.model.shiftPressed(true)
          }
          break;
        case "keyup":
          if (ke.key === "Shift") {
            // if the shift key is released, set the shiftPressed property to false
            this.model.shiftPressed(false)
          }
          break;
      }
  
      return false;
    }
    shapes: SKSquare[] = [];
  
    constructor(private model: Model) {
      super();
  
      // setup the view
      this.id = "shape list";
      this.layoutMethod = Layout.makeWrapRowLayout({ gap: 20});
      this.fillHeight = 1;
      this.fillWidth = 1;
      this.padding = 20;
      this.model.initialize();
      // register with the model when we're ready
      this.model.addObserver(this);
    }
  }
  
  