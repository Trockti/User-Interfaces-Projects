import {
  SKContainer,
  SKLabel,
  Layout,
  SKTextfield
} from "simplekit/imperative-mode";
import { SKSquare } from "./SKSquare";
import { SKStar } from "./SKStar";
// local imports
import { Observer } from "./observer";
import { Model } from "./model";
import { makeFillColumnLayout } from "./fillColumnLayout";
import { makeStackColLayout } from "./stackCol";
import {  makeExpandLayout } from "./expand";

function makeSKlaber(text: string) {
  let label = new SKLabel({ text: text });
  label.height = 30;
  label.width = 70;
  return label;
}

function makeSKTextfield(text: string) {
  const textfield = new SKTextfield({ text: text });
  textfield.width = 70;
  textfield.height = 30;
  return textfield;
}

function configureShape(shape: SKSquare | SKStar, id: string, hue: number) {
  shape.id = id;
  shape.updateColor(hue);
  shape.fillWidth = 1;
  shape.fillHeight = 1;
  shape.margin = 10;
  shape.border = "black";
  return shape;
}

export class RightView extends SKContainer implements Observer {
  //#region observer pattern

  update(): void {

    if (this.model.selectId != null && this.model.selected == 1) {
      // if there is a selected shape
      if (this.model.updated_value == false){
        // if the shape have just been selected
        this.layoutMethod = makeFillColumnLayout();
        this.clearChildren();
        // create the display area
        const display_area = new SKContainer();
        display_area.fillHeight = 2/3;
        display_area.fillWidth = 1;
        display_area.layoutMethod = makeExpandLayout();
        // create the form area, that contains all the Shape's properties that you can change
        const form = new SKContainer();
        form.fillWidth = 1;
        form.fillHeight = 1/3;
        form.border = "grey";

        form.layoutMethod = makeStackColLayout();

        // create the box that contains the hue property
        const box = new SKContainer();
        box.width = 200;
        box.height = 70;
        box.padding = 20;

        box.layoutMethod = Layout.makeFillRowLayout();
        const HUE = makeSKlaber("Hue");

        box.addChild(HUE);
        this.model.all().forEach((t) => {
          if (t.id == this.model.selectId) {
            // Found the selected shape
            if (t.square == true){
              // if the shape is a square, display it
              const display_shape = new SKSquare(this.model);
              configureShape(display_shape, t.id, t.hue);
              display_area.addChild(display_shape);
              // create the textfield that contains the hue value
              const SATURATION = makeSKTextfield(display_shape.hue.toString());
              // add an event listener to the textfield, so that when the value changes, the shape's color changes
              SATURATION.addEventListener("textchanged", () => {
              if (!isNaN(Number(SATURATION.text))) {
                  let hue = parseInt(SATURATION.text);
                  if (0 <= hue && hue <= 360) {
                   display_shape.updateColor(hue);
                   this.model.updatehue(display_shape.id, hue);
                  }
                }
              });
              box.addChild(SATURATION);
              form.addChild(box);
            }
            else{
              // if the shape is a star, display it
              const display_shape = new SKStar(this.model);
              configureShape(display_shape, t.id, t.hue);
              display_shape.updateOuterRadius(t.outerRadius);
              display_shape.updateSpikes(t.spikes);
              display_area.addChild(display_shape);
              // create the textfield that contains the hue value
              const SATURATION = makeSKTextfield(display_shape.hue.toString());
              SATURATION.addEventListener("textchanged", () => {
              if (!isNaN(Number(SATURATION.text))) {
                  let hue = parseInt(SATURATION.text);
                  if (0 <= hue && hue <= 360) {
                   display_shape.updateColor(hue);
                   this.model.updatehue(display_shape.id, hue);
                  }
                }
              });
              box.addChild(SATURATION);
              form.addChild(box);
              // create the box that contains the outerRadius property
              const box2 = new SKContainer();
              box2.width = 300;
              box2.height = 50;
              box2.layoutMethod = Layout.makeFillRowLayout();
              const OUTER_RADIUS = makeSKlaber("Radius");
              box2.addChild(OUTER_RADIUS);
              const OUTER_RADIUS_TEXT = makeSKTextfield(display_shape.outerRadius.toString());
              // add an event listener to the textfield, so that when the value changes, the shape's outerRadius changes
              OUTER_RADIUS_TEXT.addEventListener("textchanged", () => {
                if (!isNaN(Number(OUTER_RADIUS_TEXT.text))) {
                  let outerRadius = parseInt(OUTER_RADIUS_TEXT.text);
                  if (20 <= outerRadius && outerRadius <= 45) {
                    display_shape.updateOuterRadius(outerRadius);
                    this.model.updateOuterRadius(display_shape.id, outerRadius);
                  }
                }
              });
              box2.addChild(OUTER_RADIUS);
              box2.addChild(OUTER_RADIUS_TEXT);
              form.addChild(box2);
              // create the box that contains the spikes property
              const box3 = new SKContainer();
              box3.width = 300;
              box3.height = 50;
              box3.layoutMethod = Layout.makeFillRowLayout();
              const SPIKES = makeSKlaber("Spikes");

              box3.addChild(SPIKES);
              const SPIKES_TEXT = makeSKTextfield(display_shape.spikes.toString());
              // add an event listener to the textfield, so that when the value changes, the shape's spikes changes
              SPIKES_TEXT.addEventListener("textchanged", () => {
                if (!isNaN(Number(SPIKES_TEXT.text))) {
                  let spikes = parseInt(SPIKES_TEXT.text);
                  if (3 <= spikes && spikes <= 10) {
                    display_shape.updateSpikes(spikes);
                    this.model.updateSpikes(display_shape.id, spikes);
                  }
                }

            });
            box3.addChild(SPIKES);
            box3.addChild(SPIKES_TEXT);
            form.addChild(box3);
          }
        }
      });
      // add the display area and the form area to the right view
        this.addChild(display_area);
        this.addChild(form);
      }

    }
    // if there are too many shapes selected
    else if(this.model.selected > 1){
      this.layoutMethod = Layout.makeCentredLayout();
      this.clearChildren();
      this.addChild(this.text_too_many);
    }
    // if there is no shape selected
    else{
      this.layoutMethod = Layout.makeCentredLayout();
      this.clearChildren();
      this.addChild(this.text_one_selected);
    }
  }

  text_too_many = new SKLabel({ text: "Too Many Selected" });
  text_one_selected = new SKLabel({ text: "Select One" });
  //#endregion

  constructor(private model: Model) {
    super();

    // setup the view
    this.id = "right";
    this.fill = "whitesmoke";
    this.border = "grey";
    this.margin = 10;
    this.padding = 10;
    this.fillWidth = 1/3;
    this.fillHeight = 1;
    this.layoutMethod = makeFillColumnLayout();



    // register with the model when we're ready
    this.model.addObserver(this);
  }
}
