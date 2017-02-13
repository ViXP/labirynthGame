"use strict";

document.addEventListener('DOMContentLoaded', ()=> {
  class Cell {
    constructor(row, x, y) {
      // DOM manipulations
      const newCell = document.createElement('div');
      newCell.classList.add('cell');
      row.appendChild(newCell);
  
      // Public properties
      this.node = row.lastElementChild;
      this.X = x;
      this.Y = y;
  
      this.setStatus();
    }
  
    get status() {
      return this._status;
    }
  
    setStatus() {
      throw new Error("Abstract method must be overriden by the child class!");
    }
  }
    class Character {
    constructor(map, type, startCell) {
      // DOM manipulations
      map.node.appendChild(document.createElement('div'));   
  
      // Public properties      
      this.node = map.node.lastElementChild;
      this.curX = startCell.X;
      this.curY = startCell.Y;
      this.speed = 0;
      this.setState('stop');
  
      this._setCss(type);
  
      this.copyPosition(startCell.node);
    }
  
    get state() {
      return this._state;
    }
  
    _setCss(cls) {
      if (this.node.classList.length == 0) {        
        this.cssClass = cls;
        this.node.className = cls;
      }
    }
  
    copyPosition(nodeToCopy) {
      this.node.style.left = nodeToCopy.offsetLeft + 'px';
      this.node.style.top = nodeToCopy.offsetTop + 'px';
    }
  
    setState(state) {
      this._state = state; 
      switch(this._state) {
        case 'move-right':
          this.node.className = this.cssClass + ' move right';
          break;
        case 'move-left':
          this.node.className = this.cssClass + ' move left';
          break;
        case 'move-up':
          this.node.className = this.cssClass + ' move up';
          break;
        case 'move-down':
          this.node.className = this.cssClass + ' move down';
          break;
        default: 
          this.node.classList.remove('move');
          break
      }
    }
  }
    class Counter {
    constructor(quantity, domEl, cssClass) {
      // DOM manipulation
      const counter = document.createElement('div');
      counter.classList.add('counter');
      counter.classList.add(cssClass);
      domEl.appendChild(counter);
  
      // Public properties
      this.node = domEl.lastElementChild;
      this.counter = quantity || 0;
  
      // Private properties
      this._stopped = true;
  
      this.setStatus('started');
      this.nodeUpdate();
    }
  
    get status() {
      return this._status;
    }
  
    setStatus(state) {
      this._status = state;
    }
  
    down() {
      if (!this._frozen) {
        this.counter--;
        this.nodeUpdate();
        return true;
      }
      return false;
    }
  
    pause() {
      this._stopped = (this._stopped) ? false : true;
    }
  
    get paused() {
      return this._stopped;
    }
  
    up() {      
      if (!this._stopped) {
        this.counter++;
        this.nodeUpdate();
        return true;
      }
      return false;
    }
  
    nodeUpdate() {
      this.node.innerText = this.counter;
      if (this.counter == 0) {
        this.setStatus('ended');
      }
    }
  }
    class Map {
    constructor(domEl, mapDraw) {
      // Public properties
      this.quantity = 0;
      this.dots = 0;
      this.blocks = [];
      this.node = domEl;
  
      this._stage = mapDraw;
      
      this.rebuild();
    }
  
    rebuild() {
      this.blocks = [];
      this.node.innerHTML = '';
      const self = this;
  
      self._stage.forEach(function(line, i){        
        self.node.appendChild(document.createElement('div'));        
        const row = self.node.lastElementChild;
        row.classList.add('row');        
        line.forEach(function(state, j){
          if (!self.blocks[j]) { self.blocks[j] = [];}
          if (['*', '|', 1].includes(state)) {
            // If wall
            self.blocks[j][i] = new Wall(row, j, i);
          } else if (state == 'G') {
            // If player
            self.blocks[j][i] = new Space(row, j, i);
            self.blocks[j][i].removeDot();
            self.startElement = self.blocks[j][i];
          } else {
            // If free space
            self.blocks[j][i] = new Space(row, j, i);
            self.dots++;
          }
          self.quantity++;
        });
      });
    }
  }
    class Player extends Character {
    constructor(map, startCell){
      super(map, 'player', startCell);
      this.speed = 150;
    }
  }
    class Space extends Cell {
    get dotted() {
      return this._dotted;
    }
  
    addDot() {
      this._dotted = true;
      const el = document.createElement('div');
      el.classList.add('dot');
      this.node.appendChild(el);
    }
  
    removeDot() {
      if (this.dotted == false) {
        return false;
      }
      this._dotted = false;
      this.node.innerHTML = '';
      return true;
    }
  
    setStatus() {
      this._status = 'free';
      this.node.classList.add('free');
      this.addDot();
    }
  }
    class Stage {
    constructor(map, levelNum) {
      // Public properties
      this.map = map;
      this.node = map.node;
      this.levelNumber = levelNum;
      this._intId = 0;      
      this.player = new Player(this.map, this.map.startElement);
      this.dotsCount = new Counter(this.map.dots, this.node, 'dots');
      this.timer = new Counter(0, this.node, 'timer');
      this.steps = new Counter(0, this.node, 'steps')
      
      const self = this;
      
      // Event handlers
      this._handlers = {
        keyDown: (event) => {
          event.preventDefault();
          clearInterval(self._intId);
          switch(event.keyCode){
            case 38:
              self._intId = setInterval(self.stepUp.bind(self), self.player.speed);
              break;
            case 40:
              self._intId = setInterval(self.stepDown.bind(self), self.player.speed);
              break;
            case 37:
              self._intId = setInterval(self.stepLeft.bind(self), self.player.speed);
              break;
            case 39:            
              self._intId = setInterval(self.stepRight.bind(self), self.player.speed);
              break;
            }
        },
        
        touchStart: (event) => {
          this._touchStart = event.touches[0];
        },
        
        touchMove: (event) => {
          this._touchEnd = event.touches[0];
          clearInterval(self._intId);
  
          if (Math.abs(this._touchStart.pageX - this._touchEnd.pageX) > Math.abs(this._touchStart.pageY - this._touchEnd.pageY)) {
            //Horizontal moves
            self._intId = (this._touchStart.pageX > this._touchEnd.pageX) ? setInterval(self.stepLeft.bind(self), self.player.speed) : setInterval(self.stepRight.bind(self), self.player.speed);
          } else if ((this._touchStart.pageX - this._touchEnd.pageX) < Math.abs(this._touchStart.pageY - this._touchEnd.pageY)) {
            //Vertical moves
            self._intId = (this._touchStart.pageY > this._touchEnd.pageY) ? setInterval(self.stepUp.bind(self), self.player.speed) : setInterval(self.stepDown.bind(self), self.player.speed);
          }
        },
  
        pause: (event) => {
          event.preventDefault();
          if (event.keyCode == 27) {
            clearInterval(self._intId);        
            self._toggleControls();
            if (self.node.querySelector('section')) {
              self.node.removeChild(self.node.querySelector('section'));
            } else {
              Menu('<h2>Game paused</h2><h3>Press ESC to continue</h3><button class="replay">Replay</button>', 'pause', this.node, this.levelNumber);
            }
          }
        }
  
      };
  
      document.addEventListener('keydown', this._handlers.pause)
      this._toggleControls();
           
      this._time = setInterval(()=>{
        this.timer.up();
      }, 1000);
    } 
  
    _toggleControls() {
      this.timer.pause();
      this.dotsCount.pause();
      this.steps.pause();
      if (this.timer.paused) {
        document.removeEventListener('keydown', this._handlers.keyDown);      
        document.removeEventListener('touchstart', this._handlers.touchStart);      
        document.removeEventListener('touchmove', this._handlers.touchMove);
      } else {
        document.addEventListener('keydown', this._handlers.keyDown);
        document.addEventListener('touchstart', this._handlers.touchStart);
        document.addEventListener('touchmove', this._handlers.touchMove);
      }
    }
  
    // Main gameplay method
    _move(block, cssClass) {
      if (block && block.status != 'walled') {
        this.player.copyPosition(block.node);
        this.player.setState(cssClass);
        this.steps.up();
        if (block.removeDot() && this.dotsCount.down() && this.dotsCount.status == 'ended') {
          /* GAMEOVER screen*/          
          this._toggleControls();
          clearInterval(this._time)
          Menu(`<h2>Congratulations!</h2>
          <h3>You've finished the level</h3>
          <p>You've made #{this.steps.counter}</p>
          <p>Your time is #{this.timer.counter}</p>
          <button class="next">Next level</button>`, 'level_passed', this.node, this.levelNumber);
        }
        return true;
      } else {        
        clearInterval(this._intId);
        this.player.setState('stop');
        return false;
      }  
    }
  
    stepLeft() {
      const block = (this.player.curX > 0) ? (this.map.blocks[this.player.curX - 1][this.player.curY] || false) : false; 
      if (this._move(block, 'move-left')) {
        this.player.curX--;
      }
    }
  
    stepRight() {
      const block = (this.player.curX < this.map.blocks.length - 1) ? (this.map.blocks[this.player.curX + 1][this.player.curY] || false) : false; 
      if (this._move(block, 'move-right')) {
        this.player.curX++;
      }
    }
  
    stepUp() {
      const block = this.map.blocks[this.player.curX][this.player.curY - 1] || false; 
      if (this._move(block, 'move-up')) {
        this.player.curY--;
      }
    }
  
    stepDown() {      
      const block = this.map.blocks[this.player.curX][this.player.curY + 1] || false; 
      if (this._move(block, 'move-down')) {
        this.player.curY++;
      }
    }
  }
    class Wall extends Cell {
    setStatus() {
      this._status = 'walled';
      this.node.classList.add('walled');
    }
  }

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

  Menu('<p>Start game</p><button class="play">PLAY</button>', 'new_game', document.getElementById('map'));

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

    // Handlers
    function buttonClick(event, num) {
      event.preventDefault();
      parentEl.removeChild(menu);
      event.target.removeEventListener('click', event);
      Play(num);
    }

    function Play(levelNum) {
      new Stage(new Map(parentEl, stages[levelNum]), levelNum);
    }
  }
});