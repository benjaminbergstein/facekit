(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const classNames = {};
module.exports = classNames;

},{}],2:[function(require,module,exports){
var SelectorList = require('../selector-list');

function Control(target, parent) {
  this.target = target;
  this.parent = parent;
}

Control.prototype.render = function() {
  var control, dataset, datasetKey;
  
  control = this;
  dataset = control.target.dataset;
  datasetKey = SelectorList['context-view-control-dataset-key'];
  control.contextName = dataset[datasetKey];
  
  control.target.addEventListener('click', function() {
    control.parent.setContext(control.contextName);
  });
};

module.exports = Control;
},{"../selector-list":21}],3:[function(require,module,exports){
(function (global){
var initializeViews = require('../initialize-views'),
    SelectorList = require('../selector-list'),
    forEach = require('../for-each');

function ContextView(target) {
  this.target = target;
}

ContextView.Control = require('./control');
ContextView.Responder = require('./responder');

ContextView.prototype.render = function() {
  initializeViews(
    SelectorList['context-view-control'],
    ContextView.Control,
    { parent: this }
  );
  
  this.responders = initializeViews(
    SelectorList['context-view-responder'],
    ContextView.Responder,
    { parent: this }
  );
};

ContextView.prototype.setContext = function(contextName) {
  forEach(this.responders, function(responder) {
    responder.toggle(contextName);
  });
};

if (global.skipInitializeViews !== true) {
  initializeViews(
    SelectorList['context-view'],
    ContextView
  );
}

module.exports = ContextView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../for-each":10,"../initialize-views":15,"../selector-list":21,"./control":2,"./responder":4}],4:[function(require,module,exports){
var SelectorList = require('../selector-list'),
    classNames = require('../class-names');

function ContextViewResponder(target, parent) {
  this.target = target;
  this.parent = parent;
}

ContextViewResponder.prototype.render = function() {
  var responder, dataset, datasetKey;
  
  responder = this;
  dataset = responder.target.dataset;
  datasetKey = SelectorList['context-view-responder-dataset-key'];
  responder.contextName = dataset[datasetKey];
};

ContextViewResponder.prototype.toggle = function(contextName) {
  var classList;
  
  classList = this.target.classList;
  
  if (this.contextName === contextName) {
    classList.remove(classNames['hidden']);
  } else {
    classList.add(classNames['hidden']);
  }
};

module.exports = ContextViewResponder;
},{"../class-names":1,"../selector-list":21}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
(function (global){
var initializeViews = require('./initialize-views'),
    SelectorList = require('./selector-list'),
    classNames = require('./class-names');

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
  this.controls = initializeViews(SelectorList['dismiss-control'], Control, optionsForSubview);
};

DismissView.prototype.dismiss = function() {
  this.target.classList.add(classNames.hidden);
};

if (global.skipInitializeViews !== true) {
  initializeViews(SelectorList['dismiss-view'], DismissView);
}

module.exports = DismissView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./class-names":1,"./initialize-views":15,"./selector-list":21}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

if (global.skipInitializeViews !== true) {
  initializeViews('[data-dropdown-view]', DropdownView);
}

module.exports = DropdownView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../class-names":1,"../initialize-views":15,"./control":8}],10:[function(require,module,exports){
function forEach(collection, callback) {
  var i, ii;
  for (i = 0, ii = collection.length; i < ii; i++) {
    callback(collection[i]);
  }
}

module.exports = forEach;

},{}],11:[function(require,module,exports){
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

if (global.skipInitializeViews !== true) {
  initializeViews('[data-forward-event]', ForwardEventView);
}

module.exports = ForwardEventView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./dispatch-event":7,"./initialize-views":15}],12:[function(require,module,exports){
const classNames = require('../class-names');

module.exports = function() {
  classNames.hidden = 'hidden';
  classNames.active = 'active';
};

},{"../class-names":1}],13:[function(require,module,exports){
const classNames = require('../class-names');

module.exports = function() {
  classNames.hidden = 'is-hidden';
  classNames.active = 'is-active';
};

},{"../class-names":1}],14:[function(require,module,exports){
Facekit = {};

Facekit.version = require('./version');

Facekit.setFrameworkBulma = require('./frameworks/bulma');
Facekit.setFrameworkBootstrap = require('./frameworks/bootstrap');

Facekit.initializeViews = require('./initialize-views');
Facekit.SelectorList = require('./selector-list');
Facekit.classNames = require('./class-names');

Facekit.ContextView = require('./context-view');
Facekit.DismissView = require('./dismiss-view');
Facekit.DropdownView = require('./dropdown-view');
Facekit.ForwardEventView = require('./forward-event-view');
Facekit.LoadView = require('./load-view');
Facekit.ModalView = require('./modal-view');
Facekit.PanelView = require('./panel-view');
Facekit.TabView = require('./tab-view');

Facekit.setFrameworkBulma();

module.exports = Facekit;

},{"./class-names":1,"./context-view":3,"./dismiss-view":6,"./dropdown-view":9,"./forward-event-view":11,"./frameworks/bootstrap":12,"./frameworks/bulma":13,"./initialize-views":15,"./load-view":17,"./modal-view":19,"./panel-view":20,"./selector-list":21,"./tab-view":24,"./version":25}],15:[function(require,module,exports){
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
},{"./dispatch-event":7,"./for-each":10}],16:[function(require,module,exports){
var SelectorList = require('../selector-list');

function LoadViewControl(target, parent) {
  this.target = target;
  this.parent = parent;
}

LoadViewControl.prototype.render = function() {
  var target, parent, datasetKey, reloadUrl;
  
  target = this.target;
  parent = this.parent;
  datasetKey = SelectorList['load-view-reload-dataset-key'];
  reloadUrl = target.dataset[datasetKey];
  
  target.addEventListener('click', function () {
    parent.url = reloadUrl;
    parent.load();
  });
};

module.exports = LoadViewControl;

},{"../selector-list":21}],17:[function(require,module,exports){
(function (global){
var initializeViews = require('../initialize-views'),
    SelectorList = require('../selector-list'),
    xhr = require('../xhr'),
    loadInnerHTML = require('../xhr/load-inner-html');

function LoadView(target) {
  this.target = target;
  this.url = target.dataset[SelectorList['load-view-dataset-key']];
  this.loadEvery = target.dataset[SelectorList['load-view-load-every-dataset-key']];
  this.isForm = this.target.tagName === 'FORM';
}

LoadView.Control = require('./control');

LoadView.prototype.render = function() {
  var view, target;
  
  view = this;
  target = view.target;
  view.renderSubviews();
  view.load();
  
  target.addEventListener('xhr:load', function() {
    view.renderSubviews();
  });
  
  target.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    var formData;
    
    formData = new FormData(target);
    
    xhr(target.method || 'GET', target.action, formData, function(status, html, xhr) {
      loadInnerHTML(target, html);
    });
  });
};

LoadView.prototype.renderSubviews = function() {
  initializeViews(SelectorList['load-view-reload'], LoadView.Control, { parent: this });
};

LoadView.prototype.load = function() {
  var view;
  
  view = this;
  
  if (view.url === "" && view.isForm) return;
  
  xhr('GET', view.url, undefined, function (status, html, xhr) {
    loadInnerHTML(view.target, html);
    
    if (view.loadEvery) {
      setTimeout(function() { view.load(); }, view.loadEvery);
    }
  });
};

if (global.skipInitializeViews !== true) {
  initializeViews(SelectorList['load-view'], LoadView);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../initialize-views":15,"../selector-list":21,"../xhr":26,"../xhr/load-inner-html":27,"./control":16}],18:[function(require,module,exports){
var classNames = require('../class-names');

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
  this.target.classList.add(classNames.active);
};

ModalControl.prototype.deactivate = function() {
  this.target.classList.remove(classNames.active);
};

module.exports = ModalControl;

},{"../class-names":1}],19:[function(require,module,exports){
(function (global){
var initializeViews = require('../initialize-views'),
    SelectorList = require('../selector-list'),
    ModalControl = require('./control');

function ModalView(target) {
  this.target = target;
}

ModalView.prototype.render = function() {
  var subviewOptions;
  subviewOptions = { parent: this };
  initializeViews(SelectorList['modal-view-control'], ModalControl, subviewOptions);
  this.subjects = initializeViews(SelectorList['modal-view-subject'], ModalControl, subviewOptions);
};

ModalView.prototype.activate = function() {
  this.subjects[0].activate();
};

ModalView.prototype.deactivate = function() {
  this.subjects[0].deactivate();
};

if (global.skipInitializeViews !== true) {
  initializeViews(SelectorList['modal-view'], ModalView);
}

module.exports = ModalView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../initialize-views":15,"../selector-list":21,"./control":18}],20:[function(require,module,exports){
(function (global){
var initializeViews = require('./initialize-views'),
    SelectorList = require('./selector-list'),
    classNames = require('./class-names');

function PanelView(target) {
  this.target = target;
  this.toggleElement = this.target.querySelector(SelectorList['panel-view-toggle']);
  this.bodyElement = this.target.querySelector(SelectorList['panel-view-body']);
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

if (global.skipInitializeViews !== true) {
  initializeViews(SelectorList['panel-view'], PanelView);
}

module.exports = PanelView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./class-names":1,"./initialize-views":15,"./selector-list":21}],21:[function(require,module,exports){
var SelectorList;

SelectorList = {
  'modal-view': '[data-modal-view]',
  'modal-view-control': '[data-modal-view-control]',
  'modal-view-subject': '[data-modal-view-subject]',
  
  'dismiss-view': '[data-dismiss-view]',
  'dismiss-control': '[data-dismiss-control]',
  
  'panel-view': '[data-panel-view]',
  'panel-view-toggle': '[data-panel-view-toggle]',
  'panel-view-body': '[data-panel-view-body]',
  
  'tab-view': '[data-tab-view]',
  'tab-view-control': '[data-tab-view-control]',
  'tab-view-pane': '[data-tab-view-pane]',
  
  'context-view': '[data-context-view]',
  'context-view-responder': '[data-context]',
  'context-view-responder-dataset-key': 'context',
  'context-view-control': '[data-set-context]',
  'context-view-control-dataset-key': 'setContext',
  
  'load-view': '[data-load]',
  'load-view-reload': '[data-reload]',
  'load-view-dataset-key': 'load',
  'load-view-load-every-dataset-key': 'loadEvery',
  'load-view-reload-dataset-key': 'reload'
};

module.exports = SelectorList;

},{}],22:[function(require,module,exports){
function Pane(target, parent) {
  this.target = target;
  this.parent = parent;
  this.controlledBy = target.dataset.controlledBy;
}

Pane.prototype.render = function() {
};

module.exports = Pane;
},{}],23:[function(require,module,exports){
var forEach = require('../for-each');

var Control = function TabViewControl(target, parent) {
  var tabViewControl;
  
  tabViewControl = this;
  tabViewControl.target = target;
  tabViewControl.parent = parent;
  tabViewControl.labelText = tabViewControl.target.innerText.replace(/\s+/g, ' ').trim();
  
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

},{"../for-each":10}],24:[function(require,module,exports){
(function (global){
var initializeViews = require('../initialize-views'),
    SelectorList = require('../selector-list'),
    forEach = require('../for-each'),
    CyclingView = require('../cycling-view'),
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
  this.panes = initializeViews(SelectorList['tab-view-pane'], TabView.Pane, optionsForSubview);
  this.tabViewControls = initializeViews(SelectorList['tab-view-control'], TabView.Control, optionsForSubview);
  
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
    if (control === activeControl) {
      control.target.classList.add(classNames.active);
    } else {
      control.target.classList.remove(classNames.active);
    }
  });
};

if (global.skipInitializeViews !== true) {
  initializeViews(SelectorList['tab-view'], TabView);
  
  global.addEventListener('xhr:load', function() {
    initializeViews(SelectorList['tab-view'], TabView);
  });
}

module.exports = TabView;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../class-names":1,"../cycling-view":5,"../dispatch-event":7,"../for-each":10,"../initialize-views":15,"../selector-list":21,"./Pane.js":22,"./control.js":23}],25:[function(require,module,exports){
module.exports = '0.0.1';

},{}],26:[function(require,module,exports){
function xhr(method, url, data, callback) {
  var xhr;
  
  if (arguments.callee.disabled) return;
  
  xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.addEventListener('readystatechange', function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      callback(xhr.status, xhr.responseText, xhr);
    }
  });
  
  xhr.send(data);
}

module.exports = xhr;

},{}],27:[function(require,module,exports){
var dispatchEvent = require('../dispatch-event');

function loadInnerHTML(target, html) {
  var callback;
  target.innerHTML = html;
  loadCallback = target.dataset.loadCallback;
  callback = eval(loadCallback);
  if (typeof callback === 'function') { setTimeout(callback, 100); }
  dispatchEvent(target, 'xhr:load', { bubbles: true });
}


module.exports = loadInnerHTML;
},{"../dispatch-event":7}]},{},[14]);
