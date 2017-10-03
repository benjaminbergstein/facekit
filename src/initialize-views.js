var forEach = require('./for-each');

function initializeViews(selector, viewClass, options) {
  var parent, parentTarget, viewTargets, initializedViews;
  
  if (!options) options = {};
  parent = options.parent;
  parentTarget = parent ? parent.target : document;
  viewTargets = parentTarget.querySelectorAll(selector);
  
  initializedViews = [];
  forEach(viewTargets, function(target) {
    var viewInstance;
    viewInstance = new viewClass(target, parent);
    viewInstance.render();
    initializedViews.push(viewInstance)
  });
  
  return initializedViews;
}

module.exports = initializeViews;