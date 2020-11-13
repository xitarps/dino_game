//helpers
const $ = (selector) => document.querySelector(selector);
const log = (message) => console.log(message);

//get dino div
const dino = $('.dino');

//fire when spacebar(32) get up
const handleKeyUp = (e) => {
  if (e.keyCode == 32){
    log('apertou barra de espaço');
  }
};

//add eventListener to key up
document.addEventListener('keyup', handleKeyUp);

