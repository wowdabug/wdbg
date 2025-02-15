angular.module('HexaClicker')
    .directive('clicker', function() {
        return {
            scope: true,
            templateUrl: 'js/directive/clicker.html',
            link: function link(scope, element, attrs) {
                scope.onClick = function() {
                    scope.click();
                }
            }
        };
    });