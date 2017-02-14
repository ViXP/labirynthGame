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

  _removeElements() {
    if (this.node && this.node.childNodes) {
      const childLen = this.node.childNodes.length;
      for(let i = 0; i < childLen; i++) {
        this.node.removeChild(this.node.childNodes[0]);
      }
    }
  }
}