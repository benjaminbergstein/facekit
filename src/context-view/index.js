var initializeViews = require('../initialize-views'),
    SelectorList = require('../selector-list'),
    forEach = require('../for-each');

function ContextView(target) {
  this.target = target;
}

ContextView.Control = require('./control');
ContextView.Responder = require('./responder');

ContextView.prototype.render = function() {
  initializeViews(
    SelectorList['context-view-control'],
    ContextView.Control,
    { parent: this }
  );
  
  this.responders = initializeViews(
    SelectorList['context-view-responder'],
    ContextView.Responder,
    { parent: this }
  );
};

ContextView.prototype.setContext = function(contextName) {
  forEach(this.responders, function(responder) {
    responder.toggle(contextName);
  });
};

if (global.skipInitializeViews !== true) {
  initializeViews(
    SelectorList['context-view'],
    ContextView
  );
}

module.exports = ContextView;
