import * as State from './state';
import { useRef, useEffect, useState } from "preact/hooks";

export function SquareForm() {
    let hue = '??'
    let type = '??'
    if (State.selectedId.value != null && State.selected.value == 1) {
        State.shapes.value.map((shape) => {
            if (shape.id == State.selectedId.value) {
                hue = shape.hue.toString();
                type = shape.attributes.type;
            }
        });
    }
    const [inputValue, setInputValue] = useState(hue);

    useEffect(() => {
        setInputValue(hue);
    }, [hue]);

    const valid = (input: number) => {
    return input >= 0 && input <= 360 && !isNaN(input);
    }
    function inputHandler(e: Event) {
        const newValue = parseInt((e.target as HTMLInputElement).value);
        setInputValue(newValue.toString());
        if (valid(newValue)) {
            State.updateHue(State.selectedId.value, newValue);
        }
    }

    return (
        <div class="flex-1 m-[10px] border border-gray-400 p-[10px] flex flex-col items-center">
            <div class="flex flex-row justify-center">
            <label class="mr-[10px]">Hue </label>
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
        </div>
    );
}