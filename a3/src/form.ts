// local imports
import View from "./view";
import { Model } from "./model";
import {Shape, SquareATTR, StarATTR , BullsEyeATTR, CatATTR} from "./shape";
import "./form.css";

export class form implements View {
  //#region observer pattern

  update() {
    // clear the container
 
    if (this.model.selectId != null && this.model.selected == 1) {
      // if there is a selected shape
      if (this.model.updated_value == false){
        this.container.replaceChildren();
        // if the shape have just been selected
        const container1 = document.createElement("div");
        const HUE = document.createElement("label");
        HUE.innerHTML = "Hue ";
        container1.appendChild(HUE);
        const HUE_input = document.createElement("input");
        HUE_input.type = "number";
        HUE_input.min = "0";
        HUE_input.max = "360";
        this.model.all().forEach((t) => {
          if (t.id == this.model.selectId) {
            HUE_input.value = t.hue.toString();
          }
        });
        HUE_input.addEventListener("input", () => {
          if (!isNaN(Number(HUE_input.value))) {
            let hue = parseInt(HUE_input.value);
            if (0 <= hue && hue <= 360) {
             if (this.model.selectId != null){
               HUE_input.setAttribute("valid", "true");
               this.model.updatehue(this.model.selectId, hue);
             }
            }
            else {
              HUE_input.setAttribute("valid", "false");
            }
          }
        });
        container1.appendChild(HUE_input);

        const type = this.model.selectedShape?.attributes.type;

        if(type == "star"){
          // if the selected shape is a star, add a input for the number of spikes and the outer radius
          const attributes = this.model.selectedShape?.attributes as StarATTR;
          const spikes = document.createElement("label");
          spikes.innerHTML = "Spikes ";
          container1.appendChild(spikes);
          const spikes_input = document.createElement("input");
          spikes_input.type = "number";
          spikes_input.min = "3";
          spikes_input.max = "10";
          this.model.all().forEach((t) => {
            if (t.id == this.model.selectId) {
              spikes_input.value = attributes.spikes.toString();
            }
          });
          spikes_input.addEventListener("input", () => {
            if (!isNaN(Number(spikes_input.value))) {
              let spikes = parseInt(spikes_input.value);
              if (3 <= spikes && spikes <= 10) {
               if (this.model.selectId != null){
                 spikes_input.setAttribute("valid", "true");
                 this.model.updateSpikes(this.model.selectId, spikes);
               }
              }
              else {
                spikes_input.setAttribute("valid", "false");
              }
            }
          });
          container1.appendChild(spikes_input);

          const outerRadius = document.createElement("label");
          outerRadius.innerHTML = "Outer Radius ";
          container1.appendChild(outerRadius);
          const outerRadius_input = document.createElement("input");
          outerRadius_input.type = "number";
          outerRadius_input.min = "20";
          outerRadius_input.max = "45";
          this.model.all().forEach((t) => {
            if (t.id == this.model.selectId) {
              outerRadius_input.value = attributes.outerRadius.toString();
            }
          });
          outerRadius_input.addEventListener("input", () => {
            if (!isNaN(Number(outerRadius_input.value))) {
              let outerRadius = parseInt(outerRadius_input.value);
              if (20 <= outerRadius && outerRadius <= 45) {
               if (this.model.selectId != null){
                 outerRadius_input.setAttribute("valid", "true");
                 this.model.updateOuterRadius(this.model.selectId, outerRadius);
               }
              }
              else {
                outerRadius_input.setAttribute("valid", "false");
              }
            }
          });
          container1.appendChild(outerRadius_input);
        }
        else if(type == "bullseye"){
          // if the selected shape is a bullseye, add a input for the number of rings and the hue2
          const attributes = this.model.selectedShape?.attributes as BullsEyeATTR;
          const rings = document.createElement("label");
          rings.innerHTML = "Rings ";
          container1.appendChild(rings);
          const rings_input = document.createElement("input");
          rings_input.type = "number";
          rings_input.min = "2";
          rings_input.max = "5";
          this.model.all().forEach((t) => {
            if (t.id == this.model.selectId) {
              rings_input.value = attributes.rings.toString();
            }
          });
          rings_input.addEventListener("input", () => {
            if (!isNaN(Number(rings_input.value))) {
              let rings = parseInt(rings_input.value);
              if (2 <= rings && rings <= 5) {
               if (this.model.selectId != null){
                 rings_input.setAttribute("valid", "true");
                 this.model.updateRings(this.model.selectId, rings);
               }
              }
              else {
                rings_input.setAttribute("valid", "false");
              }
            }
          });
          container1.appendChild(rings_input);

          const hue2 = document.createElement("label");
          hue2.innerHTML = "Hue2 ";
          container1.appendChild(hue2);
          const hue2_input = document.createElement("input");
          hue2_input.type = "number";
          hue2_input.min = "0";
          hue2_input.max = "360";
          this.model.all().forEach((t) => {
            if (t.id == this.model.selectId) {
              hue2_input.value = attributes.hue2.toString();
            }
          });
          hue2_input.addEventListener("input", () => {
            if (!isNaN(Number(hue2_input.value))) {
              let hue2 = parseInt(hue2_input.value);
              if (0 <= hue2 && hue2 <= 360) {
               if (this.model.selectId != null){
                 hue2_input.setAttribute("valid", "true");
                 this.model.updateHue2(this.model.selectId, hue2);
               }
              }
              else {
                hue2_input.setAttribute("valid", "false");
              }
            }
          });
          container1.appendChild(hue2_input);
        }
        else if(type == "cat"){
          // if the selected shape is a cat, add a select for the eye direction
          const attributes = this.model.selectedShape?.attributes as CatATTR;
          const Look = document.createElement("label");
          Look.innerHTML = "Look ";
          container1.appendChild(Look);
          const Look_select = document.createElement("select");
          Look_select.addEventListener("change", () => {
            if (this.model.selectId != null){
              this.model.updateEyeDirection(this.model.selectId, Look_select.value);
            }
          });
          // add the options for the dropdown menu
          ['left', 'centre', 'right'].forEach(direction => {
            const option = document.createElement("option");
            option.value = direction;
            option.text = direction;
            if (attributes.eyeDirection === direction) {
              option.selected = true;
            }
            Look_select.appendChild(option);
          });
          container1.appendChild(Look_select);
          
        }
        this.container.appendChild(container1);
      }
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
    this.container.id = "form";

    // register with the model
    this.model.addObserver(this);
  }
}
