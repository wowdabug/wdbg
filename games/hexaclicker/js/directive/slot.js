angular.module('HexaClicker')
    .directive('slot', function() {
        return {
            templateUrl: 'js/directive/slot.html',
            scope: true,
            link: function(scope, element, attrs) {

                scope.slot = scope.Grid.getGrid().getSlot(attrs.slotId);

                scope.$on('gridchange', function(event) {
                    scope.slot = scope.Grid.getGrid().getSlot(attrs.slotId);
                });

                scope.select = function(event) {
                    if(event.ctrlKey) {
                        scope.activateSlot(scope.slot);
                    } else if(event.shiftKey) {
                        scope.upgradeSlot(scope.slot);
                    } else {
                        scope.selectSlot(scope.slot);
                    }
                }

                scope.buy = function() {
                    scope.buyHexa(scope.slot);
                }

                scope.isHighlighted = function() {
                    return scope.highlighted.indexOf(scope.slot.id) != -1
                        && (scope.slot.hexaEntity == undefined || scope.slot.hexaEntity.hexa.type == 1 );
                }
            }
        };
    });