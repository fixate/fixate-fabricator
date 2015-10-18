'use strict';

var ComputedStyle = (function() {
  var ComputedStyle = function(elems) {
    this.elems = elems;

    [].slice.call(elems).map(function(elem) {
      this._outPutSize(elem);
    }.bind(this));
  }

  ComputedStyle.prototype._outPutSize = function(el) {
    var elem = el.firstElementChild ? el.firstElementChild : el;

    elem.innerHTML += ' - ' + this._getComputedStyle(el);
  }

  ComputedStyle.prototype._getComputedStyle = function(el) {
    var prop = el.getAttribute(['data-computed-value']);

    return window.getComputedStyle(el)[prop];
  }

  return ComputedStyle;
})();

window.ComputedStyle = ComputedStyle;

