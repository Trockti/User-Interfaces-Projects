import {
    SKContainer,
    Layout,
  } from "simplekit/imperative-mode";
  
  import { SKButtonDisabled } from "./buttonDisable";
  // local imports
  import { Observer } from "./observer";
  import { Model } from "./model";
  
  export class ToolBar extends SKContainer implements Observer {
    //#region observer pattern
  
    update(): void {
      // Disable the buttons if the necessary conditions are not met
      if (this.model.count >= 20) {
        this.Add.disabled = true;
        this.AddStar.disabled = true;
      }
      else {
        this.Add.disabled = false;
        this.AddStar.disabled = false;
      }
      if(this.model.selectedIds.length === 0) {
        this.Delete.disabled = true;
      }
      else {
        this.Delete.disabled = false;
      }
      if(this.model.count === 0) {
        this.Clear.disabled = true;
      }
      else {
        this.Clear.disabled = false;
      }
    }
  

    // create the buttons
    Add: SKButtonDisabled = new SKButtonDisabled({text: "Add"} );
    AddStar: SKButtonDisabled = new SKButtonDisabled({ text: "Add Star"});
    Delete: SKButtonDisabled = new SKButtonDisabled({ text: "Delete"});
    Clear: SKButtonDisabled = new SKButtonDisabled({ text: "Clear"});
    buttons: SKButtonDisabled[] = [this.Add, this.AddStar, this.Delete, this.Clear];
  
    constructor(private model: Model) {
      super();
  
      // setup the view
      this.id = "toolbar";
      this.fill = "lightgrey";
      this.fillWidth = 1;
      this.padding = 10;
      this.layoutMethod = Layout.makeFillRowLayout({ gap: 10});
      
      // add event listeners to the buttons
      this.Add.addEventListener("action", () => {
        this.model.createSquare();
      });

      this.AddStar.addEventListener("action", () => {
        this.model.createStar();
      });

      this.Delete.addEventListener("action", () => {
        this.model.delete();
      });


      this.Clear.addEventListener("action", () => {
        this.model.clear();
      });
      
      this.buttons.forEach(button => {
        button.width = 80;
        this.addChild(button);
      });
      // register with the model when we're ready
      this.model.addObserver(this);
    }
  }