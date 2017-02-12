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