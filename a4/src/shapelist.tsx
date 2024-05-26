import * as State from "./state";
import { Canvas } from "./Canvas";
import {Shape, SquareATTR, StarATTR , BullsEyeATTR, CatATTR} from "./shape";

State.initialize();

export default function Shapelist() {
    let size = 100;
    let key = ''
    let id = '??';
    let hue = '??';
    let keys: string[] = [];

    State.shapes.value.map((shape) => {
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
        keys.push(key);
      
    });
  
    return (
      <div class="flex flex-row flex-wrap flex-1 content-start m-[10px] overflow-auto " onClick={State.clearSelected}>
        {State.shapes.value.map((shape, index) => (
          <Canvas width={size} height={size} shape={shape} key={keys[index]} /> 
        ))}
      </div>
    );
  }