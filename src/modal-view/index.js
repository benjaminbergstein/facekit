var initializeViews = require('../initialize-views'),
    ModalControl = require('./control');

function ModalView(target) {
  this.target = target;
}

ModalView.prototype.render = function() {
  var subviewOptions;
  subviewOptions = { parent: this };
  initializeViews('[data-modal-view-control]', ModalControl, subviewOptions);
  this.subjects = initializeViews('[data-modal-view-subject]', ModalControl, subviewOptions);
};

ModalView.prototype.activate = function() {
  this.subjects[0].activate();
};

ModalView.prototype.deactivate = function() {
  this.subjects[0].deactivate();
};

if (global.doInitializeViews) {
  initializeViews('[data-modal-view]', ModalView);
}

module.exports = ModalView;
