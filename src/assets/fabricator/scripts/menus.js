window.onload = function() {
  if ($.fn.toggler) {
    var $elem;

    if ($elem = $('.js-menu-toggle')) {
      $elem.toggler({
        activeClass: 'is-open-menu'
      });
    }
  }
}

