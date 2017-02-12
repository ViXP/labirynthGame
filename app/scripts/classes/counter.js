class Counter {
  constructor(quantity, domEl, cssClass) {
    // DOM manipulation
    const counter = document.createElement('div');
    counter.classList.add('counter');
    counter.classList.add(cssClass);
    domEl.appendChild(counter);

    // Public properties
    this.node = domEl.lastElementChild;
    this.counter = quantity || 0;

    // Private properties
    this._frozen = false;

    this.setStatus('started');
    this.nodeUpdate();
  }

  get status() {
    return this._status;
  }

  setStatus(state) {
    this._status = state;
  }

  down() {
    if (!this._frozen) {
      this.counter--;
      this.nodeUpdate();
      return true;
    }
    return false;
  }

  freeze() {
    this._frozen = true;
  }

  up() {      
    if (!this._frozen) {
      this.counter++;
      this.nodeUpdate();
      return true;
    }
    return false;
  }

  nodeUpdate() {
    this.node.innerText = this.counter;
    if (this.counter == 0) {
      this.setStatus('ended');
    }
  }
}