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