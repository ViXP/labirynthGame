"use strict";function _toConsumableArray(t){if(Array.isArray(t)){for(var e=0,s=Array(t.length);e<t.length;e++)s[e]=t[e];return s}return Array.from(t)}function _possibleConstructorReturn(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,e){for(var s=0;s<e.length;s++){var n=e[s];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,s,n){return s&&t(e.prototype,s),n&&t(e,n),e}}(),Cell=function(){function t(e,s,n){_classCallCheck(this,t);var a=document.createElement("div");a.classList.add("cell"),e.appendChild(a),this.node=e.lastElementChild,this.X=s,this.Y=n,this.setStatus()}return _createClass(t,[{key:"setStatus",value:function(){throw new Error("Abstract method must be overriden by the child class!")}},{key:"status",get:function(){return this._status}}]),t}(),Character=function(){function t(e,s,n){_classCallCheck(this,t),e.node.appendChild(document.createElement("div")),this.node=e.node.lastElementChild,this.curX=n.X,this.curY=n.Y,this.speed=0,this.setState("stop"),this._setCss(s),this.copyPosition(n.node)}return _createClass(t,[{key:"_setCss",value:function(t){0==this.node.classList.length&&(this.cssClass=t,this.node.className=t)}},{key:"copyPosition",value:function(t){this.node.style.left=t.offsetLeft+"px",this.node.style.top=t.offsetTop+"px"}},{key:"setState",value:function(t){switch(this._state=t,this._state){case"move-right":this.node.className=this.cssClass+" move right";break;case"move-left":this.node.className=this.cssClass+" move left";break;case"move-up":this.node.className=this.cssClass+" move up";break;case"move-down":this.node.className=this.cssClass+" move down";break;default:this.node.classList.remove("move")}}},{key:"state",get:function(){return this._state}}]),t}(),Counter=function(){function t(e,s,n){_classCallCheck(this,t);var a=document.createElement("div");a.classList.add("counter"),a.classList.add(n),s.appendChild(a),this.node=s.lastElementChild,this.counter=e||0,this._frozen=!1,this.setStatus("started"),this.nodeUpdate()}return _createClass(t,[{key:"setStatus",value:function(t){this._status=t}},{key:"down",value:function(){return!this._frozen&&(this.counter--,this.nodeUpdate(),!0)}},{key:"freeze",value:function(){this._frozen=!0}},{key:"up",value:function(){return!this._frozen&&(this.counter++,this.nodeUpdate(),!0)}},{key:"nodeUpdate",value:function(){this.node.innerText=this.counter,0==this.counter&&this.setStatus("ended")}},{key:"status",get:function(){return this._status}}]),t}(),Map=function(){function t(e,s){_classCallCheck(this,t),this.quantity=0,this.dots=0,this.blocks=[],this.node=e,this._stage=s,this.rebuild()}return _createClass(t,[{key:"rebuild",value:function(){this.blocks=[],this.node.innerHTML="";var t=this;t._stage.forEach(function(e,s){t.node.appendChild(document.createElement("div"));var n=t.node.lastElementChild;n.classList.add("row"),e.forEach(function(e,a){t.blocks[a]||(t.blocks[a]=[]),["*","|",1].includes(e)?t.blocks[a][s]=new Wall(n,a,s):"G"==e?(t.blocks[a][s]=new Space(n,a,s),t.blocks[a][s].removeDot(),t.startElement=t.blocks[a][s]):(t.blocks[a][s]=new Space(n,a,s),t.dots++),t.quantity++})})}}]),t}(),Pacman=function(t){function e(t,s){_classCallCheck(this,e);var n=_possibleConstructorReturn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,"pacman",s));return n.speed=150,n}return _inherits(e,t),e}(Character),Space=function(t){function e(){return _classCallCheck(this,e),_possibleConstructorReturn(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return _inherits(e,t),_createClass(e,[{key:"addDot",value:function(){this._dotted=!0;var t=document.createElement("div");t.classList.add("dot"),this.node.appendChild(t)}},{key:"removeDot",value:function(){return 0!=this.dotted&&(this._dotted=!1,this.node.innerHTML="",!0)}},{key:"setStatus",value:function(){this._status="free",this.node.classList.add("free"),this.addDot()}},{key:"dotted",get:function(){return this._dotted}}]),e}(Cell),Stage=function(){function t(e,s){var n=this;_classCallCheck(this,t),this.map=e,this.levelNumber=s,this._intId=0,this.player=new Pacman(this.map,this.map.startElement),this.dotsCount=new Counter(this.map.dots,this.map.node,"dots"),this.timer=new Counter(0,this.map.node,"timer"),this.steps=new Counter(0,this.map.node,"steps");var a=this;this._handlers={keyDown:function(t){switch(t.preventDefault(),clearInterval(a._intId),t.keyCode){case 38:a._intId=setInterval(a.stepUp.bind(a),a.player.speed);break;case 40:a._intId=setInterval(a.stepDown.bind(a),a.player.speed);break;case 37:a._intId=setInterval(a.stepLeft.bind(a),a.player.speed);break;case 39:a._intId=setInterval(a.stepRight.bind(a),a.player.speed)}},touchStart:function(t){n._touchStart=t.touches[0]},touchMove:function(t){n._touchEnd=t.touches[0],clearInterval(a._intId),Math.abs(n._touchStart.pageX-n._touchEnd.pageX)>Math.abs(n._touchStart.pageY-n._touchEnd.pageY)?a._intId=n._touchStart.pageX>n._touchEnd.pageX?setInterval(a.stepLeft.bind(a),a.player.speed):setInterval(a.stepRight.bind(a),a.player.speed):n._touchStart.pageX-n._touchEnd.pageX<Math.abs(n._touchStart.pageY-n._touchEnd.pageY)&&(a._intId=n._touchStart.pageY>n._touchEnd.pageY?setInterval(a.stepUp.bind(a),a.player.speed):setInterval(a.stepDown.bind(a),a.player.speed))}},document.addEventListener("keydown",this._handlers.keyDown),document.addEventListener("touchstart",this._handlers.touchStart),document.addEventListener("touchmove",this._handlers.touchMove),this._time=setInterval(function(){n.timer.up()},1e3)}return _createClass(t,[{key:"_move",value:function(t,e){return t&&"walled"!=t.status?(this.player.copyPosition(t.node),this.player.setState(e),this.steps.up(),t.removeDot()&&this.dotsCount.down()&&"ended"==this.dotsCount.status&&(this.timer.freeze(),this.dotsCount.freeze(),this.steps.freeze(),clearInterval(this._time),document.removeEventListener("keydown",this._handlers.keyDown),document.removeEventListener("touchstart",this._handlers.touchStart),document.removeEventListener("touchmove",this._handlers.touchMove),Menu("<h2>Congratulations!</h2>\n\n        <h3>You've finished the level</h3>\n\n        <p>You've made #{this.steps.counter}</p>\n\n        <p>Your time is #{this.timer.counter}</p>\n\n        <button>Next level</button>","menu-level_passed",this.map.node,Play,this.levelNumber+1)),!0):(clearInterval(this._intId),this.player.setState("stop"),!1)}},{key:"stepLeft",value:function(){var t=this.player.curX>0&&(this.map.blocks[this.player.curX-1][this.player.curY]||!1);this._move(t,"move-left")&&this.player.curX--}},{key:"stepRight",value:function(){var t=this.player.curX<this.map.blocks.length-1&&(this.map.blocks[this.player.curX+1][this.player.curY]||!1);this._move(t,"move-right")&&this.player.curX++}},{key:"stepUp",value:function(){var t=this.map.blocks[this.player.curX][this.player.curY-1]||!1;this._move(t,"move-up")&&this.player.curY--}},{key:"stepDown",value:function(){var t=this.map.blocks[this.player.curX][this.player.curY+1]||!1;this._move(t,"move-down")&&this.player.curY++}}]),t}(),Wall=function(t){function e(){return _classCallCheck(this,e),_possibleConstructorReturn(this,(e.__proto__||Object.getPrototypeOf(e)).apply(this,arguments))}return _inherits(e,t),_createClass(e,[{key:"setStatus",value:function(){this._status="walled",this.node.classList.add("walled")}}]),e}(Cell);document.addEventListener("DOMContentLoaded",function(){function t(t){new Stage(new Map(s,n[t]),t)}function e(t,e,s,n,a){var o=document.createElement("section");o.innerHTML=t,o.classList.add(e),s.appendChild(o),s.querySelector("button").addEventListener("click",function(t){t.preventDefault(),s.removeChild(o),n.apply(void 0,_toConsumableArray(a))})}var s=document.getElementById("map");e("<p>Start game</p><button>PLAY</button>","menu-new_game",s,t,[1]);var n={1:[[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],[" ","*","*","*","*","*","*","*","*","*"," ","*","*","*","*","*","*","*","*","*"," "],[" ","*"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","*"," "],[" ","*"," "," ","*","*","*"," "," ","*"," ","*"," "," ","*","*","*"," "," ","*"," "],[" ","*"," ","*"," "," "," ","*"," ","*"," ","*"," ","*"," "," "," ","*"," ","*"," "],[" ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," "],[" ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," "],[" ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," "],[" ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," "],[" ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," "],[" ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," "],[" ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," ","*"," "],[" ","*"," ","*"," "," "," ","*"," ","*"," ","*"," ","*"," "," "," ","*"," ","*"," "],[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],[" ","*","*","*","*","*","*","*","*"," ","G"," ","*","*","*","*","*","*","*","*"," "],[" ","*"," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," ","*"," "],[" ","*"," ","*","*"," ","*","*"," ","*"," ","*"," ","*","*"," ","*","*"," ","*"," "],[" ","*"," ","*"," "," "," ","*"," ","*"," ","*"," ","*"," "," "," ","*"," ","*"," "],[" ","*"," "," "," ","*"," "," "," ","*"," ","*"," "," "," ","*"," "," "," ","*"," "],[" ","*","*","*","*","*","*","*","*","*"," ","*","*","*","*","*","*","*","*","*"," "],[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "]]}});