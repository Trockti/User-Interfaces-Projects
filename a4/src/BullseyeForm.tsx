import * as State from './state';
import { useRef, useEffect, useState } from "preact/hooks";
import { BullsEyeATTR, StarATTR } from "./shape";

export function BullseyeForm() {
    let hue = '??'
    let type = '??'
    let rings = 0;
    let hue2 = 0;
    if (State.selectedId.value != null && State.selected.value == 1) {
        State.shapes.value.map((shape) => {
            if (shape.id == State.selectedId.value) {
                hue = shape.hue.toString();
                type = shape.attributes.type;
                let attributes = shape.attributes as BullsEyeATTR;
                rings = attributes.rings;
                hue2 = attributes.hue2;

            }
        });
    }
    const [inputValue, setInputValue] = useState(hue);
    const [ringsValue, setRingsValue] = useState(rings);
    const [hue2Value, setHue2Value] = useState(hue2);

    useEffect(() => {
        setInputValue(hue);
    }, [hue]);

    const valid = (input: number) => input >= 0 && input <= 360 && !isNaN(input);
    const validRings = (input: number) => input >= 2 && input <= 5 && !isNaN(input);
    const validHue2 = (input: number) => input >= 0 && input <= 360 && !isNaN(input);
    function inputHandler(e: Event) {
        const newValue = parseInt((e.target as HTMLInputElement).value);
        setInputValue(newValue.toString());
        if (valid(newValue)) {
            State.updateHue(State.selectedId.value, newValue);
        }
    }
    function ringsHandler(e: Event) {
        const newValue = parseInt((e.target as HTMLInputElement).value);
        setRingsValue(newValue);
        if (validRings(newValue)) {
            State.updateRings(State.selectedId.value, newValue);
        }
    }
    function hue2Handler(e: Event) {
        const newValue = parseInt((e.target as HTMLInputElement).value);
        setHue2Value(newValue);
        if (validHue2(newValue)) {
            State.updateHue2(State.selectedId.value, newValue);
        }
    }

    return (
        <div class="flex-1 m-[10px] border border-gray-400 p-[10px] flex flex-col items-center space-y-4">
            <div class="flex flex-row justify-center ">
            <label class="mr-[10px]">Hue1 </label>
            <input 
            class={`${valid( parseInt(inputValue)) ? '' : 'ring-2 ring-red-500 focus:outline-none'} w-[70px]`}

            type="number"
            min="0"
            max="360"
            onInput={inputHandler} 
            onBlur={() => State.updateReset(false)}
            value={inputValue}>
            </input>
            </div>
            <div class="flex flex-row justify-center">
            <label class="mr-[10px]">Hue2 </label>
            <input
            class={`${validHue2(hue2Value) ? '' : 'ring-2 ring-red-500 focus:outline-none'} w-[70px]]`}
            type="number"
            min="0"
            max="360"
            onInput={hue2Handler}
            onBlur={() => State.updateReset(false)}
            value={hue2Value}>
            </input>
            </div>
            <div class="flex flex-row justify-center">
            <label class="mr-[10px]">Points </label>
            <input
            class={`${validRings(ringsValue) ? '' : 'ring-2 ring-red-500 focus:outline-none'} w-[70px]`}
            type="number"
            min="2"
            max="5"
            onInput={ringsHandler}
            onBlur={() => State.updateReset(false)}
            value={ringsValue}>
            </input> 
            </div>   
        </div>
    );
}