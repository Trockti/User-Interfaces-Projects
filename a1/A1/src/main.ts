import { Card } from "./card";
import { Cat } from "./cat";
import { Star } from "./star";
import { Bullseye } from "./bullseye";

import { DisplayCards } from "./displaylist";
import { Shape } from "./shape";
import {
  SKKeyboardEvent,
  SKMouseEvent,
  addSKEventTranslator,
  setSKDrawCallback,
  setSKEventListener,
  setSKAnimationCallback,
  startSimpleKit,
  SKResizeEvent,
  FundamentalEvent,
  skTime
} from "simplekit/canvas-mode";
import { distance,  
  closestPoint,
  point
} from "simplekit/utility";
import {
  Animator
} from "./animator";
import {animationManager} from "./animationManager";




// mouse position
let mx = 0;
let my = 0;
//Storage for intermediate figures
let storefigure : (Cat|Star|Bullseye)[] = [];
//Indidcators for the game
let startgame = 0;
let pairs = 1;
let displaylist = new DisplayCards();
let width = 0;
let height = 0;
let cards_left = 2*pairs;
let revealed = -1;
let wingame = 0;
let suffle = 0;
let cards_right = 0;
let offset_pairs = 0;
//variables for the card layout
let offset_x = 0;
let offset_y = 0;
let k = 0
let card_index = 0;
let row_length = 0;
let offset_title = 0;
//variables for the cheat mode
let cheat = 0;
let cheat_list: number[] = []
//variables for the gesture
let startime = 0;
let gesture = 0;
//variable for the animation
let animate = 0;
//Variables to store the figures for adding/removing pairs
let figures  = [new Cat(0, 0, 0.7, 1), new Cat(0, 0, 0.7, 2), new Cat(0, 0, 0.7, 3),
  new Cat(0, 0, 0.7, 4), new Cat(0, 0, 0.7, 5), new Star(0, 0, 0.2, 1),  new Star(0, 0, 0.2, 2),
  new Star(0, 0, 0.2, 3), new Star(0, 0, 0.2, 4), new Star(0, 0, 0.2, 5), new Bullseye(0, 0, 0.4, 1),
  new Bullseye(0, 0, 0.4, 2), new Bullseye(0, 0, 0.4, 3), new Bullseye(0, 0, 0.4, 4), new Bullseye(0, 0, 0.4, 5)];

let figures_left = [new Cat(0, 0, 0.7, 1), new Cat(0, 0, 0.7, 2), new Cat(0, 0, 0.7, 3),
  new Cat(0, 0, 0.7, 4), new Cat(0, 0, 0.7, 5), new Star(0, 0, 0.2, 1),  new Star(0, 0, 0.2, 2),
  new Star(0, 0, 0.2, 3), new Star(0, 0, 0.2, 4), new Star(0, 0, 0.2, 5), new Bullseye(0, 0, 0.4, 1),
  new Bullseye(0, 0, 0.4, 2), new Bullseye(0, 0, 0.4, 3), new Bullseye(0, 0, 0.4, 4), new Bullseye(0, 0, 0.4, 5)];
// event handler with switch statement dispatch

setSKAnimationCallback((timeStamp) => {
  animationManager.update(timeStamp);
  //console.log("timeStamp", timeStamp);
});


// set the event handler
setSKEventListener((e) => {
  //mouse events
  switch (e.type) {
    //Gesture end event
    case "gestureend":
       ({ x: mx, y: my } = e as SKMouseEvent);
      
      displaylist.list.forEach((s) => {
        if ((s instanceof Shape) && startgame == 1){
          if (s.hitTest(mx, my) && s.reveal == 0 && s.gesture == 0 && gesture == 0) {
            //If the card is not revealed and the gesture is not started, start the gesture
            s.reveal = 1;
            s.gesture = 1;
            startime = e.timeStamp;
            cards_left -= 1;
            gesture = 1;
          }
          
        }
      });
      break;
    case "gesturestart":
      ({ x: mx, y: my } = e as SKMouseEvent);
      
    displaylist.list.forEach((s) => {
      if ((s instanceof Shape) && startgame == 1){
        if (s.hitTest(mx, my) && s.reveal == 0 && s.gesture == 0 && gesture == 1) {
          startime = e.timeStamp;
        }
          
      }
    });
    break;

    case "mousemove":
      ({ x: mx, y: my } = e as SKMouseEvent);
      //If the mouse is over a card, a thick yellow "hover" outline appears just outside the card 
      displaylist.list.forEach((s) => {
        if ((s instanceof Shape) && startgame == 1){
          if (s.hitTest(mx, my)) {
            if (s.isFilled) s.fill = "white";
            if (s.isStroked) s.stroke = "yellow";
          } else {
            if (s.isFilled) s.fill = "white";
            if (s.isStroked) s.stroke = "black";
          }
        }
      });
      break;
    //Resize event
    case "resize":
      const re = e as SKResizeEvent;
      width = re.width;
      height = re.height;      
      offset_title = height/2;
      animate = 0;
      break;
      //Key press events
      case "keydown":
      const { key } = e as SKKeyboardEvent;
      //If the space key is pressed, the game starts, or the game is reseted
      if (key == " ") {
        //Start the game
        if (wingame == 0 && startgame == 0) {
          suffle = 1;
          animate = 0;
        }
        //Reset the game
        if (wingame == 1) {
          wingame = 0;
          startgame = 0;
          displaylist.list.length = 0;
          pairs += 1;
          cards_left = 2*pairs;
          cards_right = 0;
          
          cardDraw(pairs);
          displayanimation();
        }
        else {
        startgame = 1;
        }
        //If the game is started, the cards are shuffled
        if (suffle == 1) {
          shuffleArray(displaylist.list);

          for (let i = 0; i < 2*pairs; i++) {
            displaylist.list[i].reveal = 0;
            displaylist.list[i].start = 1;

          }
          suffle = 0;
        }
        
      }
      //If the q key is pressed, the game is reseted
      if (key == "q") {
        startgame = 0;
        for (let i = 0; i < 2*pairs; i++) {
          displaylist.list[i].reveal = 1;
          displaylist.list[i].match = 0;

        }
        cards_left = 2*pairs;
        cards_right = 0;
      }
      //If the + key is pressed, a pair is added to the game
      if (key == "+" && startgame == 0 && figures_left.length > 0 && wingame == 0) {
        animate = 0;
        pairs += 1;
        cards_left = 2*pairs;
        k = Math.floor(Math.random() * figures_left.length);
        //Add the pair to the game randomly from the figures left
        for (let i = 0; i < 2; i++) {
          displaylist.add(new Card(0, 0, 1, 0, figures_left[k]));
        }
        //The pair is removed from the figures left
        figures_left.splice(k, 1)
      }
      //If the - key is pressed, a pair is removed from the game
      if (key == "-" && startgame == 0 && wingame == 0) {
        animate = 0;
        if (displaylist.list.length >= 2 ) {
          //If possible, a pair is removed from the game, and the figure is added to the figures left
          k = Math.floor(Math.random() * displaylist.list.length);
          figures_left.push(displaylist.list[k].figure);
          //Depending on the position of the pair in the list, the pair is removed
          if (k%2 == 0) {
            displaylist.list.splice(k, 2);
          }
          else {
            displaylist.list.splice(k-1, 2);
          }
          pairs -= 1;
          cards_left = 2*pairs;
        }
      }
      //If the x key is pressed, the cheat mode is activated
      if (key == "x" && startgame == 1 && wingame == 0) {
        cheat = 1;
      }
      
      break;
    case "click":
      //If a card is clicked,  and the card is revealed, the card is hidden, if possible
      displaylist.list.forEach((s) => {
        if ((s instanceof Shape) && startgame == 1 && cheat == 0){
          if (s.hitTest(mx, my)) {
            if(s.reveal == 1 && s.match == 0) {
              s.reveal = 0;
              cards_right -= 1;
              cards_left += 1;
            }
            //If the card is not revealed, and the gesture is not started, the card is revealed
            else if (cards_right < 2) {
              if (s.reveal == 0) {
                s.reveal = 1;
                revealed = displaylist.list.indexOf(s);
                cards_right += 1;
                cards_left -= 1;
              }
            }
            
          }
        }
      });
      break; 
      case "keyup":
      //If the x key is released, the cheat mode is deactivated
      const { key: key2 } = e as SKKeyboardEvent;
      if (key2 == "x" && startgame == 1 && wingame == 0) {
        cheat = 0;
      }
      break;
    }
});
startSimpleKit();
//Initial the game with one pair
cardDraw(pairs);
setSKDrawCallback((gc) => {
  //Generate the background
  row_length = 2*pairs;
  gc.clearRect(0, 0, width, height);
  gc.fillStyle = "darkgrey";
  gc.fillRect(0, 0, width, height);
  //If the game is not started, the start screen is displayed
  if (startgame == 0 && wingame == 0) {
    cards_left = 2*pairs;

    start(gc, pairs);
    
}
    //If an animation is running, the cards are animated, and their state changed
    if (animate == 1) {
      for (let i = 0; i < 2*pairs; i++) {
        displaylist.list[i].x = displaylist.list[i].imagex;
        displaylist.list[i].y = displaylist.list[i].imagey;
      }
    }
    else {
      if(width > 200){
      //Calculate the coordinates of the cards
      calculateCoordinates();
      }
      else{
        offset_y = height/2;
        for (let i = 0; i < 2*pairs; i++) {
          
          displaylist.list[i].x = width / 2;
          displaylist.list[i].y = offset_y
          offset_y += 90;
        }
      }
      //If the cards y position is too low, move them up
      while (displaylist.list[displaylist.list.length - 1].y > height - 90 && displaylist.list[0].y > height / 10 + 150) {
        for (let i = 0; i < 2 * pairs; i++) {
            displaylist.list[i].y -= 90;
        }
  }
    }
    if (cheat == 0) {
      //If the cheat mode is deactivated, the state of the cards goes back to normal
      if (cheat_list.length > 0) {
        for (let i = 0; i < 2*pairs; i++) {
          displaylist.list[i].reveal = cheat_list[i];
        }
        cheat_list.length = 0;
      }
      //Change the state of the cards
      ChangeCardState();
    }
    else {
      //If the cheat mode is activated, the state of the cards is changed to reveal all cards
      for (let i = 0; i < 2*pairs; i++) {
       
          cheat_list.push(displaylist.list[i].reveal);
          displaylist.list[i].reveal = 1;
      }
    }
    //Activate the win screen if the game is won
    if (cards_left == 0 || wingame == 1) {
      for (let i = 0; i < 2*pairs; i++) {
        //If the game is won, the cards are animated
        if(cards_left == 0 && displaylist.list[i].match == 0) {
          animationManager.add(new Animator(0, Math.PI*2, 400, (p) => {
            displaylist.list[i].rotation = p;
          }));
        }
        //reset the variables
        displaylist.list[i].reveal = 0;
        displaylist.list[i].start = 0;
        displaylist.list[i].match = 0;
        displaylist.list[i].stroke = "black";
        displaylist.list[i].y = displaylist.list[i].y + 10*Math.sin(0.01*(skTime) + i);
        startgame = 0;
        revealed = -1;
        wingame = 1;
        win(gc);

      }
      //Used to let the animation finish
      cards_left = -1;
    }
  
  
  DrawList(gc);
  //Reset the offset used for the card layout
  offset_x = 0;
  offset_pairs = 0;
  offset_y = 0;
  card_index = 0;

  
});




function ChangeCardState() {
  for (let i = 0; i < 2 * pairs; i++) {
    //Save the position of the cards
    displaylist.list[i].imagey = displaylist.list[i].y;
    //Check gesture timeoout
    if (displaylist.list[i].reveal == 1 && displaylist.list[i].gesture == 1 && skTime - startime > 500) {
      displaylist.list[i].reveal = 0;
      displaylist.list[i].gesture = 0;
      gesture = 0;
      cards_left += 1;
    }
    //If there is a revealed card, and the gesture is not started, check for a match
    if (revealed != -1 && displaylist.list[i].reveal == 1 && i != revealed) {

      if (displaylist.list[i].figure == displaylist.list[revealed].figure && cards_left >= 2) {
        //Match found
        k = revealed;
        //Animate the cards
        animationManager.add(new Animator(0, Math.PI * 2, 400, (p) => {
          displaylist.list[i].rotation = p;
        }));
        animationManager.add(new Animator(0, Math.PI * 2, 400, (p) => {
          displaylist.list[k].rotation = p;
        }));
        //Update the appropriate variables
        displaylist.list[i].match = 1;
        displaylist.list[revealed].match = 1;
        revealed = -1;
        cards_right -= 2;
        break;
      }
    }

  }
  //If there is no revealed card, reset the variables
  if (revealed != -1) {
    if (displaylist.list[revealed].reveal == 0) {
      revealed = -1;
    }
  }
}

function displayanimation() {
  //Animation of shuffling the cards
  offset_x = 0;
  offset_pairs = 0;
  offset_y = 0;
  card_index = 0;
  row_length = 2 * pairs;
  calculateCoordinates();
  for (let i = 0; i < 2 * pairs; i++) {
    displaylist.list[i].imagex = 0;
    displaylist.list[i].imagex = 0;
    animationManager.add(new Animator(width / 2, displaylist.list[i].x, 300, (p) => {
      displaylist.list[i].imagex = p;
    }));
    animationManager.add(new Animator(height / 2, displaylist.list[i].y, 300, (p) => {
      displaylist.list[i].imagey = p;
    }));
  }
  animate = 1;
}

function calculateCoordinates() {
  while (card_index < 2 * pairs) {

    for (let i = 0; i < row_length; i++) {
      //If there is no space for the cards at the left, moved them to the right
      while (width / 2 - ((45) + 90 * (row_length / 2 - 1 - offset_pairs)) > 45 && offset_pairs > 0) {
        offset_pairs -= 1;
      }
      //if there is no space for the cards at the right, create a new row
      while (width / 2 + -((45) + 90 * (row_length / 2 - 1 - offset_pairs)) < 45) {
        offset_pairs += 1;
      }
      //Calculate the position of the cards
      offset_x = -((45) + 90 * (row_length / 2 - 1 - offset_pairs)) + i * 90;
      if (width / 2 + offset_x > width - 45) {
        break;
      }
      //Update the position of the cards
      displaylist.list[card_index].x = width / 2 + offset_x;

      displaylist.list[card_index].y = offset_title + offset_y;
      displaylist.list[card_index].start = startgame;
      card_index++;
      
    }
    //Calculate length of the row
    row_length = 2 * pairs - card_index;
    if (row_length == 1){
      displaylist.list[card_index].x = width / 2;
      displaylist.list[card_index].y = offset_title + offset_y + 90;
      card_index++;
    }
    //Update the offset
    offset_y += 90;


  }
}


function start(gc: CanvasRenderingContext2D, pairs: number) {
  //Display the start screen
  const x = gc.canvas.width/2;
  const y = gc.canvas.height/10;
  let p = " pairs";
  if (pairs == 1) {
    p = " pair";
  }

  gc.font = "24px sans-serif";
  gc.textAlign = "center";
  gc.fillStyle = "white";
  gc.fillText(pairs + p + ": Press SPACE to play", x, y);
}

function win (gc: CanvasRenderingContext2D) {
  //Display the win screen
  const x = gc.canvas.width/2;
  const y = gc.canvas.height/10;
  gc.font = "24px sans-serif";
  gc.textAlign = "center";
  gc.fillStyle = "white";
  gc.fillText("you finished! press SPACE to continue", x, y);
  gc.restore();
}

function cardDraw(pairs : number) {
  //Update the DisplayList with the cards to draw them
  figures_left = figures.slice();
  let x = width/2;
  let y = height/2;
  for (let i = 0; i < pairs; i++) {
    k = Math.floor(Math.random() * figures_left.length);
    displaylist.add(new Card(x, y, 1, 0, figures_left[k]));
    displaylist.add(new Card(x, y, 1, 0, figures_left[k]));
    figures_left.splice(k, 1)
    
    }

}

function DrawList(gc: CanvasRenderingContext2D) {
  displaylist.draw(gc);
}
function shuffleArray(displayList: Card[]) {// Create a copy of the original array
  
  for (let i = displayList.length - 1; i > -1; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      displayList[i].imagex = displayList[i].x;
      displayList[i].imagey = displayList[i].y;
      console.log(displayList[i].x, displayList[i].y);
      console.log(displayList[j].imagex, displayList[j].imagey);
      // Swap elements at i and j
      animationManager.add(new Animator(displayList[i].x, displayList[j].x, 300, (p) => {
        displayList[i].imagex = p;
      }));
      animationManager.add(new Animator(displayList[i].y, displayList[j].y, 300, (p) => {
        displayList[i].imagey = p;
      }));
      animationManager.add(new Animator(displayList[j].x, displayList[i].x, 300, (p) => {
        displayList[j].imagex = p;
      }));
      animationManager.add(new Animator(displayList[j].y, displayList[i].y, 300, (p) => {
        displayList[j].imagey = p;
      }));
    
      [displayList[i], displayList[j]] = [displayList[j], displayList[i]];
      storefigure.push(displayList[i].figure);
      displayList[i].figure = displayList[j].figure;
      displayList[j].figure = storefigure[0];
      storefigure.length = 0;
  }
  animate = 1;
  return displayList;
}

export const gestureTranslator = {
  state: "IDLE",
  // parameters for transitions
  movementThreshold: 50,
  // for tracking thresholds
  startX: 0,
  startY: 0,

  // returns a drag event if found
  update(fe: FundamentalEvent): SKMouseEvent | undefined {
    switch (this.state) {
      case "IDLE":
        if (fe.type == "mousedown") {
          this.state = "DOWN";
          this.startX = fe.x || 0;
          this.startY = fe.y || 0;
        }
        break;

      case "DOWN":
        if (fe.type == "mouseup") {
          this.state = "IDLE";
        } else if (
          fe.type == "mousemove" &&
          fe.x &&
          fe.y &&
          distance(fe.x, fe.y, this.startX, this.startY) >
            this.movementThreshold
        ) {
          // drag detected only if mouse moved upwards
          const m = point(mx, my);
          const q = closestPoint(m, point(this.startX, this.startY), point(fe.x, 0));
          const d = distance(m.x, m.y, q.x, q.y);
          if (d <= 10 / 2){
          this.state = "GESTURE";
          return {
            type: "gesturestart",
            timeStamp: fe.timeStamp,
            x: fe.x,
            y: fe.y,
          } as SKMouseEvent;
        }
      }
        break;

      case "GESTURE":
        if (fe.type == "mousemove") {
          return {
            type: "gesture",
            timeStamp: fe.timeStamp,
            x: fe.x,
            y: fe.y,
          } as SKMouseEvent;
        } else if (fe.type == "mouseup") {
          // gesture ended
          this.state = "IDLE";
          return {
            type: "gestureend",
            timeStamp: fe.timeStamp,
            x: fe.x,
            y: fe.y,
          } as SKMouseEvent;
        }

        break;
    }
    return;
  },
};



addSKEventTranslator(gestureTranslator);


