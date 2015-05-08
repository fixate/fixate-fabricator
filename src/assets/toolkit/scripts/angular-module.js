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
