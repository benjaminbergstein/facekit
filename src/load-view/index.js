var initializeViews = require('../initialize-views'),
    SelectorList = require('../selector-list'),
    xhr = require('../xhr'),
    loadInnerHTML = require('../xhr/load-inner-html');

function LoadView(target) {
  this.target = target;
  this.url = target.dataset[SelectorList['load-view-dataset-key']];
  this.loadEvery = target.dataset[SelectorList['load-view-load-every-dataset-key']];
  this.isForm = this.target.tagName === 'FORM';
}

LoadView.Control = require('./control');

LoadView.prototype.render = function() {
  var view, target;
  
  view = this;
  target = view.target;
  view.renderSubviews();
  view.load();
  
  target.addEventListener('xhr:load', function() {
    view.renderSubviews();
  });
  
  target.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    var formData;
    
    formData = new FormData(target);
    
    xhr(target.method || 'GET', target.action, formData, function(status, html, xhr) {
      loadInnerHTML(target, html);
    });
  });
};

LoadView.prototype.renderSubviews = function() {
  initializeViews(SelectorList['load-view-reload'], LoadView.Control, { parent: this });
};

LoadView.prototype.load = function() {
  var view;
  
  view = this;
  
  if (view.url === "" && view.isForm) return;
  
  xhr('GET', view.url, undefined, function (status, html, xhr) {
    loadInnerHTML(view.target, html);
    
    if (view.loadEvery) {
      setTimeout(function() { view.load(); }, view.loadEvery);
    }
  });
};

if (global.skipInitializeViews !== true) {
  initializeViews(SelectorList['load-view'], LoadView);
}
