// Define the shape type and its attributes.

export type Shape = {
    id: string;
    hue: number;
    hover: boolean;
    clicked: boolean;
    attributes: SquareATTR | StarATTR | BullsEyeATTR | CatATTR;
  };
  
  export type SquareATTR = {
    type: "square";
  };
  
  export type StarATTR = {
    type: "star";
    spikes: number;
    outerRadius: number;
  };
  
  export type BullsEyeATTR = {
    type: "bullseye";
    rings: number;
    hue2: number;
  };
  
  export type CatATTR = {
    type: "cat";
    eyeDirection: string;

  };