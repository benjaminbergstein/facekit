var forEach = require('./for-each'),
    dispatchEvent = require('./dispatch-event');

function initializeView(target, viewClass, parent, scope, parentTarget) {
  var viewInstance, possibleParents, respondingParent;
  
  if (parent) {
    possibleParents = document.querySelectorAll(scope);
    forEach(possibleParents, function(parent) {
      parent.addEventListener('parent:searching', function(e) {
        respondingParent = parent;
        e.stopPropagation();
      });
    });
    
    dispatchEvent(target, 'parent:searching', { bubbles: true, cancelable: true});
    if (respondingParent !== parentTarget) return false;
  }
  
  viewInstance = new viewClass(target, parent);
  viewInstance.render();
  return viewInstance;
}

function initializeViews(selector, viewClass, options) {
  var parent, scope, parentTarget, viewTargets, initializedViews;
  
  if (!options) options = {};
  parent = options.parent;
  scope = options.scope;
  parentTarget = parent ? parent.target : document;
  viewTargets = parentTarget.querySelectorAll(selector);
  
  initializedViews = [];
  forEach(viewTargets, function(target) {
    var viewInstance;
    viewInstance = initializeView(target, viewClass, parent, scope, parentTarget);
    
    if (viewInstance) {
      initializedViews.push(viewInstance);
    }
  });
  
  return initializedViews;
}

module.exports = initializeViews;