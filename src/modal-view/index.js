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

if (global.doInitializeViews) {
  initializeViews(SelectorList['modal-view'], ModalView);
}

module.exports = ModalView;
