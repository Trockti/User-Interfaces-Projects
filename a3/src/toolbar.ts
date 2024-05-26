// local imports
import View from "./view";
import { Model } from "./model";

import "./toolbar.css";

export class toolbar implements View {
  //#region observer pattern

  update() {
    // Disable buttons if necessary
    this.container.replaceChildren();
    if (this.model.selected > 0) {
      this.Delete.disabled = false;
    }
    else {
      this.Delete.disabled = true;
    }
    if (this.model.count === 25) {
      this.Add.disabled = true;
    }
    else {
      this.Add.disabled = false;
    }
    if(this.model.count > 0){
      this.Clear.disabled = false;
    }
    else{
      this.Clear.disabled = true;
    }

    
    this.container.appendChild(this.Add);
    this.container.appendChild(this.DropDownMenu);
    this.container.appendChild(this.Delete);
    this.container.appendChild(this.Clear);
  }

  //#endregion

  // the view root container
  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }
  Add: HTMLButtonElement
  Delete: HTMLButtonElement
  DropDownMenu: HTMLSelectElement
  Clear: HTMLButtonElement
  constructor(private model: Model) {
    // setup the view root container
    this.container = document.createElement("div");
    this.container.id = "toolbar";
    this.Add = document.createElement("button");
    this.Add.innerText = "Add";
    this.Add.addEventListener("click", () => {
      this.model.add();
    });
    this.Delete = document.createElement("button");
    this.Delete.innerText = "Delete";
    this.Delete.addEventListener("click", () => {
      this.model.delete();
    });
    this.DropDownMenu = document.createElement("select");
    this.DropDownMenu.addEventListener("change", () => {
      this.model.setType(this.DropDownMenu.value);
    });
    ['Square', 'Star', 'Bullseye', 'Cat'].forEach(shape => {
      const option = document.createElement("option");
      option.value = shape;
      option.text = shape;
      if (this.model.type === shape) {
        option.selected = true;
      }
      this.DropDownMenu.appendChild(option);
    });
    this.Clear = document.createElement("button");
    this.Clear.innerText = "Clear";
    this.Clear.addEventListener("click", () => {
      this.model.clear();
    });


    // register with the model
    this.model.addObserver(this);
  }
}
