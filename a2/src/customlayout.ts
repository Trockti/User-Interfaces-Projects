import {  
    SKElement,
    LayoutMethod, 
    Size
} from "simplekit/imperative-mode";

export function MakeLeftViewLayout(
  ): LayoutMethod {
    return (
      boundsWidth: number,
      boundsHeight: number,
      elements: SKElement[]
    ) => {
      return LeftViewLayout(boundsWidth, boundsHeight, elements);
    };
  }

  function LeftViewLayout(
    boundsWidth: number,
    boundsHeight: number,
    elements: SKElement[]
  ): Size {
    // set the element position depending on the element id
    const newBounds: Size = { width: 0, height: 0 };
    elements.forEach((element) => {
        if (element.fillWidth) element.widthLayout = boundsWidth;
        if (element.fillHeight) element.heightLayout = boundsHeight;
        if (element.id === "toolbar") {
          element.x = 0;
          element.y = 0;
          element.fillWidth = 1;
          element.height = 50;
          }
        if (element.id === "statusbar") {
          element.x = 0;
          element.y = boundsHeight - 50;
          element.fillWidth = 1;
          element.height = 50;
        }
        if (element.id === "shape list") {
            element.x = 0;
            element.y = 50;

          }

      newBounds.width = Math.max(newBounds.width, element.widthLayout);
      newBounds.height = Math.max(newBounds.height, element.heightLayout);
    });
    return newBounds;
  }