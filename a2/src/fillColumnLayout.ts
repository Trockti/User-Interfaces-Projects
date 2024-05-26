import { SKElement, LayoutMethod, Size  } from "simplekit/imperative-mode";


type FillLayoutProps = {
  gap?: number;
};

export function makeFillColumnLayout(
  props?: FillLayoutProps
): LayoutMethod {
  return (
    boundsWidth: number,
    boundsHeight: number,
    elements: SKElement[]
  ) => {
    return fillColumnLayout(boundsWidth, boundsHeight, elements, props);
  };
}

function fillColumnLayout(
  boundsWidth: number,
  boundsHeight: number,
  elements: SKElement[],
  { gap = 0 }: FillLayoutProps = {}
): Size {
  //Function similar to fillRowLayout, but for columns
  const newBounds: Size = { width: 0, height: 0 };

  // get total "basis" height
  const basisTotal = elements.reduce(
    (acc, el) => acc + el.heightBasis,
    0
  );

  // calculate remaining space to distribute elements
  const available = boundsHeight - (elements.length - 1) * gap;
  const remaining = available - basisTotal;


  if (remaining < 0) {
    console.warn(
      `fillRowLayout: not enough space (container:${boundsHeight} < children:${basisTotal}) `
    );
  }

  // get total fill proportion
  const fillTotal = elements.reduce(
    (acc, el) => acc + el.fillHeight,
    0
  );

  // first element starts at top left
  let x = 0;
  let y = 0;
  let rowWidth = 0;

  elements.forEach((el) => {
    // set element position
    el.x =  0;
    el.y = y;

    // calculate element size
    let w = el.heightBasis;
    // expand or shrink element if fillHeigth > 0
    if (fillTotal > 0) {
      w += (el.fillHeight / fillTotal) * remaining;
    }
    // set element size
    el.heightLayout = w;

    // elements can expand horizontally too
    if (el.fillWidth > 0) {
      el.widthLayout = boundsWidth;
    }
    // update row width
    rowWidth = Math.max(rowWidth, el.widthLayout);
    // ready for next y position
    y += w + gap;
  });

  // calculate bounds used for layout
  const lastEl = elements.slice(-1)[0];
  newBounds.width = lastEl.y + lastEl.heightLayout;
  newBounds.height = rowWidth;


  return newBounds;
}
