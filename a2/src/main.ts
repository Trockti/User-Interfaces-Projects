import {  
    startSimpleKit,
    setSKRoot,
    SKContainer,
    Layout
} from "simplekit/imperative-mode";
import {} from "simplekit/utility"
import { Model } from "./model";
import { LeftView } from "./leftView";
import { RightView } from "./rightView";
import { ToolBar } from "./toolbar";
import { StatusBar } from "./statusbar";
import { ShapeList } from "./shapelist";
import { MakeLeftViewLayout } from "./customlayout";

const model = new Model();


// root container
const root = new SKContainer();
root.id = "root";
root.layoutMethod = Layout.makeFillRowLayout();

// left view
const left = new LeftView();
left.layoutMethod = MakeLeftViewLayout();

left.addChild(new ToolBar(model));
left.addChild(new ShapeList(model));
left.addChild(new StatusBar(model));


root.addChild(left);
// right view
root.addChild(new RightView(model));


setSKRoot(root);

startSimpleKit();
