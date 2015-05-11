'use strict';

/*
 * temporarily set a class on a target via a trigger
 *
 * useful for temporarily showing loaders
 */
var ClassnameTimeout = (function() {
  var ClassnameTimeout = function(triggerEl) {
    this.trigger = triggerEl;
    this.target = document.querySelector(this.trigger.getAttribute('data-target'));
    this.targetClass = this.trigger.getAttribute('data-timed-class');
    this.timeout = this.trigger.getAttribute('data-timeout') || 2000;
    this._init();
  }

  ClassnameTimeout.prototype._init = function() {
    document.addEventListener('click', this._handleClick.bind(this));
  }

  ClassnameTimeout.prototype._handleClick = function(e) {
    if (e.target === this.trigger) {
      this._addClass();
      setTimeout(this._removeClass.bind(this), this.timeout);
    }
  }

  ClassnameTimeout.prototype._addClass = function() {
    this.target.classList.add(this.targetClass);
  }

  ClassnameTimeout.prototype._removeClass = function() {
    this.target.classList.remove(this.targetClass);
  }

  return ClassnameTimeout;
})();

window.ClassnameTimeout = ClassnameTimeout;
