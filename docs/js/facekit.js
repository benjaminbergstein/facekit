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

},{}],4:[function(require,module,exports){
function forEach(collection, callback) {
  var i, ii;
  for (i = 0, ii = collection.length; i < ii; i++) {
    callback(collection[i]);
  }
}

module.exports = forEach;

},{}],5:[function(require,module,exports){
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
},{"./dispatch-event":3,"./initialize-views":7}],6:[function(require,module,exports){
Facekit = {};

Facekit.TabView = require('./tab-view');
Facekit.PanelView = require('./panel-view');
Facekit.ForwardEventView = require('./forward-event-view');
Facekit.initializeViews = require('./initialize-views');
Facekit.classNames = require('./class-names');

module.exports = Facekit;
},{"./class-names":1,"./forward-event-view":5,"./initialize-views":7,"./panel-view":8,"./tab-view":11}],7:[function(require,module,exports){
var forEach = require('./for-each'),
    dispatchEvent = require('./dispatch-event');

function initializeView(target, viewClass, parent, scope, parentTarget) {
  var viewInstance, possibleParents, respondingParent;
  
  if (parent) {
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
    viewInstance = initializeView(target, viewClass, parent, scope, parentTarget);
    
    if (viewInstance) {
      initializedViews.push(viewInstance);
    }
  });
  
  return initializedViews;
}

module.exports = initializeViews;
},{"./dispatch-event":3,"./for-each":4}],8:[function(require,module,exports){
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
},{"./class-names":1,"./initialize-views":7}],9:[function(require,module,exports){
function Pane(target, parent) {
  this.target = target;
  this.parent = parent;
  this.controlledBy = target.dataset.controlledBy;
}

Pane.prototype.render = function() {
};

module.exports = Pane;
},{}],10:[function(require,module,exports){
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

},{"../for-each":4}],11:[function(require,module,exports){
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
  
  optionsForSubview = { parent: tabView, scope: '[data-tab-view]' };
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
    pane.target.classList.toggle(classNames.hidden, pane !== visiblePane);
  });
};

TabView.prototype.resetControls = function(options) {
  var activeControl;
  if (!options) options = {};
  activeControl = options.active;
  forEach(this.tabViewControls, function(control) {
    control.target.classList.toggle(classNames.active, control === activeControl);
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
},{"../class-names":1,"../cycling-view":2,"../dispatch-event":3,"../for-each":4,"../initialize-views":7,"./Pane.js":9,"./control.js":10}]},{},[6]);
