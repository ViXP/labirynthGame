class Wall extends Cell {
  setStatus() {
    this._status = 'walled';
    this.node.classList.add('walled');
  }
}