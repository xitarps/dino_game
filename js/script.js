//helpers
const $ = selector => document.querySelector(selector);
const log = message => console.log(message);


const jumpHeight = 28
const dinoHopArray = calcJump(jumpHeight);


//get dino div
const dino = $('.dino');

//fire when spacebar(32) get up
const handleKeyUp = e => (e.keyCode == 32)? jump(dinoHopArray) : false ;

//add eventListener to key up
document.addEventListener('keyup', handleKeyUp);


//return jump array of y positions ex: [0,4,7,8,7,4,0]
function calcJump(tmp_height){

  let distance = tmp_height;

  let a = 1;
  let b = -1*distance;
  let c = 0;

  let x = 0;
  let y = 0;

  let jumpPath = []

  for (let i = 0; i <= distance; i++, x++) {
    
    // f(x) = ax² + bx + c
    y = -( (a*(x**2)) + (b*x) + c);

    //     Behavior Jump target:
    //
    //   y  ^
    //      |
    //      |         .
    //      |     .       .
    //      |   .           .
    //      |  .             .
    //      | .               .
    //      -------------------->
    //    0                     x
    //
    //log('y: '+ y)



    jumpPath.push(y)
  }
  return jumpPath
}

//render jump using array of y positions
const jump = (arr) => {
  
  //set Generator
  let dinoPloter = plotDino(arr);

  //frame change every 20ms
  let jumpInterval = setInterval(() => {

    if(dinoPloter.next().done == true){
      clearInterval(jumpInterval);
      jumpInterval = null;
    }

  }, 20);
  
}

//Generator - blocks spacebar while on animation and move dino
function* plotDino(arr){
  document.removeEventListener('keyup', handleKeyUp);
  for (let i = 0; i < arr.length; i++) {
    moveDino(arr[i]);
    yield
  }
  document.addEventListener('keyup', handleKeyUp);
}

//change dino y position CSS
let moveDino = value => dino.style.bottom = value+'px';
