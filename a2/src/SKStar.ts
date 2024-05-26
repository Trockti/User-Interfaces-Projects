import { 
  invalidateLayout,
   LayoutMethod, 
   Size, 
   SKElement,
   SKElementProps, 
   SKMouseEvent,
   requestMouseFocus,
   Style,
   } from "simplekit/imperative-mode";


import { Model } from "./model";

type SKSquareProps = SKElementProps & {};

export class SKStar  extends SKElement {
  hue: number = 0;
  innerRadius: number = 0;
  outerRadius: number = 0;
  spikes: number = 0;
  constructor(private model: Model, elementProps: SKSquareProps = {}) {
    super(elementProps);
    this.calculateBasis();
    this.doLayout();
    this.hue =  Math.floor(Math.random() * 361);
    this.fill = `hsl(${this.hue}, 100%, 50%)`;
    // Besides the hue, the star has an inner radius, an random outer radius and a random number of spikes
    this.innerRadius = 15;
    this.outerRadius = Math.floor(Math.random() * (45 - 20 + 1)) + 20;
    this.spikes = Math.floor(Math.random() * (10 - 3 + 1)) + 3;
  }



  // very similar to SKSquare, except for the draw method

  private _children: SKElement[] = [];
  get children(): readonly SKElement[] {
    return this._children;
  }

  addChild(element: SKElement) {
    this._children.push(element);
    invalidateLayout();
  }

  removeChild(element: SKElement) {
    this._children = this._children.filter((el) => el != element);
    invalidateLayout();
  }

  clearChildren() {
    this._children = [];
    invalidateLayout();
  }

  //#endregion

  //#region event handling
  state: "idle" | "hover" | "down" | "shift" = "idle";
  handleMouseEvent(me: SKMouseEvent) {

    switch (me.type) {
      case "mousedown":
        this.state = "down";
        requestMouseFocus(this);
        return true;
        break;
      case "mouseup":
        this.state = "hover";
        // return true if a listener was registered

        break;
      case "mouseenter":
        this.model.canClear = false;
        this.state = "hover";
        return true;
        break;
      case "mouseexit":
        this.model.canClear = true;
        this.state = "idle";
        return true;
        break;
      case "click":
        if (this.state == "shift") {
          this.state = "idle";
          this.sendEvent({
            source: this,
            timeStamp: me.timeStamp,
            type: "action",
          });
          return true;
        }
        else {
          return this.sendEvent({
            source: this,
            timeStamp: me.timeStamp,
            type: "action",
          });
        }
        break;
    }
    return false;
  }

  //#endregion

  clicked = false;
  draw(gc: CanvasRenderingContext2D) {
    gc.save();
    gc.translate(this.x, this.y);
    // Translate the context to the center of the container
    gc.translate(this.margin + this.paddingBox.width/2, this.margin + this.paddingBox.height/2);
    // Draw the highlight rectangle if the mouse is over the star
    if (this.state == "hover" || this.state == "down") {
      gc.beginPath();
      gc.roundRect(
        -this.paddingBox.width/2,
        -this.paddingBox.height/2,
        this.paddingBox.width,
        this.paddingBox.height 
      );
      gc.strokeStyle = Style.highlightColour;
      gc.lineWidth = 4;
      gc.stroke();
    }
    // Draw the focus rectangle if the star is clicked
    if (this.clicked) {
      gc.strokeStyle = Style.focusColour;
      gc.lineWidth = 1;
      gc.strokeRect(
        -this.paddingBox.width/2-2,
        -this.paddingBox.height/2-2,
        this.paddingBox.width+4,
        this.paddingBox.height+4
      );
    }
    // Draw the container rectangle
    gc.strokeStyle = "grey";
      gc.lineWidth = 1;
      gc.strokeRect(
        -this.paddingBox.width/2,
        -this.paddingBox.height/2,
        this.paddingBox.width,
        this.paddingBox.height 
      );

    // Calculate the offset of the star
    let offset = this.spikes % 2 == 0 ? Math.PI / 2 : -Math.PI / (2);

    //Select the caracteristics of the star depending on the type
    gc.lineWidth = 2;
    
    gc.strokeStyle = "black";
    
    //Variables used for mathematical computations
    const angle = Math.PI / this.spikes;  

      


    gc.beginPath();
    //Compute the coordinates of the star
    for (let i = 0; i < 2 * this.spikes; i++) {
        let r = (i & 1) == 0 ? (this.outerRadius/92)*this.paddingBox.width : (this.innerRadius/92)*this.paddingBox.height;
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
    gc.fillStyle = this.fill;
    gc.fill();
    gc.restore();
    
  }

  //#region layout children

  protected _layoutMethod: LayoutMethod | undefined;
  set layoutMethod(lm: LayoutMethod) {
    this._layoutMethod = lm;
  }

  doLayout(width?: number, height?: number): Size {
    let recalculate = this._recalculateBasis;
    let size = super.doLayout(width, height);
    this._recalculateBasis = recalculate;
    if (this._children.length > 0) {
      this._children.forEach((el) => el.calculateBasis());
      // do initial layout of children (might change after this container layout)
      this._children.forEach((el) => el.doLayout());
      // run the layout method
      // (it returns new bounds, but we ignore it for now)
      // console.log(
      //   `${this.id} layout in ${this.box.contentBox.width}x${this.box.contentBox.height}`
      // );
      if (this._layoutMethod) {
        size = this._layoutMethod(
          this.contentBox.width,
          this.contentBox.height,
          this._children
        );
        // this.widthLayout = Math.max(size.width, this.widthBasis);
        // this.heightLayout = Math.max(size.height, this.heightBasis);

        // do final layout of children
        // (using size assigned by this container)
        this._children.forEach((el) => el.doLayout());
      }

      return size;
    } else {
      return { width: this.widthLayout, height: this.heightLayout };
    }
    // else if (this._children.length > 0) {
    //   console.warn(`${this.id} has children but no layout method`);
    // }
  }

  // functions to update the star's caracteristics

  updateColor(hue: number) {
    this.hue = hue 
    this.fill = `hsl(${this.hue}, 100%, 50%)`; // Update the fill with the new hue
}
  updateSpikes(spikes: number) {
    this.spikes = spikes;
  }
  updateOuterRadius(outerRadius: number) {
    this.outerRadius = outerRadius;
  }

  public toString(): string {
    return (
      `SKContainer '${this.fill}'` +
      (this.id ? ` id '${this.id}' ` : " ") +
      this.boxModelToString()
    );
  }
}
