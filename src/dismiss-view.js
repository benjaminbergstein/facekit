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
