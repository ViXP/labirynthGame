class Map {
  constructor(domEl, lvlPlan) {
    // Public properties  
    this.quantity = 0;
    this.dots = 0;
    this.node = domEl;    
    this.blocks = [];
    this.enemiesPos = [];
    this.playerPos = '';

    // Private properties
    this._stage = lvlPlan;    
    const self = this;

    this._stage.forEach((line, i) => {        
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
}