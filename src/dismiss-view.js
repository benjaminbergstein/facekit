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
