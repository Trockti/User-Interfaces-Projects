import { Subject } from "./observer";
import {Shape, SquareATTR, StarATTR , BullsEyeATTR, CatATTR} from "./shape";
import { UndoManager, Command } from "./undo";
// super simple "id generator"
let uniqueId = 1;

export class Model extends Subject {
      // model data (i.e. model state)
  shapes: Shape[] = [];
  selectedIds: string[] = [];
  shift = false;
  CanRedo = false;
  updated = false;
  canClear = true;
  type = 'Square';
  private undoManager = new UndoManager();

  undo() {
      this.undoManager.undo();
      this.notifyObservers();
    
  }

  redo() {
      this.undoManager.redo();
      this.notifyObservers();
  }

  get canUndo() {
    return this.undoManager.canUndo;
  }

  get canRedo() {
    return this.undoManager.canRedo;
  }

  get selected() {

    return this.selectedIds.length;
  }

  get count() {
    return this.shapes.length;
  }

  get updated_value(){
    return this.updated
  }
  get typeSelected(){
    return this.type;
  }


  all(): Shape[] {
    // return a copy (avoids bugs if views try to edit)
    return [...this.shapes];
  }
  initialize() {
    // create the eight initial shapes
    this.shapes = [];
    for (let i = 0; i < 8; i++) {

      this.shapes.push({id: uniqueId.toString(), hue: Math.floor(Math.random() * 361), hover: false, clicked: false, 
        attributes: {type: 'square'} as SquareATTR});
      uniqueId++;
  }
     this.notifyObservers();
  }
  setType(t: string){
    this.type = t;
    this.notifyObservers();
  }
    // Create Square
  add() {
    // limit the number of shapes to 20
    if (this.count < 25){
      if(this.type == 'Square'){
        this.undoManager.execute({
          do: () => {
            this.shapes = [
              ...this.shapes,
              {id: uniqueId.toString(), hue: Math.floor(Math.random() * 361), hover: false, clicked: false,
                attributes: {type: 'square'} as SquareATTR}
            ];
          },
          undo: () => {
            this.shapes = this.shapes.slice(0, -1);
          },
        } as Command)
        this.shapes = [
          ...this.shapes,
          {id: uniqueId.toString(), hue: Math.floor(Math.random() * 361), hover: false, clicked: false,
            attributes: {type: 'square'} as SquareATTR}
        ];
        uniqueId++;
      }
      if(this.type == 'Star'){
        this.undoManager.execute({
          do: () => {
            this.shapes = [
              ...this.shapes,
              {id: uniqueId.toString(), hue: Math.floor(Math.random() * 361), hover: false, clicked: false,
                attributes: {type: 'star', spikes: Math.floor(Math.random() * (10 - 3 + 1)) + 3, outerRadius: Math.floor(Math.random() * (45 - 20 + 1)) + 20} as StarATTR}
            ];
          },
          undo: () => {
            this.shapes = this.shapes.slice(0, -1);
          },
        } as Command)
        this.shapes = [
          ...this.shapes,
          {id: uniqueId.toString(), hue: Math.floor(Math.random() * 361), hover: false, clicked: false,
            attributes: {type: 'star', spikes: Math.floor(Math.random() * (10 - 3 + 1)) + 3, outerRadius: Math.floor(Math.random() * (45 - 20 + 1)) + 20} as StarATTR}
        ];
        uniqueId++;
      }
      if(this.type == 'Bullseye'){
        this.undoManager.execute({
          do: () => {
            this.shapes = [
              ...this.shapes,
              {id: uniqueId.toString(), hue: Math.floor(Math.random() * 361), hover: false, clicked: false,
                attributes: {type: 'bullseye', rings: Math.floor(Math.random() * 4) + 2, hue2: Math.floor(Math.random() * 361)} as BullsEyeATTR}
            ];
          },
          undo: () => {
            this.shapes = this.shapes.slice(0, -1);
          },
        } as Command)
        this.shapes = [
          ...this.shapes,
          {id: uniqueId.toString(), hue: Math.floor(Math.random() * 361), hover: false, clicked: false,
            attributes: {type: 'bullseye', rings: Math.floor(Math.random() * 4) + 2, hue2: Math.floor(Math.random() * 361)} as BullsEyeATTR}
        ];
        uniqueId++;
      }
      if(this.type == 'Cat'){
        const directions = ['left', 'centre', 'right'];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        this.undoManager.execute({
          do: () => {
            this.shapes = [
              ...this.shapes,
              {id: uniqueId.toString(), hue: Math.floor(Math.random() * 361), hover: false, clicked: false,
                attributes: {type: 'cat', eyeDirection: randomDirection} as CatATTR}
            ];
          },
          undo: () => {
            this.shapes = this.shapes.slice(0, -1);
          },
        } as Command)
        this.shapes = [
          ...this.shapes,
          {id: uniqueId.toString(), hue: Math.floor(Math.random() * 361), hover: false, clicked: false,
            attributes: {type: 'cat', eyeDirection: randomDirection} as CatATTR}
        ];
        uniqueId++;
      }
      
    }
    this.notifyObservers();
  }
  // Create Star

  // Get the shape selected by the user
  get selectId() {
    // If no shape is selected, return null
    if (this.selectedIds.length == 0) {
      return null;
    }
    return this.selectedIds[0];
  }
  get selectedShape() {
    // If no shape is selected, return null
    if (this.selectedIds.length == 0) {
      return null;
    }
    return this.shapes.find((t) => t.id == this.selectedIds[0]);
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
  
    for (let i = 0; i < this.shapes.length; i++) {
        
        this.selectedIds.includes(this.shapes[i].id) ? this.shapes[i].clicked = true : this.shapes[i].clicked = false;
    }
    this.notifyObservers();
  }
  updatehue(id: string, hue: number) {
    // update the hue of the shape
    const originalHue = this.shapes.find((t) => t.id === id)?.hue;
    this.undoManager.execute({
      do: () => {
        this.shapes.forEach((shape) => {
          if (shape.id == id) {
           shape.hue = hue;
          }
         });
         this.updated = true;
      },
      undo: () => {
        this.shapes.forEach((shape) => {
          if (shape.id == id) {
           shape.hue = originalHue as number;
          }
         });
      }, 
    } as Command);
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
    const originalSpikes = (this.shapes.find((t) => t.id === id)?.attributes as StarATTR).spikes;
    this.undoManager.execute({
      do: () => {
        this.shapes.forEach((shape) => {
          if (shape.id == id) {
           let attributes = shape.attributes as StarATTR;
           attributes.spikes = spikes;
          }
         });
         this.updated = true;
      },
      undo: () => {
        this.shapes.forEach((shape) => {
          if (shape.id == id) {
           let attributes = shape.attributes as StarATTR;
           attributes.spikes = originalSpikes;
          }
         });
      }, 
    } as Command);
    this.shapes.forEach((shape) => {
     if (shape.id == id) {
      let attributes = shape.attributes as StarATTR;
      attributes.spikes = spikes;
     }
    });
    this.updated = true;
    this.notifyObservers();
  }
  updateOuterRadius(id: string, outerRadius: number) {
    // update the outer radius of the shape 
    const originalOuterRadius = (this.shapes.find((t) => t.id === id)?.attributes as StarATTR).outerRadius;
    this.undoManager.execute({
      do: () => {
        this.shapes.forEach((shape) => {
          if (shape.id == id) {
           let attributes = shape.attributes as StarATTR;
           attributes.outerRadius = outerRadius;
          }
         });
         this.updated = true;
      },
      undo: () => {
        this.shapes.forEach((shape) => {
          if (shape.id == id) {
           let attributes = shape.attributes as StarATTR;
           attributes.outerRadius = originalOuterRadius;
          }
         });
      }, 
    } as Command);
    this.shapes.forEach((shape) => {
     if (shape.id == id) {
      let attributes = shape.attributes as StarATTR;
      attributes.outerRadius = outerRadius;
     }
    });
    this.updated = true;
    this.notifyObservers();
  }
  updateRings(id: string, rings: number) {
    // update the number of rings of the shape
    const originalRings = (this.shapes.find((t) => t.id === id)?.attributes as BullsEyeATTR).rings;
    this.undoManager.execute({
      do: () => {
        this.shapes.forEach((shape) => {
          if (shape.id == id) {
           let attributes = shape.attributes as BullsEyeATTR;
           attributes.rings = rings;
          }
         });
         this.updated = true;
      },
      undo: () => {
        this.shapes.forEach((shape) => {
          if (shape.id == id) {
           let attributes = shape.attributes as BullsEyeATTR;
           attributes.rings = originalRings;
          }
         });
      }, 
    } as Command);
    this.shapes.forEach((shape) => {
     if (shape.id == id) {
      let attributes = shape.attributes as BullsEyeATTR;
      attributes.rings = rings;
     }
    });
    this.updated = true;
    this.notifyObservers();
  }
  updateHue2(id: string, hue2: number) {
    // update the hue of the shape
    const originalHue2 = (this.shapes.find((t) => t.id === id)?.attributes as BullsEyeATTR).hue2;
    this.undoManager.execute({
      do: () => {
        this.shapes.forEach((shape) => {
          if (shape.id == id) {
           let attributes = shape.attributes as BullsEyeATTR;
           attributes.hue2 = hue2;
          }
         });
         this.updated = true;
      },
      undo: () => {
        this.shapes.forEach((shape) => {
          if (shape.id == id) {
           let attributes = shape.attributes as BullsEyeATTR;
           attributes.hue2 = originalHue2;
          }
         });
      }, 
    } as Command);
    this.shapes.forEach((shape) => {
     if (shape.id == id) {
      let attributes = shape.attributes as BullsEyeATTR;
      attributes.hue2 = hue2;
     }
    });
    this.updated = true;
    this.notifyObservers();
  }
  updateEyeDirection(id: string, eyeDirection: string) {
    // update the eye direction of the shape
    const originalEyeDirection = (this.shapes.find((t) => t.id === id)?.attributes as CatATTR).eyeDirection;
    this.undoManager.execute({
      do: () => {
        this.shapes.forEach((shape) => {
          if (shape.id == id) {
           let attributes = shape.attributes as CatATTR;
           attributes.eyeDirection = eyeDirection;
          }
         });
         this.updated = true;
      },
      undo: () => {
        this.shapes.forEach((shape) => {
          if (shape.id == id) {
           let attributes = shape.attributes as CatATTR;
           attributes.eyeDirection = originalEyeDirection;
          }
         });
      }, 
    } as Command);
    this.shapes.forEach((shape) => {
     if (shape.id == id) {
      let attributes = shape.attributes as CatATTR;
      attributes.eyeDirection = eyeDirection;
     }
    });
    this.updated = true;
    this.notifyObservers();
  }
  
  delete() {
    // delete the selected shape
    const deleted: Shape[] = [];
    const deletedIndexes: number[] = [];
    this.shapes.forEach((shape) => {
      if (this.selectedIds.includes(shape.id)) {
        deleted.push(shape);
        deletedIndexes.push(this.shapes.findIndex((t) => t.id === shape.id));
      }
    });
    const deletedIds = this.selectedIds;
    this.undoManager.execute({
      do: () => {
        this.shapes = this.shapes.filter((t) => !this.selectedIds.includes(t.id));
        this.selectedIds = [];
      },
      undo: () => {
        let i = 0;
        let j = 0;
        deletedIndexes.forEach((index) => {
          this.shapes = [...this.shapes.slice(0, index + i), deleted[j], ...this.shapes.slice(index + i)];
          i++;
          j++;
        });
        this.selectedIds = deletedIds;
      },
    } as Command);
    this.shapes = this.shapes.filter((t) => !this.selectedIds.includes(t.id));
    this.selectedIds = [];
    this.notifyObservers();
  }
  clear() {
    // clear all shapes
    const deleted: Shape[] = [...this.shapes];
    this.undoManager.execute({
      do: () => {
        this.shapes = [];
        this.selectedIds = [];
      },
      undo: () => {
        this.shapes = [...this.shapes, ...deleted];

      },
    } as Command);
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
      this.shapes.forEach((shape) => {
        shape.clicked = false;
      });
      this.notifyObservers();
    }
  }
}
