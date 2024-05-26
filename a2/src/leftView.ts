import {
  SKContainer,
} from "simplekit/imperative-mode";

export class LeftView extends SKContainer  {
  //Left view of the application



  constructor() {
    super();

    // setup the view
    this.id = "left";
    this.fill = "white";
    this.border = "grey";
    this.fillWidth = 2/3;
    this.fillHeight = 1;

  }
}
