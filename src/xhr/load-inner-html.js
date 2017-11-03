var dispatchEvent = require('../dispatch-event');

function loadInnerHTML(target, html) {
  var callback;
  target.innerHTML = html;
  loadCallback = target.dataset.loadCallback;
  callback = eval(loadCallback);
  if (typeof callback === 'function') { setTimeout(callback, 100); }
  dispatchEvent(target, 'xhr:load', { bubbles: true });
}


module.exports = loadInnerHTML;