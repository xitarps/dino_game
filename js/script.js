//helpers
const $ = selector => document.querySelector(selector);
const log = message => console.log(message);

//views properties
const height = document.body.clientHeight;
const width = document.body.clientWidth;

const jumpHeight = 35
const dinoHopArray = calcJump(jumpHeight);


//get dino div
const dino = $('.dino');
const background = $('.background');

//set initial y position dino
dino.style.bottom = '0px';

//divs size
const divSize = dino.offsetWidth;

//cactus speed
const cactus_speed = 7

//fire when spacebar(32) get up
const handleKeyUp = e => (e.keyCode == 32)? jump(dinoHopArray) : false ;

//add eventListener to key up
document.addEventListener('keyup', handleKeyUp);





//        ++++GAME++++
window.onload = () => {
  autoCallCactus(cactus_speed)
}





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
    
    // https://www.mathsisfun.com/data/grapher-equation.html
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


//generate cactus
function createCactus(speed){
  const cactus = document.createElement('div');
  cactus.classList.add('cactus')

  background.appendChild(cactus)

  let position = 0;

  let moveLeft = setInterval(() => {
    let cactusX = cactus.offsetLeft;
    if(cactusX <= (0-divSize)){
      background.removeChild(cactus)
      clearInterval(moveLeft);
    }else{
      cactus.style.right = position+'px';
      position+=speed;
      checkColision(cactus);
    }
  }, 20);
  
  autoCallCactus(speed)
}

function autoCallCactus(tmp_speed){
  setTimeout(() => {
    createCactus(tmp_speed);
  }, generateRandom());
}

function generateRandom(){
  return (Math.random() * 1400) + 700
}

function checkColision(cactus){
  const dinoY = dino.style.bottom.split('px')[0]
  const cactusX = cactus.offsetLeft;
  
  if(cactusX <= divSize && cactusX >= -divSize && dinoY<= divSize){
    //log(true)
  }else{
    //log(false);
  }
}

