class Player extends Character {
  constructor(map, startCell){
    super(map, 'player', startCell);
    this.speed = 150;
  }
}