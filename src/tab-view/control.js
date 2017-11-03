var forEach = require('../for-each');

var Control = function TabViewControl(target, parent) {
  var tabViewControl;
  
  tabViewControl = this;
  tabViewControl.target = target;
  tabViewControl.parent = parent;
  tabViewControl.labelText = tabViewControl.target.innerText.replace(/\s+/g, ' ').trim();
  
  forEach(tabViewControl.parent.panes, function(pane) {
    var text;
    text = pane.controlledBy;
    
    if (tabViewControl.labelText === text) {
      tabViewControl.pane = pane;
      pane.control = tabViewControl;
    }
  });
};

Control.prototype.render = function() {
  var control, tabView;
  control = this;
  tabView = control.parent;
  
  control.target.addEventListener('keyup', function(e) {
    var keyCode;
    
    keyCode = e.keyCode;
    
    if (keyCode === 37 || keyCode === 38) {
      tabView.previousTab(control);
    } else if (keyCode === 39 || keyCode === 40) {
      tabView.nextTab(control);
    }
  });
  
  control.target.addEventListener('click', function() {
    var link;
    
    if (control.target.tagName === 'A') {
      link = control.target;
    } else {
      link = control.target.querySelector('a');
    }
    
    if (link) link.focus();
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
