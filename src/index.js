Facekit = {};

Facekit.version = require('./version');

Facekit.setFrameworkBulma = require('./frameworks/bulma');
Facekit.setFrameworkBootstrap = require('./frameworks/bootstrap');

Facekit.initializeViews = require('./initialize-views');
Facekit.SelectorList = require('./selector-list');
Facekit.classNames = require('./class-names');

Facekit.ContextView = require('./context-view');
Facekit.DismissView = require('./dismiss-view');
Facekit.DropdownView = require('./dropdown-view');
Facekit.ForwardEventView = require('./forward-event-view');
Facekit.LoadView = require('./load-view');
Facekit.ModalView = require('./modal-view');
Facekit.PanelView = require('./panel-view');
Facekit.TabView = require('./tab-view');

Facekit.setFrameworkBulma();

module.exports = Facekit;
