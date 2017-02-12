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