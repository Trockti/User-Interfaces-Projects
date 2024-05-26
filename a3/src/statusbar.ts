// local imports
import View from "./view";
import { Model } from "./model";

import "./statusbar.css";

export class statusbar implements View {
  //#region observer pattern

  update() {
    // Update the texts of the status bar
    this.container.replaceChildren();
    let text_shape = this.model.count === 1 ? 'shape' : 'shapes';
    this.shapes_num.innerText  =  this.model.count + " " + text_shape;
    this.container.appendChild(this.shapes_num);
    if(this.model.selected > 0){
      const selected = document.createElement("label");
      selected.id = "selected";
      selected.innerHTML = this.model.selected + " selected";
      this.container.appendChild(selected);
    }
  }

  //#endregion

  // the view root container
  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  shapes_num = document.createElement("span");
  constructor(private model: Model) {
    // setup the view root container
    this.container = document.createElement("div");
    this.container.id = "statusbar";

    this.shapes_num.innerText = "??";
    this.shapes_num.className = "shapes_num";
    // register with the model

    this.model.addObserver(this);
  }
}
