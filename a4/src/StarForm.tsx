import * as State from './state';
import { useRef, useEffect, useState } from "preact/hooks";
import { StarATTR } from "./shape";

export function StarForm() {
    let hue = '??'
    let type = '??'
    let radius = 0;
    let spikes = 0;
    if (State.selectedId.value != null && State.selected.value == 1) {
        State.shapes.value.map((shape) => {
            if (shape.id == State.selectedId.value) {
                hue = shape.hue.toString();
                type = shape.attributes.type;
                let attributes = shape.attributes as StarATTR;
                radius = attributes.outerRadius;
                spikes = attributes.spikes;

            }
        });
    }
    const [inputValue, setInputValue] = useState(hue);
    const [radiusValue, setRadiusValue] = useState(radius);    
    const [spikesValue, setSpikesValue] = useState(spikes);

    useEffect(() => {
        setInputValue(hue);
    }, [hue]);

    useEffect(() => {
        setRadiusValue(radius);
    }, [radius]);

    useEffect(() => {
        setSpikesValue(spikes);
    }, [spikes]);

    const valid = (input: number) => input >= 0 && input <= 360 && !isNaN(input);
    const validRadius = (input: number) => input >= 0 && input <= 45 && !isNaN(input);
    const validSpikes = (input: number) => input >= 3 && input <= 10 && !isNaN(input);
    function inputHandler(e: Event) {
        const newValue = parseInt((e.target as HTMLInputElement).value);
        setInputValue(newValue.toString());
        if (valid(newValue)) {
            State.updateHue(State.selectedId.value, newValue);
        }
    }
    function radiusHandler(e: Event) {
        const newValue = parseInt((e.target as HTMLInputElement).value);
        setRadiusValue(newValue);
        if (validRadius(newValue)) {
            State.updateOuterRadius(State.selectedId.value, newValue);
        }
    }

    function spikesHandler(e: Event) {
        const newValue = parseInt((e.target as HTMLInputElement).value);
        setSpikesValue(newValue);
        if (validSpikes(newValue)) {
            State.updateSpikes(State.selectedId.value, newValue);
        }
    }
    return (
        <div class="flex-1 m-[10px] border border-gray-400 p-[10px] flex flex-col items-center space-y-4">
            <div class="flex flex-row justify-center ">
            <label class="mr-[10px]"> Hue </label>
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
            <label class="mr-[10px]">Radius  </label>
            <input
            class={`${validRadius( radiusValue) ? '' : 'ring-2 ring-red-500 focus:outline-none'} w-[70px]`}
            type="number"
            min="20"
            max="45"
            onInput={radiusHandler}
            onBlur={() => State.updateReset(false)}
            value={radiusValue}>
            </input>
            </div>
            <div class="flex flex-row justify-center">
            <label class="mr-[10px]">Points  </label>
            <input
            class={`${validSpikes(spikesValue) ? '' : 'ring-2 ring-red-500 focus:outline-none'} w-[70px`}
            type="number"
            min="3"
            max="10"
            onInput={spikesHandler}
            onBlur={() => State.updateReset(false)}
            value={spikesValue}>
            </input> 
            </div>   
        </div>
    );
}