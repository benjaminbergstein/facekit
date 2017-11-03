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
