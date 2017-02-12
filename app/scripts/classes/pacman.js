class Pacman extends Character {
  constructor(map, startCell){
    super(map, 'pacman', startCell);
    this.speed = 150;
  }
}