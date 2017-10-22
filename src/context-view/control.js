var SelectorList = require('../selector-list');

function Control(target, parent) {
  this.target = target;
  this.parent = parent;
}

Control.prototype.render = function() {
  var control, dataset, datasetKey;
  
  control = this;
  dataset = control.target.dataset;
  datasetKey = SelectorList['context-view-control-dataset-key'];
  control.contextName = dataset[datasetKey];
  
  control.target.addEventListener('click', function() {
    control.parent.setContext(control.contextName);
  });
};

module.exports = Control;