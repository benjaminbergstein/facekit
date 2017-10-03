function Pane(target, parent) {
  this.target = target;
  this.parent = parent;
  this.controlledBy = target.dataset.controlledBy;
}

Pane.prototype.render = function() {
};

module.exports = Pane;