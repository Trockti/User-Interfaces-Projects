import * as State from './state';
import { useState, useEffect } from 'preact/hooks';

export default function Statusbar() {
    return (
        <div class="flex h-[50px] bg-lightgrey items-center justify-between p-[10px]">
            <div class="flex-1">
                <span class="flex h-[50px] bg-lightgrey items-center justify-start p-[10px]">
                    {State.count.value > 1? State.count.value + " shapes": State.count.value + " shape"}
                </span>
            </div>

            <div class="flex justify-center items-center  ">
                <button onClick={State.undo} class={`bg-gray-200 w-[80px] mr-[10px] border border-gray-500 rounded ${!State.canUndo.value? 'opacity-50' : ''}`}
                disabled={!State.canUndo.value}>Undo</button>
                <button onClick={State.redo} class={`bg-gray-200 w-[80px] mr-[10px] border border-gray-500 rounded ${!State.canRedo.value? 'opacity-50' : ''}`}
                disabled={!State.canRedo.value}>Redo</button>
            </div>

            <div class="flex-1">
                {State.selectedIds.value.length > 0? 
                    <span class = "flex h-[50px] bg-lightgrey items-center justify-end p-[10px]">
                        {State.selectedIds.value.length + ' selected'}
                    </span>
                : ''}
            </div>
        </div>
    );
}