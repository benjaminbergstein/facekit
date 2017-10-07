var initializeViews = require('./initialize-views');

function Control(target, parent) {
  this.target = target;
  this.parent = parent;
  this.action = this.target.dataset.modalViewControl;
}

Control.prototype.render = function() {
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

Control.prototype.activate = function() {
  this.target.classList.add('is-active');
};

Control.prototype.deactivate = function() {
  this.target.classList.remove('is-active');
};

function ModalView(target) {
  this.target = target;
}

ModalView.prototype.render = function() {
  var subviewOptions;
  subviewOptions = { parent: this };
  initializeViews('[data-modal-view-control]', Control, subviewOptions);
  this.subjects = initializeViews('[data-modal-view-subject]', Control, subviewOptions);
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
