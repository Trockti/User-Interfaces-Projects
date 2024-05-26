
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

export class SKSquare  extends SKElement {
  hue: number = 0;
  constructor(private model: Model, elementProps: SKSquareProps = {}) {
    super(elementProps);
    this.calculateBasis();
    this.doLayout();
    // Select a random hue
    this.hue =  Math.floor(Math.random() * 361);
    this.fill = `hsl(${this.hue}, 100%, 50%)`;
  }



  //#region managing children

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
        return true;

        break;
      case "mouseenter":
        // if the mouse is over the square, change the state to hover, 
        // and cancel the clearSelected method
        this.model.canClear = false;
        this.state = "hover";
        return true;
        break;
      case "mouseexit":
        // if the mouse is not over the square, change the state to idle,
        // and enable the clearSelected method
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
    }
    return false;
  }

  //#endregion

  clicked = false;
  draw(gc: CanvasRenderingContext2D) {
    gc.save();
    // set coordinate system to padding box
    gc.translate(this.x, this.y);
    gc.translate(this.margin, this.margin);
    

    const w = this.paddingBox.width;
    const h = this.paddingBox.height;

    // if the mouse is over the square, draw a thick highlight rect
    if (this.state == "hover" || this.state == "down") {
      gc.beginPath();
      gc.roundRect(0, 0, w, h, 4);
      gc.strokeStyle = Style.highlightColour;
      gc.lineWidth = 8;
      gc.stroke();
    }

    // if the square is selected, draw a thin highlight rect
    if (this.clicked) { 
      gc.strokeStyle = Style.focusColour;
      gc.lineWidth = 1;
      gc.strokeRect(
        -2,
        -2,
       w + 4,
       h + 4
      );
    }

    // draw background colour if set
    if (this.fill) {
      gc.fillStyle = this.fill;
      gc.fillRect(
        0,
        0,
        w,
       h
      );
    }

    // draw border if set
    if (this.border) {
      gc.strokeStyle = this.border;
      gc.lineWidth = 1;
      gc.strokeRect(
        0,
        0,
        w,
        h
      );
    }

    gc.restore();

    // let element draw debug if flag is set
    super.draw(gc);

    // now draw all the children
    gc.save();
    // set coordinate system to container content box
    gc.translate(this.x, this.y);
    gc.translate(this.margin, this.margin);
    gc.translate(this.padding, this.padding);
    // draw children
    this._children.forEach((el) => el.draw(gc));
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

  //#endregion

  updateColor(hue: number) {
    this.hue = hue 
    this.fill = `hsl(${this.hue}, 100%, 50%)`; // Update the fill with the new hue
}

  public toString(): string {
    return (
      `SKContainer '${this.fill}'` +
      (this.id ? ` id '${this.id}' ` : " ") +
      this.boxModelToString()
    );
  }
}
