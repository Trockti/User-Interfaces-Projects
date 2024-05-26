
import { Model } from "./model";

import { toolbar } from "./toolbar";
import { statusbar } from "./statusbar";
import { shapelist } from "./shapelist";
import { rightview } from "./rightview";



import "./main.css";

console.log("a3");



const model = new Model();

// root container (the div already in index.html)
const root = document.querySelector("div#app") as HTMLDivElement;


// create div to hold left-side views
const left = document.createElement("div");
left.id = "left";

left.appendChild(new toolbar(model).root);
left.appendChild(new shapelist(model).root);
left.appendChild(new statusbar(model).root);


root.appendChild(left);
// right view

root.appendChild(new rightview(model).root);


