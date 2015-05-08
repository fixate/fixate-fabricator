;(function() {
  var Trigger = (function() {
    var Trigger = function(triggerEl) {
      this.trigger = triggerEl;
      this.target = document.querySelector(this.trigger.getAttribute('data-target'));
      this.targetClass = this.trigger.getAttribute('data-target-class');
      this.timeout = this.trigger.getAttribute('data-trigger') || 2000;
      this._init();
    }

    Trigger.prototype._init = function() {
      document.addEventListener('click', this._handleClick.bind(this));
    }

    Trigger.prototype._handleClick = function(e) {
      if (e.target === this.trigger) {
        this._addClass();
        setTimeout(this._removeClass.bind(this), this.timeout);
      }
    }

    Trigger.prototype._addClass = function() {
      this.target.classList.add(this.targetClass);
    }

    Trigger.prototype._removeClass = function() {
      this.target.classList.remove(this.targetClass);
    }

    return Trigger;
  })();

  new Trigger(document.querySelector('[data-trigger]'));
})();
