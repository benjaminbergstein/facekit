(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var classNames;

classNames = {
  hidden: 'hidden',
  active: 'active'
};

module = classNames;

},{}],2:[function(require,module,exports){
function forEach(collection, callback) {
  var i, ii;
  for (i = 0, ii = collection.length; i < ii; i++) {
    callback(collection[i]);
  }
}

module.exports = forEach;

},{}],3:[function(require,module,exports){
Facekit = {};

Facekit.TabView = require('./tab-view');
Facekit.PanelView = require('./panel-view');
Facekit.initializeViews = require('./initialize-views');
Facekit.classNames = require('./class-names');

module.exports = Facekit;
},{"./class-names":1,"./initialize-views":4,"./panel-view":5,"./tab-view":7}],4:[function(require,module,exports){
var forEach = require('./for-each');

function initializeViews(selector, viewClass, options) {
  var parent, parentTarget, viewTargets, initializedViews;
  
  if (!options) options = {};
  parent = options.parent;
  parentTarget = parent ? parent.target : document;
  viewTargets = parentTarget.querySelectorAll(selector);
  
  initializedViews = [];
  forEach(viewTargets, function(target) {
    var viewInstance;
    viewInstance = new viewClass(target, parent);
    viewInstance.render();
    initializedViews.push(viewInstance)
  });
  
  return initializedViews;
}

module.exports = initializeViews;
},{"./for-each":2}],5:[function(require,module,exports){
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
},{"./class-names":1,"./initialize-views":4}],6:[function(require,module,exports){
var forEach = require('../for-each');

Control = function TabViewControl(target, parent) {
  var tabViewControl;
  
  tabViewControl = this;
  tabViewControl.target = target;
  tabViewControl.parent = parent;
  tabViewControl.labelText = tabViewControl.target.innerText.trim();
  
  forEach(tabViewControl.parent.panes, function(pane) {
    var text;
    text = pane.dataset.controlledBy;
    
    if (tabViewControl.labelText === text) {
      tabViewControl.pane = pane;
    }
  });
};

Control.prototype.render = function() {
  var control, tabView;
  control = this;
  tabView = control.parent;
  
  control.target.addEventListener('click', function() {
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

},{"../for-each":2}],7:[function(require,module,exports){
(function (global){
var forEach = require('../for-each');
var initializeViews = require('../initialize-views');
var classNames = require('../class-names');

function TabView(target) {
  this.target = target;
}

TabView.Control = require('./control.js');

TabView.prototype.render = function() {
  var tabView, options, controls, panes;
  tabView = this;
  
  tabView.panes = tabView.target.querySelectorAll('[data-tab-view-pane]');
  
  options = { parent: tabView };
  this.tabViewControls = initializeViews('[data-tab-view-control]', TabView.Control, options);
};

TabView.prototype.resetPanes = function(options) {
  var visiblePane;
  if (!options) options = {};
  visiblePane = options.visible;
  forEach(this.panes, function(pane) {
    pane.classList.toggle(classNames.hidden, pane !== visiblePane);
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
},{"../class-names":1,"../for-each":2,"../initialize-views":4,"./control.js":6}]},{},[3]);
