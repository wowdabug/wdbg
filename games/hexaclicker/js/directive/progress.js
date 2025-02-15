angular.module('HexaClicker')
    .directive('progress', function() {
        return {
            scope: true,
            templateUrl: 'js/directive/progress.html',
            link: function link(scope, element, attrs) {

            }
        };
    });