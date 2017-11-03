var dispatchEvent = require('./dispatch-event');
var initializeViews = require('./initialize-views');

function ForwardEventView(target) {
  this.target = target;
}

ForwardEventView.prototype.render = function() {
  var target, setting;
  
  target = this.target;
  setting = this.target.dataset.forwardEvent;
  setting = setting.split(/ ?=> ?/);
  
  target.addEventListener(setting[0], function() {
    dispatchEvent(target, setting[1], { bubbles: true });
  });
};

if (global.skipInitializeViews !== true) {
  initializeViews('[data-forward-event]', ForwardEventView);
}

module.exports = ForwardEventView;
