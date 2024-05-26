import {
    SKContainer,
    SKLabel,
    Layout,
  } from "simplekit/imperative-mode";
  
  // local imports
  import { Observer } from "./observer";
  import { Model } from "./model";
  
  export class StatusBar extends SKContainer implements Observer {
    //#region observer pattern
  
    update(): void {
      // update the labels with the current model values
      let text_shape = this.model.count === 1 ? 'shape' : 'shapes';
      this.label.text  =  this.model.count + " " + text_shape;

      this.text_selected.text = this.model.selected !== 0?  "selected " +  this.model.selected: "" ;

    }
  
    // create the text labels
    text_selected =new SKLabel({ text: "?"});
    label = new SKLabel({ text: "?"});
    constructor(private model: Model) {
      super();
  
      // setup the view
      this.id = "statusbar";
      this.fill = "lightgrey";
      this.fillWidth = 1;
      this.layoutMethod = Layout.makeFillRowLayout();

      this.label.margin = 10;

      this.label.align = "left";
      this.label.fillWidth = 1;
      this.addChild(this.label);

      this.text_selected.align = "right";
      this.text_selected.margin = 10;
      this.text_selected.fillWidth = 1;
      this.addChild(this.text_selected);

      // register with the model when we're ready
      this.model.addObserver(this);
    }
  }