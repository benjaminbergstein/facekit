var classNames = require('../class-names');

function ModalControl(target, parent) {
  this.target = target;
  this.parent = parent;
  this.action = this.target.dataset.modalViewControl;
}

ModalControl.prototype.render = function() {
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

ModalControl.prototype.activate = function() {
  this.target.classList.add(classNames.active);
};

ModalControl.prototype.deactivate = function() {
  this.target.classList.remove(classNames.active);
};

module.exports = ModalControl;
