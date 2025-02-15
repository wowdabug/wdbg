angular.module('HexaClicker')
    .directive('purchase', ['$rootScope', function($rootScope) {
        return {
            templateUrl: 'js/directive/purchase.html',
            scope: true,
            link: function(scope, element, attrs) {
                scope.hexa = scope.Data.getHexa(attrs.hexaId);
                scope.name = attrs.hexaName;

                scope.ableToPurchase = function() {
                    if(scope.hexa.type == Hexa.TYPE.DPS) {
                        return scope.hexa.price <= scope.Status.credit;
                    } else if(scope.hexa.type == Hexa.TYPE.UTILITY) {
                        return scope.Status.utility > 0;
                    }
                }

                scope.achieved = function() {
                    return scope.Status.achievedHexas.indexOf(scope.hexa.id) != -1;
                }

                scope.purchase = function() {
                    if(scope.selectedHexaForPurchase == scope.hexa) {
                        $rootScope.$broadcast('purchase', undefined);
                        return;
                    }

                    if((scope.hexa.type == Hexa.TYPE.DPS && scope.hexa.price <= scope.Status.credit)
                        || (scope.hexa.type == Hexa.TYPE.UTILITY && scope.Status.utility > 0)) {
                        $rootScope.$broadcast('purchase', scope.hexa);
                    }
                }
            }
        };
    }]);