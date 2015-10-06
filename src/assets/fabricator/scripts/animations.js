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
          this.animate = function() {
            $scope.$broadcast('animElement:animate')
          };
        }
      ],
      link: function(scope, element, attrs, ctrl) {
        var animEnd = [
          'webkitAnimationEnd',
          'mozAnimationEnd',
          'MSAnimationEnd',
          'oanimationend',
          'animationend'
        ].join(' ');

        var animateOnce = function(e) {
          element.addClass(e.targetScope.animClass)
            .one(animEnd, function() {
              element.removeClass(e.targetScope.animClass);
            }
          );
        }

        if (attrs.animElement != null) {
          scope.$parent[attrs.animElement] = ctrl;
        }

        scope.$on('animElement:animate', animateOnce);
      }
    };
  });

