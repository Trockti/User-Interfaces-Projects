import {Display} from './display';
import {SquareForm} from './SquareForm';
import { StarForm } from './StarForm';
import { BullseyeForm } from './BullseyeForm';
import { CatForm } from './CatForm';
import * as State from './state';
import { useState, useEffect } from 'preact/hooks';

export default function Rightview(

){
  let type = '??';
  if (State.selectedId.value != null && State.selected.value == 1) {
    State.shapes.value.map((shape) => {
        if (shape.id == State.selectedId.value) {
            type = shape.attributes.type;
        }
    });
}

  return (
    <div class="flex flex-col flex-1 relative bg-whitesmoke p-[10px] m-[10px] border border-gray-400">
      {State.selectedIds.value.length == 1 ? <Display/> : ''}
      {State.selectedIds.value.length == 1 && type=='square'? <SquareForm/> : ''}
      {State.selectedIds.value.length == 1 && type=='star'? <StarForm/> : ''}
      {State.selectedIds.value.length == 1 && type=='bullseye'? <BullseyeForm/> : ''}
      {State.selectedIds.value.length == 1 && type=='cat'? <CatForm/> : ''}
      {State.selectedIds.value.length == 0 ?  <label class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">Select One</label> : ''}
      {State.selectedIds.value.length > 1 ? <label class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">Too many selected</label> : ''}
      {}
    </div>
  );
}
