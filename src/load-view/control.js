var SelectorList = require('../selector-list');

function LoadViewControl(target, parent) {
  this.target = target;
  this.parent = parent;
}

LoadViewControl.prototype.render = function() {
  var target, parent, datasetKey, reloadUrl;
  
  target = this.target;
  parent = this.parent;
  datasetKey = SelectorList['load-view-reload-dataset-key'];
  reloadUrl = target.dataset[datasetKey];
  
  target.addEventListener('click', function () {
    parent.url = reloadUrl;
    parent.load();
  });
};

module.exports = LoadViewControl;
