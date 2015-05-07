/**
 * Toolkit JavaScript
 */

'use strict';

angular.module('f', [
  'ngAnimate'
])
  // we need to differentiate angular's properties from handlebars
  .config(
    ['$interpolateProvider',
    function($interpolateProvider) {
      $interpolateProvider.startSymbol('{[{');
      $interpolateProvider.endSymbol('}]}');
    }
  ]);

require('./animations');
require('./layout');
require('./progress');
