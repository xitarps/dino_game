//helpers
const $ = selector => document.querySelector(selector);
const log = message => console.log(message);

//views properties
const height = document.body.clientHeight;
const width = document.body.clientWidth;

//game settings
const jumpHeight = 35
const cactus_speed = 7
const dinoHopArray = calcJump(jumpHeight);
const message = $('#message')
const messageScreen = $('.notice')

//score
let score = 0;
let inGame = true;

//get dino div
const dino = $('.dino');
const background = $('.background');

//set initial y position dino
dino.style.bottom = '0px';

//set initial x position background
background.style.backgroundPositionX = '0px'

//divs size
const divSize = dino.offsetWidth;


//fire/jump when spacebar(32) get up or clicked
const handleKeyUp = e => (e.keyCode == 32)? jump(dinoHopArray) : false ;
const handleClick = e => jump(dinoHopArray);


//add eventListener to key up and click
document.addEventListener('keyup', handleKeyUp);
background.addEventListener('click', handleClick);

//set jump sound
let dino_hop = document.getElementById("dino_hop");
let sound_is_playing = false


//        ++++GAME++++
window.onload = () => {
  setMessageListener();
  movefundo();
  start();
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
    if(!sound_is_playing){sound_is_playing= true; dino_hop.play()};
    if(dinoPloter.next().done == true){
      clearInterval(jumpInterval);
      jumpInterval = null;
      sound_is_playing= false;
      dino_hop.currentTime = 0;
    }

  }, 20);
  
}

//Generator - blocks spacebar while on animation and move dino
function* plotDino(arr){
  document.removeEventListener('keyup', handleKeyUp);
  background.removeEventListener('click', handleClick);
  for (let i = 0; i < arr.length; i++) {
    moveDino(arr[i]);
    yield
  }
  document.addEventListener('keyup', handleKeyUp);
  background.addEventListener('click', handleClick);
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

    if(!inGame){background.removeChild(cactus); clearInterval(moveLeft);  position=1000; endGame(); return ;}
    if(cactusX <= (0-divSize)){
      background.removeChild(cactus)
      clearInterval(moveLeft);
      score++;
    }else{
      cactus.style.right = position+'px';
      position+=speed;
      checkColision(cactus);
    }
  }, 20);
  
  if(inGame)autoCallCactus(speed);
}

//call new cactus
function autoCallCactus(tmp_speed){
  setTimeout(() => {
    if(inGame)createCactus(tmp_speed);
  }, generateRandom());
}

//generate random number
function generateRandom(){
  return (Math.random() * 1400) + 700
}

//check if dino hits cactus
function checkColision(cactus){
  const dinoY = dino.style.bottom.split('px')[0]
  const cactusX = cactus.offsetLeft;
  
  if(cactusX <= divSize && cactusX >= -divSize && dinoY<= divSize){
    //log(true)
    inGame = false;
  }else{
    //log(false);
  }
}

//start the game
function start(){
  autoCallCactus(cactus_speed);
}

//message div listen to click so be able to restart
function setMessageListener(){
  messageScreen.addEventListener('click',(e)=>{
    messageScreen.classList.add('invisible');
    background.classList.remove('invisible')
    
    //timeout prevent bug(many cactus together)
    setTimeout(() => {
      restartGame();
    }, 1000);
  })
}

//datails the end screnn and behavior
function endGame(){
  message.innerHTML = '';
  const h2 = document.createElement('h2');
  const h3 = document.createElement('h3');
  h2.innerHTML = `Seu Score: ${score}`;
  h2.style.textAlign = 'center';
  h3.innerHTML = `Clique recomeçar.`;
  message.appendChild(h2);
  message.appendChild(h3);
  messageScreen.classList.remove('invisible');
  background.classList.add('invisible')
}

//reset variables and call start all over again
function restartGame(){
  score = 0;
  start();
  inGame = true;
}


function movefundo() {
  setInterval(() => {
    let esquerda = parseInt(background.style.backgroundPositionX.split('px')[0]);
    background.style.backgroundPositionX = (esquerda -cactus_speed)+'px';
  }, 20);
}

