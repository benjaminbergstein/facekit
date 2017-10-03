var forEach = require('../for-each');

Control = function TabViewControl(target, parent) {
  var tabViewControl;
  
  tabViewControl = this;
  tabViewControl.target = target;
  tabViewControl.parent = parent;
  tabViewControl.labelText = tabViewControl.target.innerText.trim();
  
  forEach(tabViewControl.parent.panes, function(pane) {
    var text;
    text = pane.dataset.controlledBy;
    
    if (tabViewControl.labelText === text) {
      tabViewControl.pane = pane;
    }
  });
};

Control.prototype.render = function() {
  var control, tabView;
  control = this;
  tabView = control.parent;
  
  control.target.addEventListener('click', function() {
    tabView.resetControls({ active: control });
    tabView.resetPanes({ visible: control.pane });
  });
};

Control.prototype.isActive = function(labelText) {
  var isActive;
  isActive = this.labelText === labelText;
  return this.labelText === labelText;
};

module.exports = Control;
