import { render } from "preact";
import { useEffect } from "preact/hooks";
import * as State from "./state";
import Rightview from "./rightview";
import Toolbar from "./toolbar";
import Shapelist from "./shapelist";
import Statusbar from "./statusbar";

import "./style.css";

// import * as State from "./state";

export default function App() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        State.shiftPressed.value = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        State.shiftPressed.value = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  window.addEventListener('keydown', (e) => {
      
    if(e.key === 'z' && e.ctrlKey && !e.shiftKey){
      // Undo the last action if the user presses ctrl + z
      State.undo();
    }
    if(e.key === 'Z' && e.ctrlKey && e.shiftKey){
      // Redo the last action if the user presses ctrl + shift + z
      State.redo();
    }
  });



  return (
    <div class="h-screen flex bg-whitesmoke">
      <div class="flex flex-col bg-white flex-2">
        <Toolbar />
        <Shapelist />
        <Statusbar />
      </div>
        <Rightview />
    </div>
  );
}

render(<App />, document.querySelector("div#app") as Element);
