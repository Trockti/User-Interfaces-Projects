import * as State from './state';
import {CanvasDisplay} from './CanvasDisplay';
import {Shape, SquareATTR, StarATTR , BullsEyeATTR, CatATTR} from "./shape";

export function Display() {
    let ShapeDisplay: Shape | null = null;
    let id = State.selectedId.value;
    let size = 100;
    let hue = '??';
    let key = '';
    if(State.selectedId.value != null && State.selected.value == 1){

      State.shapes.value.map((shape) => {
        if(shape.id == State.selectedId.value){
          ShapeDisplay = shape;
          id = shape.id;
          hue = shape.hue.toString();
          key = shape.id + hue;
          if(shape.attributes.type == 'star'){
            let attributes = shape.attributes as StarATTR;
            key = shape.id + hue + attributes.outerRadius + attributes.spikes;
           
          }
          if(shape.attributes.type == 'bullseye'){
            let attributes = shape.attributes as BullsEyeATTR;
            key = shape.id + hue + attributes.hue2 + attributes.rings;
          }
          if(shape.attributes.type == 'cat'){
            let attributes = shape.attributes as CatATTR;
            key = shape.id + hue + attributes.eyeDirection;
            
        }
      
    }
  });
}
    return ( 
      <div class="flex-2 flex justify-center object-center">
        {ShapeDisplay ? <CanvasDisplay width={size} height={size} shape={ShapeDisplay} key={key} /> : null}

      </div>
    )
}