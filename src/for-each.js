function forEach(collection, callback) {
  var i, ii;
  for (i = 0, ii = collection.length; i < ii; i++) {
    callback(collection[i]);
  }
}

module.exports = forEach;
