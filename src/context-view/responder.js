var SelectorList = require('../selector-list'),
    classNames = require('../class-names');

function ContextViewResponder(target, parent) {
  this.target = target;
  this.parent = parent;
}

ContextViewResponder.prototype.render = function() {
  var responder, dataset, datasetKey;
  
  responder = this;
  dataset = responder.target.dataset;
  datasetKey = SelectorList['context-view-responder-dataset-key'];
  responder.contextName = dataset[datasetKey];
};

ContextViewResponder.prototype.toggle = function(contextName) {
  var classList;
  
  classList = this.target.classList;
  
  if (this.contextName === contextName) {
    classList.remove(classNames['hidden']);
  } else {
    classList.add(classNames['hidden']);
  }
};

module.exports = ContextViewResponder;