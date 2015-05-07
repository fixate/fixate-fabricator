// rewrite this whole thing without jquery

// var $html, $trigger, $triggerClass, listen, resetElem;

// listen = function(el, event, handler) {
//   if (el.addEventListener) {
//     return el.addEventListener(event, handler);
//   } else {
//     return el.attachEvent('on' + event, function() {
//       return handler.call(el);
//     });
//   }
// };

// html = document.documentElement;

// $trigger = $('.js-add-class');

// $triggerClass = $trigger.data('class');

// $trigger.on('click', function(e) {
//   $html.addClass($triggerClass);
//   setTimeout(function() {
//     return resetElem($html, $triggerClass);
//   }, 2000);
// });

// resetElem = function($elem, className) {
//   if ($elem.hasClass(className)) {
//     $elem.removeClass(className);
//   }
// };
