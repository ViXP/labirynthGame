"use strict";

document.addEventListener('DOMContentLoaded', ()=> {
  //=require classes/*.js

  const stages = {
    1: [
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '], 
    [' ','*','*','*','*','*','*','*','*','*',' ','*','*','*','*','*','*','*','*','*',' '], 
    [' ','*',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','*',' '],
    [' ','*',' ',' ','*','*','*',' ',' ','*',' ','*',' ',' ','*','*','*',' ',' ','*',' '],
    [' ','*',' ','*',' ',' ',' ','*',' ','*',' ','*',' ','*',' ',' ',' ','*',' ','*',' '],
    [' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' '],
    [' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' '],
    [' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' '],
    [' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' '],
    [' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' '],
    [' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' '],
    [' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' ','*',' '],
    [' ','*',' ','*',' ',' ',' ','*',' ','*',' ','*',' ','*',' ',' ',' ','*',' ','*',' '],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '], 
    [' ','*','*','*','*','*','*','*','*',' ','G',' ','*','*','*','*','*','*','*','*',' '], 
    [' ','*',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','*',' '],
    [' ','*',' ','*','*',' ','*','*',' ','*',' ','*',' ','*','*',' ','*','*',' ','*',' '],
    [' ','*',' ','*',' ',' ',' ','*',' ','*',' ','*',' ','*',' ',' ',' ','*',' ','*',' '],
    [' ','*',' ',' ',' ','*',' ',' ',' ','*',' ','*',' ',' ',' ','*',' ',' ',' ','*',' '],
    [' ','*','*','*','*','*','*','*','*','*',' ','*','*','*','*','*','*','*','*','*',' '], 
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ']
    ]
  };

  function Menu(code, cssClass, parentEl, numb) {
    const menu = document.createElement('section');
    menu.innerHTML = code;
    menu.classList.add('menu-' + cssClass);
    parentEl.appendChild(menu);

    // Event listeners
    if (parentEl.querySelector('button.play')) {
      parentEl.querySelector('button.play').addEventListener('click', (e) => { buttonClick(e, 1) });
    }
    if (parentEl.querySelector('button.replay')) {
      parentEl.querySelector('button.replay').addEventListener('click', (e) => { buttonClick(e, numb) });
    }
    if (parentEl.querySelector('button.next')) {
      parentEl.querySelector('button.next').addEventListener('click', (e) => { buttonClick(e, numb + 1) });
    }
    
    function buttonClick(event, num) {
      event.preventDefault();
      parentEl.removeChild(menu);
      event.target.removeEventListener('click', event);
      Play(num);
    }

    function Play(levelNum) {
      document.removeEventListener('keydown', new Handlers().get('pause'));
      new Stage(new Map(parentEl, stages[levelNum]), levelNum);
    }
  }


  Menu('<p>Start game</p><button class="play">PLAY</button>', 'new_game', document.getElementById('map'));
});