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