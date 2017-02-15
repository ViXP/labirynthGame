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
    class Enemy extends Character {
    constructor(map, startCell){
      super(map, 'enemy', startCell);
      this.speed = 150;
    }
  }
    function Handler() {
    if (Handler.instance) { return Handler.instance; }
    Handler.instance = this;
    this._handlers = (this._handlers == null) ? {} : this._handlers;
  
    this.append = function(hash) {
      for (let k in hash) {
        this._handlers[k] = hash[k];
      }
      return this;
    }
  
    this.get = function(k) {
      return this._handlers[k];
    }
  
    return this; 
  }
    class Map {
    constructor(domEl, mapDraw) {
      // Public properties  
      this.quantity = 0;
      this.dots = 0;
      this.node = domEl;    
      this.blocks = [];
      this.enemiesPos = [];
      self.playerPos = '';
  
      this._stage = mapDraw;
      
      this.rebuild();
    }
  
    rebuild() {
      this.blocks = [];
      const self = this;
  
      this._removeElements();
      self._stage.forEach(function(line, i){        
        self.node.appendChild(document.createElement('div'));        
        const row = self.node.lastElementChild;
        row.classList.add('row');        
        line.forEach(function(state, j){
          if (!self.blocks[j]) { self.blocks[j] = [];}
          if (['*', '|', 1].includes(state)) {
            // If wall
            self.blocks[j][i] = new Wall(row, j, i);
          } else if (state == 'P') {
            // If player
            self.blocks[j][i] = new Space(row, j, i);
            self.blocks[j][i].removeDot();
            self.playerPos = self.blocks[j][i];
          } else if (state == 'E') {
            // If enemy
            self.blocks[j][i] = new Space(row, j, i);
            self.enemiesPos.push(self.blocks[j][i]);
          } else {
            // If free space
            self.blocks[j][i] = new Space(row, j, i);
            self.dots++;
          }
          self.quantity++;
        });
      });
    }
  
    _removeElements() {
      if (this.node && this.node.childNodes) {
        const childLen = this.node.childNodes.length;
        for(let i = 0; i < childLen; i++) {
          this.node.removeChild(this.node.childNodes[0]);
        }
      }
    }
  }
    class Menu {
    constructor(code, cssClass, domNode, number, actions, cancelable) {
      const menu = document.createElement('section');
      menu.innerHTML = code;
      menu.classList.add('menu-' + cssClass);
      domNode.appendChild(menu);
  
      this.node = domNode.querySelector('.menu-' + cssClass);
  
      const self = this;
      this._hidden = true;
      this._handlers = new Handler().append({
        buttonClick: (event, num) => {
          event.preventDefault();
          self.play(num);
        },
        showHide: (event) => {
          if (event.keyCode == 27) {
            if (self.hidden) {
              self.show();
            } else {
              self.hide();
            }
          }
        }
      });
  
      // Event listeners
      if (this.node.querySelector('button.play')) {
        this.node.querySelector('button.play').addEventListener('click', (e) => { self._handlers.get('buttonClick')(e, 1); });
      }
      if (this.node.querySelector('button.replay')) {
        this.node.querySelector('button.replay').addEventListener('click', (e) => { self._handlers.get('buttonClick')(e, number); });
      }
      if (this.node.querySelector('button.next')) {
        this.node.querySelector('button.next').addEventListener('click', (e) => { self._handlers.get('buttonClick')(e, number + 1); });
      }
  
      // Optional actions
      if (actions instanceof Object) {
        /* MUST BE WRITTEN */
  
      }    
     
      if (cancelable) {
        document.addEventListener('keydown', this._handlers.get('showHide'));
      } else {
        document.removeEventListener('keydown', this._handlers.get('showHide'));
      }
      return this;
    }
  
    get hidden() {
      return this._hidden;
    }
  
    play(level) {
      this.hide();
      new Stage(new Map(this.node.parentElement, stages[level]), level);
      this.destroy();
    }
  
    destroy() {
      this.node.parentElement.removeChild(this.node);
      document.removeEventListener('keydown', this._handlers.get('showHide'));
      document.removeEventListener('click', this._handlers.get('buttonClick'));
    }
  
    show() {
      this._hidden = false;
      this.node.classList.add('show');
    }
  
    hide() {
      this._hidden = true;
      this.node.classList.remove('show');
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
      this.player = new Player(this.map, this.map.playerPos);
      this.dotsCount = new Counter(this.map.dots, this.node, 'dots');
      this.timer = new Counter(0, this.node, 'timer');
      this.steps = new Counter(0, this.node, 'steps');
      this.enemies = [];
  
      // Private properties    
      const self = this;
      this._intId = 0;
  
      // Private collections
      this._handlers = new Handler().append({
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
          }
        }
      });
      this._menus = {
        pauseMenu: new Menu('<h2>Game paused</h2><h3>Press ESC to continue</h3><button class="replay">Replay</button>', 'pause', this.node, this.levelNumber, undefined, true),
        failedMenu: new Menu("<h2>You've lost!</h2><p>The enemy ate you</p><button class=\"replay\">Replay</button", 'failed', this.node, this.levelNumber),
        finishMenu: new Menu(`
          <h2>Congratulations!</h2>
          <h3>You've finished the level</h3>
          <p>You've made #{this.steps.counter}</p>
          <p>Your time is #{this.timer.counter}</p>
          <button class="next">Next level</button>`, 'level_passed', this.node, this.levelNumber),
      }
      // Construction
      for (let i in this.map.enemiesPos) {
        this.enemies.push(new Enemy(this.map, this.map.enemiesPos[i]));
      }
      this._toggleControls();
      document.removeEventListener('keydown', this._handlers.get('pause'));
      document.addEventListener('keydown', this._handlers.get('pause'));
      this._time = setInterval(() => {
        this.timer.up();
      }, 1000);
    } 
  
    _toggleControls() {
      this.timer.pause();
      this.dotsCount.pause();
      this.steps.pause();
      if (this.timer.paused) {
        document.removeEventListener('keydown', this._handlers.get('keyDown'));
        document.removeEventListener('touchstart', this._handlers.get('touchStart'));      
        document.removeEventListener('touchmove', this._handlers.get('touchMove'));
      } else {
        document.addEventListener('keydown', this._handlers.get('keyDown'));
        document.addEventListener('touchstart', this._handlers.get('touchStart'));
        document.addEventListener('touchmove', this._handlers.get('touchMove'));
      }
    }
  
    // Main gameplay method
    _move(block, cssClass) {
      if (block && block.status != 'walled') {
        this.player.copyPosition(block.node);
        this.player.setState(cssClass);
        this.steps.up();
        if (block.removeDot() && this.dotsCount.down() && this.dotsCount.status == 'ended') {
          // If all dots collected
          this._gameOver(this._menus.finishMenu);
        }
        for (let i in this.enemies) {
          if ((this.player.curX == this.enemies[i].curX) && (this.player.curY == this.enemies[i].curY)) {
            // If catched an enemy
            console.log('catched');
            this._gameOver(this._menus.failedMenu);
            break;
          }
        }
        return true;
      } else {        
        clearInterval(this._intId);
        this.player.setState('stop');
        return false;
      }
    }
  
    _gameOver(menu) {
      this._toggleControls();
      document.removeEventListener('keydown', this._handlers.get('pause'));
      clearInterval(this._time);
      for (let i in this._menus) {
        if (this._menus[i] != menu) { 
          this._menus[i].destroy();
        } else {        
          menu.show();
        }
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
    [' ','*','*','*','*','*','*','*','*',' ','P',' ','*','*','*','*','*','*','*','*',' '], 
    [' ','*',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','*',' '],
    [' ','*',' ','*','*',' ','*','*',' ','*',' ','*',' ','*','*',' ','*','*',' ','*',' '],
    [' ','*',' ','*',' ','E',' ','*',' ','*',' ','*',' ','*',' ','E',' ','*',' ','*',' '],
    [' ','*',' ',' ',' ','*',' ',' ',' ','*',' ','*',' ',' ',' ','*',' ',' ',' ','*',' '],
    [' ','*','*','*','*','*','*','*','*','*',' ','*','*','*','*','*','*','*','*','*',' '], 
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ']
    ]
  };

  new Menu('<p>Start game</p><button class="play">PLAY</button>', 'new_game', document.getElementById('map')).show();
});