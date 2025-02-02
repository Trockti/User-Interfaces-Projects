import { 
    SKElement,  
    SKElementProps, 
    Style, 
    SKEvent, 
    SKMouseEvent, 
    requestMouseFocus
   } from 'simplekit/imperative-mode';
import {measureText } from "simplekit/utility";
export type SKButtonDisabledProps = SKElementProps & { text?: string };

// a button that can be disabled (I had problems while extending SKButton,
// so I simply copied the code and added the disabled property).
export class SKButtonDisabled extends SKElement {
  constructor({ text = "", ...elementProps }: SKButtonDisabledProps = {}) {
    super(elementProps);
    this.padding = Style.textPadding;
    this.text = text;
    this.calculateBasis();
    this.doLayout();
  }

  font = Style.font;
  state: "idle" | "hover" | "down" = "idle";

  protected _text = "";
  get text() {
    return this._text;
  }
  set text(t: string) {
    this._text = t;
    // console.log(`SKButton text = ${this.text} ${this.width} ${this.height}`);
    this.setMinimalSize(this.width, this.height);
  }

  setMinimalSize(width?: number, height?: number) {
    width = width || this.width;
    height = height || this.height;
    // need this if w or h not specified
    const m = measureText(this.text, this.font);

    if (!m) {
      console.warn(`measureText failed in SKButton for ${this.text}`);
      return;
    }

    this.height = height || m.height + this.padding * 2;

    this.width = width || m.width + this.padding * 2;
    // enforce a minimum width here (if no width specified)
    if (!width) this.width = Math.max(this.width, 80);
  }

  handleMouseEvent(me: SKMouseEvent) {
    // console.log(`${this.text} ${me.type}`);

    switch (me.type) {
      
      case "mousedown":
        if (this.disabled){
          return false;
        }
        this.state = "down";
        requestMouseFocus(this);
        return true;
        break;
      case "mouseup":
        
        // return true if a listener was registered
        if (this.disabled){
          return false;
        }
        this.state = "hover";
        // return true if a listener was registered
        return this.sendEvent({
          source: this,
          timeStamp: me.timeStamp,
          type: "action",
        } as SKEvent);
        break;
        
        break;
      case "mouseenter":
        if (this.disabled){
          return false;
        }
        this.state = "hover";
        return true;
        break;
      case "mouseexit":
        this.state = "idle";
        return true;
        break;
    }
    return false;
  }
  disabled = false;
  draw(gc: CanvasRenderingContext2D) {
    // to save typing "this" so much

    gc.save();

    const w = this.paddingBox.width;
    const h = this.paddingBox.height;

    gc.translate(this.margin, this.margin);

    
    // thick highlight rect
    if (this.state == "hover" || this.state == "down") {
      gc.beginPath();
      gc.roundRect(this.x, this.y, w, h, 4);
      gc.strokeStyle = Style.highlightColour;
      gc.lineWidth = 8;
      gc.stroke();
    }

    // normal background
    gc.beginPath();
    gc.roundRect(this.x, this.y, w, h, 4);
    gc.fillStyle =
      this.state == "down" ? Style.highlightColour : "lightgrey";
    // if disabled, make it grey
    gc.strokeStyle = this.disabled? "grey" : "black";
    // change fill to show down state
    gc.lineWidth = this.state == "down" ? 4 : 2;
    gc.fill();
    gc.stroke();
    gc.clip(); // clip text if it's wider than text area

    // button label
    gc.font = Style.font;
    // if disabled, make it grey
    gc.fillStyle = this.disabled? "grey" : "black";
    gc.textAlign = "center";
    gc.textBaseline = "middle";
    gc.fillText(this.text, this.x + w / 2, this.y + h / 2);


    gc.restore();

    // element draws debug viz if flag is set
    super.draw(gc);
  }

  public toString(): string {
    return `SKButton '${this.text}'`;
  }
}
