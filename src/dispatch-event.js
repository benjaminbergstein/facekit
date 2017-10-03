function dispatchEvent(target, eventType, options) {
  // CustomEvent is not available in phantomjs v1.9.8, and file uploads down work with v2+.
  if (typeof CustomEvent === 'function') {
    event = new CustomEvent(eventType, options);
  } else {
    event = document.createEvent('CustomEvent');
    event.initEvent(eventType, options.bubbles, options.cancelable);
  }
  
  target.dispatchEvent(event);
}

module.exports = dispatchEvent;
