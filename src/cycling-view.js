function CyclingView(items) {
  this.items = items;
}

CyclingView.prototype.advance = function(targetItem, numberToAdvance) {
  var items, currentItemIndex, totalItems, nextItemIndex;
  items = this.items;
  currentItemIndex = items.indexOf(targetItem);
  totalItems = items.length;
  nextItemIndex = (currentItemIndex + numberToAdvance) % totalItems;
  if (nextItemIndex < 0) nextItemIndex = totalItems - 1;
  return items[nextItemIndex];
};

module.exports = CyclingView;