(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var classNames;

classNames = {
  hidden: 'hidden',
  active: 'active'
};

module = classNames;

},{}],2:[function(require,module,exports){
function CyclingView(items) {
  this.items = items;
}

CyclingView.prototype.advance = function(targetItem, numberToAdvance) {
  var items, currentItemIndex, totalItems, nextItemIndex;
  items = this.items;
  currentItemIndex = items.indexOf(targetItem);
  totalItems = items.length;
  nextItemIndex = (currentItemIndex + numberToAdvance) % totalItems;
  if (nextItemIndex < 0) nextItemIndex = totalItems - 1;
  return items[nextItemIndex];
};

module.exports = CyclingView;
},{}],3:[function(require,module,exports){
(function (global){
var initializeViews = require('./initialize-views');

function Control(target, parent) {
  this.target = target;
  this.parent = parent;
}

Control.prototype.render = function() {
  var control;
  control = this;
  
  control.target.addEventListener('click', function() {
    control.parent.dismiss();
  });
};

function DismissView(target) {
  this.target = target;
}

DismissView.prototype.render = function() {
  optionsForSubview = { parent: this };
  this.controls = initializeViews('[data-dismiss-control]', Control, optionsForSubview);
};

DismissView.prototype.dismiss = function() {
  this.target.classList.add('is-hidden');
};

if (global.doInitializeViews) {
  initializeViews('[data-dismiss-view]', DismissView);
}

module.exports = DismissView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./initialize-views":10}],4:[function(require,module,exports){
function dispatchEvent(target, eventType, options) {
  // CustomEvent is not available in phantomjs v1.9.8, and file uploads down work with v2+.
  if (typeof CustomEvent === 'function') {
    event = new CustomEvent(eventType, options);
  } else {
    event = document.createEvent('CustomEvent');
    event.initEvent(eventType, options.bubbles, options.cancelable);
  }
  
  target.dispatchEvent(event);
}

module.exports = dispatchEvent;

},{}],5:[function(require,module,exports){
function Control(target, parent) {
  this.target = target;
  this.parent = parent;
}

Control.prototype.render = function() {
  var control;
  control = this;
  control.target.addEventListener('click', function() {
    control.parent.toggle();
  });
};

module.exports = Control;

},{}],6:[function(require,module,exports){
(function (global){
var initializeViews = require('../initialize-views'),
    classNames = require('../class-names');

function DropdownView(target) {
  this.target = target;
}

DropdownView.Control = require('./control');

DropdownView.prototype.render = function() {
  initializeViews('[data-dropdown-view-control]', DropdownView.Control, { parent: this });
};

DropdownView.prototype.toggle = function(force) {
  var active, classList;
  classList = this.target.classList;
  active = classList.contains(classNames.active);
  
  if (active || force === false) {
    classList.remove(classNames.active);
  } else {
    classList.add(classNames.active);
  }
};

if (global.doInitializeViews) {
  initializeViews('[data-dropdown-view]', DropdownView);
}

module.exports = DropdownView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../class-names":1,"../initialize-views":10,"./control":5}],7:[function(require,module,exports){
function forEach(collection, callback) {
  var i, ii;
  for (i = 0, ii = collection.length; i < ii; i++) {
    callback(collection[i]);
  }
}

module.exports = forEach;

},{}],8:[function(require,module,exports){
(function (global){
var dispatchEvent = require('./dispatch-event');
var initializeViews = require('./initialize-views');

function ForwardEventView(target) {
  this.target = target;
}

ForwardEventView.prototype.render = function() {
  var target, setting;
  
  target = this.target;
  setting = this.target.dataset.forwardEvent;
  setting = setting.split(/ ?=> ?/);
  
  target.addEventListener(setting[0], function() {
    dispatchEvent(target, setting[1], { bubbles: true });
  });
};

if (global.doInitializeViews) {
  initializeViews('[data-forward-event]', ForwardEventView);
}

module.exports = ForwardEventView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./dispatch-event":4,"./initialize-views":10}],9:[function(require,module,exports){
Facekit = {};

Facekit.initializeViews = require('./initialize-views');
Facekit.classNames = require('./class-names');

Facekit.DismissView = require('./dismiss-view');
Facekit.ForwardEventView = require('./forward-event-view');
Facekit.ModalView = require('./modal-view');
Facekit.DropdownView = require('./dropdown-view');
Facekit.PanelView = require('./panel-view');
Facekit.TabView = require('./tab-view');

module.exports = Facekit;
},{"./class-names":1,"./dismiss-view":3,"./dropdown-view":6,"./forward-event-view":8,"./initialize-views":10,"./modal-view":12,"./panel-view":13,"./tab-view":16}],10:[function(require,module,exports){
var forEach = require('./for-each'),
    dispatchEvent = require('./dispatch-event');

function initializeView(target, viewClass, parent, parentTarget, selector) {
  var scope, viewInstance, possibleParents, respondingParent;
  
  if (parent) {
    scope = parent.initializedWith;
    possibleParents = document.querySelectorAll(scope);
    forEach(possibleParents, function(parent) {
      parent.addEventListener('parent:searching', function(e) {
        respondingParent = parent;
        e.stopPropagation();
      });
    });
    
    dispatchEvent(target, 'parent:searching', { bubbles: true, cancelable: true});
    if (respondingParent !== parentTarget) return false;
  }
  
  viewInstance = new viewClass(target, parent);
  viewInstance.initializedWith = selector;
  viewInstance.render();
  return viewInstance;
}

function initializeViews(selector, viewClass, options) {
  var parent, scope, parentTarget, viewTargets, initializedViews;
  
  if (!options) options = {};
  parent = options.parent;
  scope = options.scope;
  parentTarget = parent ? parent.target : document;
  viewTargets = parentTarget.querySelectorAll(selector);
  
  initializedViews = [];
  forEach(viewTargets, function(target) {
    var viewInstance;
    viewInstance = initializeView(target, viewClass, parent, parentTarget, selector);
    
    if (viewInstance) {
      initializedViews.push(viewInstance);
    }
  });
  
  return initializedViews;
}

module.exports = initializeViews;
},{"./dispatch-event":4,"./for-each":7}],11:[function(require,module,exports){
function ModalControl(target, parent) {
  this.target = target;
  this.parent = parent;
  this.action = this.target.dataset.modalViewControl;
}

ModalControl.prototype.render = function() {
  var control;
  control = this;
  
  control.target.addEventListener('click', function() {
    if (control.action == 'deactivate') {
      control.parent.deactivate();
    } else if (control.action == 'activate') {
      control.parent.activate();
    }
  });
};

ModalControl.prototype.activate = function() {
  this.target.classList.add('is-active');
};

ModalControl.prototype.deactivate = function() {
  this.target.classList.remove('is-active');
};

module.exports = ModalControl;
},{}],12:[function(require,module,exports){
(function (global){
var initializeViews = require('../initialize-views'),
    ModalControl = require('./control');

function ModalView(target) {
  this.target = target;
}

ModalView.prototype.render = function() {
  var subviewOptions;
  subviewOptions = { parent: this };
  initializeViews('[data-modal-view-control]', ModalControl, subviewOptions);
  this.subjects = initializeViews('[data-modal-view-subject]', ModalControl, subviewOptions);
};

ModalView.prototype.activate = function() {
  this.subjects[0].activate();
};

ModalView.prototype.deactivate = function() {
  this.subjects[0].deactivate();
};

if (global.doInitializeViews) {
  initializeViews('[data-modal-view]', ModalView);
}

module.exports = ModalView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../initialize-views":10,"./control":11}],13:[function(require,module,exports){
(function (global){
var initializeViews = require('./initialize-views');
var classNames = require('./class-names');

function PanelView(target) {
  this.target = target;
  this.toggleElement = this.target.querySelector('[data-panel-view-toggle]');
  this.bodyElement = this.target.querySelector('[data-panel-view-body]');
}

PanelView.prototype.render= function() {
  var panelView;
  panelView = this;
  
  if (this.toggleElement) {
    this.toggleElement.addEventListener('click', function() {
      panelView.toggle();
    });
  }
};

PanelView.prototype.toggle = function() {
  this.bodyElement.classList.toggle(classNames.hidden)
};

if (global.doInitializeViews) {
  initializeViews('[data-panel-view]', PanelView);
}

module.exports = PanelView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./class-names":1,"./initialize-views":10}],14:[function(require,module,exports){
function Pane(target, parent) {
  this.target = target;
  this.parent = parent;
  this.controlledBy = target.dataset.controlledBy;
}

Pane.prototype.render = function() {
};

module.exports = Pane;
},{}],15:[function(require,module,exports){
var forEach = require('../for-each');

var Control = function TabViewControl(target, parent) {
  var tabViewControl;
  
  tabViewControl = this;
  tabViewControl.target = target;
  tabViewControl.parent = parent;
  tabViewControl.labelText = tabViewControl.target.innerText.trim();
  
  forEach(tabViewControl.parent.panes, function(pane) {
    var text;
    text = pane.controlledBy;
    
    if (tabViewControl.labelText === text) {
      tabViewControl.pane = pane;
      pane.control = tabViewControl;
    }
  });
};

Control.prototype.render = function() {
  var control, tabView;
  control = this;
  tabView = control.parent;
  
  control.target.addEventListener('keyup', function(e) {
    var keyCode;
    
    keyCode = e.keyCode;
    
    if (keyCode === 37 || keyCode === 38) {
      tabView.previousTab(control);
    } else if (keyCode === 39 || keyCode === 40) {
      tabView.nextTab(control);
    }
  });
  
  control.target.addEventListener('click', function() {
    var link;
    
    if (control.target.tagName === 'A') {
      link = control.target;
    } else {
      link = control.target.querySelector('a');
    }
    
    if (link) link.focus();
    tabView.resetControls({ active: control });
    tabView.resetPanes({ visible: control.pane });
  });
};

Control.prototype.isActive = function(labelText) {
  var isActive;
  isActive = this.labelText === labelText;
  return this.labelText === labelText;
};

module.exports = Control;

},{"../for-each":7}],16:[function(require,module,exports){
(function (global){
var forEach = require('../for-each'),
    CyclingView = require('../cycling-view'),
    initializeViews = require('../initialize-views'),
    dispatchEvent = require('../dispatch-event'),
    classNames = require('../class-names');

function TabView(target) {
  this.target = target;
  this.enableCycling = target.dataset.enableCycling
}

TabView.Control = require('./control.js');
TabView.Pane = require('./Pane.js');

TabView.prototype.render = function() {
  var tabView, optionsForSubview;
  tabView = this;
  
  optionsForSubview = { parent: tabView };
  this.panes = initializeViews('[data-tab-view-pane]', TabView.Pane, optionsForSubview);
  this.tabViewControls = initializeViews('[data-tab-view-control]', TabView.Control, optionsForSubview);
  
  if (tabView.enableCycling !== undefined) {
    this.cyclingView = new CyclingView(this.tabViewControls);
  }
};

TabView.prototype.nextTab = function(targetControl) {
  var nextControl;
  if (!this.cyclingView) return;
  nextControl = this.cyclingView.advance(targetControl, 1);
  dispatchEvent(nextControl.target, 'click');
};

TabView.prototype.previousTab = function(targetControl) {
  var previousControl;
  if (!this.cyclingView) return;
  previousControl = this.cyclingView.advance(targetControl, -1);
  dispatchEvent(previousControl.target, 'click');
};

TabView.prototype.resetPanes = function(options) {
  var visiblePane;
  if (!options) options = {};
  visiblePane = options.visible;
  forEach(this.panes, function(pane) {
    if (pane !== visiblePane) {
      pane.target.classList.add(classNames.hidden);
    } else {
      pane.target.classList.remove(classNames.hidden);
    }
  });
};

TabView.prototype.resetControls = function(options) {
  var activeControl;
  if (!options) options = {};
  activeControl = options.active;
  global.log = [];
  forEach(this.tabViewControls, function(control) {
    global.log.push([
      control.target.innerText,
      activeControl.target.innerText,
      control === activeControl
    ]);
    
    if (control === activeControl) {
      control.target.classList.add(classNames.active);
    } else {
      control.target.classList.remove(classNames.active);
    }
  });
};

if (global.doInitializeViews) {
  initializeViews('[data-tab-view]', TabView);
  
  global.addEventListener('xhr:load', function() {
    initializeViews('[data-tab-view]', TabView);
  });
}

module.exports = TabView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../class-names":1,"../cycling-view":2,"../dispatch-event":4,"../for-each":7,"../initialize-views":10,"./Pane.js":14,"./control.js":15}]},{},[9]);
