'use strict';

var ColorBlocks = (function() {
  var ColorBlocks = function(blockEls) {
    this.blocks = blockEls;

    [].slice.call(this.blocks).forEach(this._outputColor.bind(this));
  }

  ColorBlocks.prototype._outputColor = function(el) {
    var colorEl = el.querySelector(el.getAttribute(['data-color-block'])),
      textEl = this._getOutputEl(el),
      hex = this._rgbToHex(this._getRgb(colorEl));

    textEl.innerHTML += ' <br> ' + hex;
  }

  ColorBlocks.prototype._getRgb = function(el) {
    return window.getComputedStyle(el)['background-color'];
  }

  ColorBlocks.prototype._getOutputEl = function(el) {
    return el.querySelector(el.getAttribute(['data-color-output']));
  }

  ColorBlocks.prototype._rgbToHex = function(rgb) {
    rgb = rgb.match(/^rgba?((\d+),\s(\d+),\s(\d+)(,\s(\d+\.?\d+))?)$/);

    return "#" + this._getHex(rgb[1]) + this._getHex(rgb[2]) + this._getHex(rgb[3]);
  }

  ColorBlocks.prototype._getHex = function(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }

  return ColorBlocks;
})();

window.ColorBlocks = ColorBlocks;
