function xhr(method, url, data, callback) {
  var xhr;
  
  if (arguments.callee.disabled) return;
  
  xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.addEventListener('readystatechange', function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      callback(xhr.status, xhr.responseText, xhr);
    }
  });
  
  xhr.send(data);
}

module.exports = xhr;
