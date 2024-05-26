import React,{useState} from 'react';

import * as State from './state';

export default function Toolbar() {
    const [shape, setShape] = useState("Square");
    function handleShapeChange(e: Event) {
      const target = e.target as HTMLSelectElement;
      setShape(target.value);
      State.type.value = target.value;



    }
  return (
    <div class= "flex h-[50px] bg-lightgrey flex-row justify-start items-center p-[10px]">
      <button disabled={State.count.value == 25} class={`bg-gray-200 w-[85px] mr-[10px] border border-gray-500 rounded ${State.count.value == 25 ? 'opacity-50' : ''}`}
       onClick={State.add}>Add</button>
      <button disabled={State.selectedIds.value.length == 0} 
       class={`bg-gray-200 w-[85px] mr-[10px] border border-gray-500 rounded ${State.selectedIds.value.length == 0? 'opacity-50' : ''}`}
       onClick={State.deleteShape}>Delete</button>
      <select class="w-[85px] mr-[10px] justify-center border border-gray-500 rounded" value={shape} 
      onChange={handleShapeChange}>Square
        <option value="Square" >Square</option>
        <option value="Star">Star</option>
        <option value="Bullseye">Bullseye</option>
        <option value="Cat">Cat</option>
      </select>
          
      <button disabled={State.count.value == 0} class={`bg-gray-200 w-[85px] mr-[10px] border border-gray-500 rounded ${State.count.value == 0 ? 'opacity-50' : ''}`}
       onClick={State.clear}>Clear</button>
    </div>
  );
} 