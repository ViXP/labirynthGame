class Menu {
  constructor(code, cssClass, domNode, number, actions, cancelable) {
    const menu = document.createElement('section');
    menu.innerHTML = code;
    menu.classList.add('menu-' + cssClass);
    domNode.appendChild(menu);

    this.node = domNode.querySelector('section');

    const self = this;
    this._hidden = true;
    this._handlers = new Handler().append({
      buttonClick: (event, num) => {
        event.preventDefault();
        self.play(num);
      },
      showHide: (event) => {
        if (event.keyCode == 27) {
          if (self.hidden) {
            self.show();
          } else {
            self.hide();
          }
        }
      }
    });

    // Event listeners
    if (this.node.querySelector('button.play')) {
      this.node.querySelector('button.play').addEventListener('click', (e) => { self._handlers.get('buttonClick')(e, 1); });
    }
    if (this.node.querySelector('button.replay')) {
      this.node.querySelector('button.replay').addEventListener('click', (e) => { self._handlers.get('buttonClick')(e, number); });
    }
    if (this.node.querySelector('button.next')) {
      this.node.querySelector('button.next').addEventListener('click', (e) => { self._handlers.get('buttonClick')(e, number + 1); });
    }

    // Optional actions
    if (actions instanceof Object) {
      /* MUST BE WRITTEN */

    }    
   
    if (cancelable) {
      document.addEventListener('keydown', this._handlers.get('showHide'));
    }

    return this;
  }

  get hidden() {
    return this._hidden;
  }

  play(level) {
    this.hide();
    new Stage(new Map(this.node.parentElement, stages[level]), level);
    this.destroy();
  }

  destroy() {
    this.node.parentElement.removeChild(this.node);
    document.removeEventListener('keydown', this._handlers.get('showHide'));
    document.removeEventListener('click', this._handlers.get('buttonClick'));
  }

  show() {
    this._hidden = false;
    this.node.classList.add('show');
  }

  hide() {
    this._hidden = true;
    this.node.classList.remove('show');
  }
}