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
