class Enemy extends Character {
  constructor(map, startCell){
    super(map, 'enemy', startCell);
    this.speed = 150;
  }
}