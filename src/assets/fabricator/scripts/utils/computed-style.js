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
    return window.getComputedStyle(el)[el.getAttribute(['data-style-props'])];
  }

  return ComputedStyle;
})();

window.ComputedStyle = ComputedStyle;
