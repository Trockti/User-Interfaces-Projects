import { computed, signal } from "@preact/signals";
import {Shape, SquareATTR, StarATTR , BullsEyeATTR, CatATTR} from "./shape";
import { UndoManager, Command } from "./undo";

let uniqueId = 1;
let updated = false;
export const undoManager = new UndoManager();

export const shapes = signal<Shape[]>([]);

export const selectedIds = signal<string[]>([]);

export const shiftPressed = signal(false)

export const canClear = signal(false)

export const type = signal("Square")

export const count = computed(() => shapes.value.length);

export const selected = computed(() => selectedIds.value.length);

export const selectedId = computed(() => selectedIds.value[0]);

export const canUndo = signal(false);

export const canRedo = signal(false);

export const undo = () => {
  undoManager.undo();
  canUndo.value = undoManager.canUndo
  canRedo.value = undoManager.canRedo
}

export const redo = () => {
  undoManager.redo();
  canUndo.value = undoManager.canUndo
  canRedo.value = undoManager.canRedo
}

export const initialize = () => {
    // create the eight initial shapes
    shapes.value = []; 
    for (let i = 0; i < 8; i++) {
      shapes.value = [...shapes.value, ({id: uniqueId.toString(), hue: Math.floor(Math.random() * 361), hover: false, clicked: false, 
        attributes: {type: 'square'} as SquareATTR})]
      uniqueId++;
  }
  }

export const add = () => {
   // limit the number of shapes to 20
   if (count.value < 25){
    const id = uniqueId++;
    
    if(type.value == 'Square'){
      let newShape = {id: id.toString(), hue: Math.floor(Math.random() * 361), hover: false, clicked: false,
        attributes: {type: 'square'} as SquareATTR}
      undoManager.execute({
        do: () => {
          shapes.value = [
            ...shapes.value,
            newShape
          ];
        },
        undo: () => {
          shapes.value = shapes.value.slice(0, -1);
        },
      } as Command)
      canUndo.value = undoManager.canUndo
      canRedo.value = undoManager.canRedo
      shapes.value = [
        ...shapes.value,
        newShape
      ];
    }
    if(type.value == 'Star'){
      let newShape =  {id: id.toString(), hue: Math.floor(Math.random() * 361), hover: false, clicked: false,
        attributes: {type: 'star', spikes: Math.floor(Math.random() * (10 - 3 + 1)) + 3, outerRadius: Math.floor(Math.random() * (45 - 20 + 1)) + 20} as StarATTR}
      undoManager.execute({
        do: () => {
          shapes.value = [
            ...shapes.value,
            newShape
          ];
        },
        undo: () => {
          shapes.value = shapes.value.slice(0, -1);
        },
      } as Command)
      canUndo.value = undoManager.canUndo
      canRedo.value = undoManager.canRedo
      shapes.value = [
        ... shapes.value,
        newShape];
    }
    if(type.value == 'Bullseye'){
      let newShape = {id: id.toString(), hue: Math.floor(Math.random() * 361), hover: false, clicked: false,
        attributes: {type: 'bullseye', rings: Math.floor(Math.random() * 4) + 2, hue2: Math.floor(Math.random() * 361)} as BullsEyeATTR}
      undoManager.execute({
        do: () => {
          shapes.value = [
            ...shapes.value,
            newShape
          ];
        },
        undo: () => {
          shapes.value = shapes.value.slice(0, -1);
        },
      } as Command)
      canUndo.value = undoManager.canUndo
      canRedo.value = undoManager.canRedo
      shapes.value = [
        ... shapes.value,
        newShape
      ];
    }
    if(type.value == 'Cat'){
      const directions = ['left', 'centre', 'right'];
      const randomDirection = directions[Math.floor(Math.random() * directions.length)];
      let newShape = {id: id.toString(), hue: Math.floor(Math.random() * 361), hover: false, clicked: false,
        attributes: {type: 'cat', eyeDirection: randomDirection} as CatATTR}
      undoManager.execute({
        do: () => {
          shapes.value = [
            ...shapes.value,
            newShape
          ];
        },
        undo: () => {
          shapes.value = shapes.value.slice(0, -1);
        },
      } as Command)
      canUndo.value = undoManager.canUndo
      canRedo.value = undoManager.canRedo
      shapes.value = [
        ... shapes.value,
        newShape
      ];
    }
    
  }
}

export const select: (id: string) => void = (id) => {
  updated = false
  // if the shape is already selected, deselect it
  if (selectedIds.value.includes(id)) {
    if (!shiftPressed.value) {
      // if shift is not pressed, deselect all shapes
      selectedIds.value = [];
    }
    else {
      // if shift is pressed, deselect the shape
      selectedIds.value = selectedIds.value.filter((t) => t !== id);
    }
  }
  else{
    if (!shiftPressed.value) {
      // if shift is not pressed, deselect all shapes
      selectedIds.value = [];
    }

    selectedIds.value = [...selectedIds.value, id];
    
  }
  for (let i = 0; i < count.value; i++) {
      
    selectedIds.value.includes(shapes.value[i].id) ? shapes.value[i].clicked = true : shapes.value[i].clicked = false;
  }
}

export const deleteShape = () => {
  // delete the selected shape
  const deleted: Shape[] = shapes.value;

  const deletedIds = selectedIds.value;
  undoManager.execute({
    do: () => {
      shapes.value = shapes.value.filter((t) => !selectedIds.value.includes(t.id));
      selectedIds.value = [];
    },
    undo: () => {
      shapes.value = deleted;
      selectedIds.value = deletedIds;
    },
  } as Command);
  canUndo.value = undoManager.canUndo
  canRedo.value = undoManager.canRedo
  shapes.value = shapes.value.filter((t) => !selectedIds.value.includes(t.id));
  selectedIds.value = [];
}

export const clear = () => {
  // clear all shapes
  const deleted: Shape[] = [...shapes.value];
  undoManager.execute({
    do: () => {
      shapes.value = [];
      selectedIds.value = [];
    },
    undo: () => {
      shapes.value = [...shapes.value, ...deleted];

    },
  } as Command);
  canUndo.value = undoManager.canUndo
  canRedo.value = undoManager.canRedo
  shapes.value = [];
  selectedIds.value = [];

}

export const reset = signal(false);
let propUndo :number|undefined = 0;
let change = true;
export const updateHue: (id: string, hue: number) => void = (id, hue) => {
  if(change){
    const originalHue = shapes.value.find((t) => t.id === id)?.hue;
    if (reset.value){
      undoManager.pop();
    }
    else{
      reset.value = true
      propUndo = originalHue
    }
    undoManager.execute({
      do: () => {
        shapes.value = shapes.value.map((shape) => 
        shape.id == id ? { ...shape, hue: hue } : shape);
      },
      undo: () => {
        change = false
        reset.value = false
        shapes.value = shapes.value.map((shape) => 
        shape.id == id ? { ...shape, hue: propUndo? propUndo : 0} : shape);
      }, 
    } as Command);
    canUndo.value = undoManager.canUndo
    canRedo.value = undoManager.canRedo
    shapes.value = shapes.value.map((shape) => 
      shape.id == id ? { ...shape, hue: hue } : shape);
  }
  else{
    change = true;
  }
  }

export const updateReset: (value:boolean) => void = (value: boolean) => reset.value = value;


export const updateSpikes:(id: string, spikes: number) => void = (id, spikes) =>{
  // update the number of spikes of the shape
  if(change){
    const originalSpikes = (shapes.value.find((t) => t.id === id)?.attributes as StarATTR).spikes;
    if (reset.value){
      undoManager.pop();
    }
    else{
      reset.value = true
      propUndo = originalSpikes
    }
    undoManager.execute({
      do: () => {
        shapes.value = shapes.value.map((shape) => {
          if (shape.id === id) {
            let attributes = shape.attributes as StarATTR;
            return { ...shape, attributes: { ...attributes, spikes: spikes } };
          }
          return shape;
        });
      },
      undo: () => {
        change = false
        reset.value = false
        shapes.value = shapes.value.map((shape) => {
          if (shape.id === id) {
            let attributes = shape.attributes as StarATTR;
            return { ...shape, attributes: { ...attributes, spikes: propUndo? propUndo: 0 } };
          }
          return shape;
        });
      },
    } as Command);
    shapes.value = shapes.value.map((shape) => {
      if (shape.id === id) {
        let attributes = shape.attributes as StarATTR;
        return { ...shape, attributes: { ...attributes, spikes: spikes } };
      }
      return shape;
    });
  }
  else{
    change = true;
  }
}

export const updateOuterRadius:(id: string, outerRadius: number) => void = (id, outerRadius) =>{
  // update the outer radius of the shape 
  if(change){
    const originalOuterRadius = (shapes.value.find((t) => t.id === id)?.attributes as StarATTR).outerRadius;
    if (reset.value){
      undoManager.pop();
    }
    else{
      reset.value = true
      propUndo = originalOuterRadius
    }
    undoManager.execute({
      do: () => {
        shapes.value = shapes.value.map((shape) => {
          if (shape.id === id) {
            let attributes = shape.attributes as StarATTR;
            return { ...shape, attributes: { ...attributes, outerRadius: outerRadius } };
          }
          return shape;
        });
      },
      undo: () => {
        change = false
        reset.value = false
        shapes.value = shapes.value.map((shape) => {
          if (shape.id === id) {
            let attributes = shape.attributes as StarATTR;
            return { ...shape, attributes: { ...attributes, outerRadius: propUndo? propUndo : 0 } };
          }
          return shape;
        });
      },
    } as Command);
    shapes.value = shapes.value.map((shape) => {
      if (shape.id === id) {
        let attributes = shape.attributes as StarATTR;
        return { ...shape, attributes: { ...attributes, outerRadius: outerRadius } };
      }
      return shape;
    });
  }
  else{
    change = true;
  }
}

export const updateRings:(id: string, rings: number) => void = (id, rings) => {
  // update the number of rings of the shape
  if(change){
    const originalRings = (shapes.value.find((t) => t.id === id)?.attributes as BullsEyeATTR).rings;
    if (reset.value){
      undoManager.pop();
    }
    else{
      reset.value = true
      propUndo = originalRings
    }
    undoManager.execute({
      do: () => {
        shapes.value = shapes.value.map((shape) => {
          if (shape.id === id) {
            let attributes = shape.attributes as BullsEyeATTR;
            return { ...shape, attributes: { ...attributes, rings: rings } };
          }
          return shape;
        });
      },
      undo: () => {
        change = false
        reset.value = false
        shapes.value = shapes.value.map((shape) => {
          if (shape.id === id) {
            let attributes = shape.attributes as BullsEyeATTR;
            return { ...shape, attributes: { ...attributes, rings: propUndo? propUndo : 0 } };
          }
          return shape;
        });
      },
    } as Command);
    shapes.value = shapes.value.map((shape) => {
      if (shape.id === id) {
        let attributes = shape.attributes as BullsEyeATTR;
        return { ...shape, attributes: { ...attributes, rings: rings } };
      }
      return shape;
    });
  }
  else{
    change = true;
  }
}

export const updateHue2:(id: string, hue2: number) => void = (id, hue2) => {
  // update the hue2 of the shape
  if(change){
    const originalHue2 = (shapes.value.find((t) => t.id === id)?.attributes as BullsEyeATTR).hue2;
    if (reset.value){
      undoManager.pop();
    }
    else{
      reset.value = true
      propUndo = originalHue2
    }
    undoManager.execute({
      do: () => {
        shapes.value = shapes.value.map((shape) => {
          if (shape.id === id) {
            let attributes = shape.attributes as BullsEyeATTR;
            return { ...shape, attributes: { ...attributes, hue2: hue2 } };
          }
          return shape;
        });
      },
      undo: () => {
        change = false
        reset.value = false
        shapes.value = shapes.value.map((shape) => {
          if (shape.id === id) {
            let attributes = shape.attributes as BullsEyeATTR;
            return { ...shape, attributes: { ...attributes, hue2: propUndo? propUndo : 0 } };
          }
          return shape;
        });
      },
    } as Command);
    shapes.value = shapes.value.map((shape) => {
      if (shape.id === id) {
        let attributes = shape.attributes as BullsEyeATTR;
        return { ...shape, attributes: { ...attributes, hue2: hue2 } };
      }
      return shape;
    });
  }
  else{
    change = true;
  }
}

export const updateEyeDirection:(id: string, eyeDirection: string) => void = (id, eyeDirection) => {
  // update the eye direction of the shape
  const originalEyeDirection = (shapes.value.find((t) => t.id === id)?.attributes as CatATTR).eyeDirection;
  undoManager.execute({
    do: () => {
      shapes.value = shapes.value.map((shape) => {
        if (shape.id === id) {
          let attributes = shape.attributes as CatATTR;
          return { ...shape, attributes: { ...attributes, eyeDirection: eyeDirection } };
        }
        return shape;
      });
    },
    undo: () => {
      shapes.value = shapes.value.map((shape) => {
        if (shape.id === id) {
          let attributes = shape.attributes as CatATTR;
          return { ...shape, attributes: { ...attributes, eyeDirection: originalEyeDirection } };
        }
        return shape;
      });
    },
  } as Command);
  shapes.value = shapes.value.map((shape) => {
    if (shape.id === id) {
      let attributes = shape.attributes as CatATTR;
      return { ...shape, attributes: { ...attributes, eyeDirection: eyeDirection } };
    }
    return shape;
  });
}

export const clearSelected = () => {
    // clear the selected shapes, if the user can clear
    if (canClear.value){
      selectedIds.value = [];
      shapes.value.map((shape) => {
        shape.clicked = false;
      });
    }
}