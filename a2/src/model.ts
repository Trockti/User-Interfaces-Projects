import { Subject } from "./observer";

type Shape = {
  id: string;
  hue: number;
  square: boolean;
  spikes: number;
  outerRadius: number;
};

// super simple "id generator"
let uniqueId = 1;
export class Model extends Subject {
      // model data (i.e. model state)
  shapes: Shape[] = [];
  selectedIds: string[] = [];
  shift = false;
  updated = false;
  canClear = false;
  get selected() {

    return this.selectedIds.length;
  }

  get count() {
    return this.shapes.length;
  }

  get updated_value(){
    return this.updated
  }


  all(): Shape[] {
    // return a copy (avoids bugs if views try to edit)
    return [...this.shapes];
  }
  initialize() {
    // create the eight initial shapes
    this.shapes = [];
    for (let i = 0; i < 8; i++) {

      this.shapes.push({id: uniqueId.toString(), hue: Math.floor(Math.random() * 361), square: true, 
        spikes: 0, outerRadius: 0});
      uniqueId++;
  }
     this.notifyObservers();
  }

    // Create Square
  createSquare() {
    // limit the number of shapes to 20
    if (this.count < 20){
      
      this.shapes = [
        ...this.shapes,
        {id: uniqueId.toString(), hue: Math.floor(Math.random() * 361), square: true,
          spikes: 0, outerRadius: 0}
      ];
      uniqueId++;
      this.notifyObservers();
    }
  }
  // Create Star
  createStar() {
    // limit the number of shapes to 20
    if (this.count < 20){
      this.shapes = [
        ...this.shapes,
        {id: uniqueId.toString(), hue: Math.floor(Math.random() * 361), square: false, 
          spikes: Math.floor(Math.random() * (10 - 3 + 1)) + 3, outerRadius: Math.floor(Math.random() * (45 - 20 + 1)) + 20}
      ];
      uniqueId++;
      this.notifyObservers();
    }
  }
  // Get the shape selected by the user
  get selectId() {
    // If no shape is selected, return null
    if (this.selectedIds.length == 0) {
      return null;
    }
    return this.selectedIds[0];
  }

  // function to select a shape
  select(id: string) {
    this.updated = false
    // if the shape is already selected, deselect it
    if (this.selectedIds.includes(id)) {
      if (!this.shift) {
        // if shift is not pressed, deselect all shapes
        this.selectedIds.length = 0;
      }
      else {
        // if shift is pressed, deselect the shape
        this.selectedIds = this.selectedIds.filter((t) => t !== id);
      }
    }
    else{
      if (!this.shift) {
        // if shift is not pressed, deselect all shapes
        this.selectedIds.length = 0;
      }
      this.selectedIds.push(id);
      
    }
    this.notifyObservers();
  }
  updatehue(id: string, hue: number) {
    // update the hue of the shape
    this.shapes.forEach((shape) => {
     if (shape.id == id) {
      shape.hue = hue;
     }
    });
    this.updated = true;
    this.notifyObservers();
  }
  updateSpikes(id: string, spikes: number) {
    // update the number of spikes of the shape
    this.shapes.forEach((shape) => {
     if (shape.id == id) {
      shape.spikes = spikes;
     }
    });
    this.updated = true;
    this.notifyObservers();
  }
  updateOuterRadius(id: string, outerRadius: number) {
    // update the outer radius of the shape 
    this.shapes.forEach((shape) => {
     if (shape.id == id) {
      shape.outerRadius = outerRadius;
     }
    });
    this.updated = true;
    this.notifyObservers();
  }
  
  delete() {
    // delete the selected shape
    this.shapes = this.shapes.filter((t) => t.id !==  this.selectId);
    this.selectedIds = [];
    this.notifyObservers();
  }
  clear() {
    // clear all shapes
    this.shapes = [];
    this.selectedIds = [];
    this.notifyObservers();
  }

  shiftPressed(shift:boolean) {
    // check if shift is pressed
    this.shift = shift;
  }
  clearSelected() {
    // clear the selected shapes, if the user can clear
    if (this.canClear){
      this.selectedIds = [];
      this.notifyObservers();
    }
  }
}
