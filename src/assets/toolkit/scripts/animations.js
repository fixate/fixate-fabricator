angular.module('f')

  .directive('animElement', function() {
    return {
      restrict: 'AE',
      require: 'animElement',
      scope: {
        animClass: '=ngClass'
      },
      controller: [
        '$scope', function($scope) {
          this.replay = function() {
            return $scope.replay = !$scope.replay;
          };
        }
      ],
      link: function(scope, element, attrs, ctrl) {
        if (attrs.animElement != null) {
          scope.$parent[attrs.animElement] = ctrl;
        }
        scope.$watch('replay', function() {
          return element.addClass(scope.animClass).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animatinend', (function(_this) {
            return function() {
              return element.removeClass(scope.animClass);
            };
          })(this));
        });
        return scope.$watch('animClass', function(newVal, oldVal) {
          return ctrl.replay();
        });
      }
    };
  });
