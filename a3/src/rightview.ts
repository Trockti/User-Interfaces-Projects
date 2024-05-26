// local imports
import View from "./view";
import { Model } from "./model";
import { display } from "./display";
import { form } from "./form";

import "./rightview.css";

export class rightview implements View {
  //#region observer pattern

  update() {
    // clear the container

    if (this.model.selectId != null && this.model.selected == 1) {
        // if there is a selected shape
        if(this.model.updated_value == false){
            
            this.container.replaceChildren();
            const displayView = new display(this.model);
            this.container.appendChild(displayView.root);
            const formView = new form(this.model);
            this.container.appendChild(formView.root);
            }
        }
    else if(this.model.selected > 1){
       // if there is more than one shape selected
        this.container.replaceChildren();
        const tooMany = document.createElement("label");
        tooMany.id = "tooMany";
        tooMany.innerHTML = "Too Many Selected";
        this.container.appendChild(tooMany);
        }
    else{
        // if there is no shape selected
        this.container.replaceChildren();
        const nothing = document.createElement("label");
        nothing.id = "nothing";
        nothing.innerHTML = "Select One";
        this.container.appendChild(nothing);
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
    this.container.id = "rightview";

    // register with the model
    this.model.addObserver(this);
  }
}
