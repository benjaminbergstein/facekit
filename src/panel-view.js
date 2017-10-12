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

if (global.doInitializeViews) {
  initializeViews(SelectorList['panel-view'], PanelView);
}

module.exports = PanelView;
