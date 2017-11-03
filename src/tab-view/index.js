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
