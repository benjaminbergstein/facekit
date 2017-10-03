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
