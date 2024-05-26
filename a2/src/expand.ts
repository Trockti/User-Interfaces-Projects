import { SKElement,  LayoutMethod, Size } from "simplekit/imperative-mode";


export function makeExpandLayout(): LayoutMethod {
  return (
    boundsWidth: number,
    boundsHeight: number,
    elements: SKElement[]
  ) => {
    return ExpandLayout(boundsWidth, boundsHeight, elements);
  };
}

export function ExpandLayout(
  boundsWidth: number,
  boundsHeight: number,
  elements: SKElement[]
): Size {
  const newBounds: Size = { width: 0, height: 0 };

  // stacks all children in the centre of the container
  elements.forEach((el) => {
    // elements can fill the width or height of the parent
    if (el.fillWidth) el.widthLayout = boundsWidth;
    if (el.fillHeight) el.heightLayout = boundsHeight;
    // Because we are working we squares, we equalize the width and height, using the lowest value
    if (el.widthLayout  < el.heightLayout) {
      el.heightLayout = el.widthLayout;
    }
    if (el.heightLayout < el.widthLayout) {
      el.widthLayout = el.heightLayout;
    }

    // centre element
    el.x = boundsWidth / 2 - el.widthLayout / 2;
    el.y = boundsHeight / 2 - el.heightLayout / 2;


    // update bounds that were actually used
    // note, we ignore margins for fixed layout
    newBounds.width = Math.max(newBounds.width, el.widthLayout);
    newBounds.height = Math.max(newBounds.height, el.heightLayout);
  });

  return newBounds;
}
