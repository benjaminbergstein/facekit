function Control(target, parent) {
  this.target = target;
  this.parent = parent;
}

Control.prototype.render = function() {
  var control;
  control = this;
  control.target.addEventListener('click', function() {
    control.parent.toggle();
  });
};

module.exports = Control;
