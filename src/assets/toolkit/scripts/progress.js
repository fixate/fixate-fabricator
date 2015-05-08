;(function() {
  var TimedClassName = (function() {
    var TimedClassName = function(triggerEl) {
      this.trigger = triggerEl;
      this.target = document.querySelector(this.trigger.getAttribute('data-target'));
      this.targetClass = this.trigger.getAttribute('data-timed-class');
      this.timeout = this.trigger.getAttribute('data-timeout') || 2000;
      this._init();
    }

    TimedClassName.prototype._init = function() {
      document.addEventListener('click', this._handleClick.bind(this));
    }

    TimedClassName.prototype._handleClick = function(e) {
      if (e.target === this.trigger) {
        this._addClass();
        setTimeout(this._removeClass.bind(this), this.timeout);
      }
    }

    TimedClassName.prototype._addClass = function() {
      this.target.classList.add(this.targetClass);
    }

    TimedClassName.prototype._removeClass = function() {
      this.target.classList.remove(this.targetClass);
    }

    return TimedClassName;
  })();

  new TimedClassName(document.querySelector('[data-timed-class]'));
})();
