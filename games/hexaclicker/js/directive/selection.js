angular.module('HexaClicker')
    .directive('selection', function() {
        return {
            scope: true,
            templateUrl: 'js/directive/selection.html',
            link: function link(scope, element, attrs) {
                scope.sell = function() {
                    if(scope.selectedSlot.hexaEntity.cooldown == 0) {
                        scope.sellSlot(scope.selectedSlot);
                        scope.selectSlot(undefined);
                    }
                }

                scope.nextDps = function() {
                    return scope.selectedSlot.hexaEntity.hexa.calcDps(scope.selectedSlot.hexaEntity.level + 1);
                }

                scope.dps = function() {
                    return scope.selectedSlot.hexaEntity.hexa.calcDps(scope.selectedSlot.hexaEntity.level);
                }

                scope.upgrade = function() {
                    console.log('Upgrade ', scope.selectedSlot.hexaEntity.calcUpgrade());
                    if(scope.canUpgrade()) {
                        scope.Status.credit -= scope.selectedSlot.hexaEntity.calcUpgrade();
                        scope.selectedSlot.hexaEntity.upgrade();
                    }

                }

                scope.activate = function() {
                    scope.activateSlot(scope.selectedSlot);
                }

                scope.canUpgrade = function() {
                    return scope.Status.credit >= scope.selectedSlot.hexaEntity.calcUpgrade();
                }
            }
        };
    });