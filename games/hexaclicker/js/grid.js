angular.module('HexaClicker')
    .service('Grid', ['$rootScope', function($rootScope){

        this.grids = [];
        this.currentGrid = 0;

        var POSITIONMAP_DEFAULT = {
            "-3": {
                "0": 34,
                "1": 33,
                "2": 32,
                "3": 31
            },
            "-2": {
                "-1": 35,
                "0": 17,
                "1": 16,
                "2": 15,
                "3": 30
            },
            "-1": {
                "-2": 36,
                "-1": 18,
                "0": 6,
                "1": 5,
                "2": 14,
                "3": 29
            },
            "0": {
                "-3": 19,
                "-2": 7,
                "-1": 1,
                "0": 0,
                "1": 4,
                "2": 13,
                "3": 28
            },
            "1": {
                "-3": 20,
                "-2": 8,
                "-1": 2,
                "0": 3,
                "1": 12,
                "2": 27
            },
            "2": {
                "-3": 21,
                "-2": 9,
                "-1": 10,
                "0": 11,
                "1": 26
            },
            "3": {
                "-3": 22,
                "-2": 23,
                "-1": 24,
                "0": 25
            }
        }

        this.grids.push(new Grid());

        this.createGrid = function() {
            this.grids.push(new Grid());
        }

        this.getGrid = function() {
            return this.grids[this.currentGrid];
        }

        this.setGrid = function(index) {
            this.currentGrid = index;
            $rootScope.$broadcast('gridchange');
        }

        this.getDPS = function(withEffects) {
            var sum = 0;
            this.grids.forEach(function(grid) {
                sum += grid.getDPS(withEffects);
            });
            return Math.floor(sum);
        }

        function Slot(id, tier) {
            this.id = id;
            this.tier = tier;

            this.hexaEntity = undefined;
            this.effects = [];

            this.setHexaEntity = function(hexaEntity) {
                this.hexaEntity = hexaEntity;
            }

            this.getPosition = function() {
                for(var i = -3; i < 4; i++) {
                    for(var j = -3; j < 4; j++) {
                        if(POSITIONMAP_DEFAULT[i][j] != undefined && POSITIONMAP_DEFAULT[i][j] == this.id) {
                            return {q: i, r: j};
                        }
                    }
                }
            }

            this.getDPS = function(withEffects) {
                if(this.hexaEntity == undefined) {
                    return 0;
                }
                var sum = 0;
                sum += this.hexaEntity.getDPS();

                if(withEffects) {
                    this.effects.forEach(function(affectingSlot) {
                        if(affectingSlot.hexaEntity && affectingSlot.hexaEntity.hexa.effect) {
                            sum *= affectingSlot.hexaEntity.hexa.effect.DPS;
                        }
                    });
                }

                return sum;
            }

            this.getAffectedPositions = function() {
                return this.hexaEntity.hexa.getAffectedPositions(this.getPosition());
            }
        }

        function Grid() {
            this.slots = [];

            var me = this;
            _.range(0,7).forEach(function(num) {
                me.slots.push(new Slot(num, 1));
            });

            _.range(7,19).forEach(function(num) {
                me.slots.push(new Slot(num, 2));
            });

            _.range(19,37).forEach(function(num) {
                me.slots.push(new Slot(num, 3));
            });

            this.positionMap = POSITIONMAP_DEFAULT;

            this.getDPS = function(withEffects){
                var sum = 0;
                this.slots.forEach(function(slot) {
                    if(slot.hexaEntity && slot.hexaEntity.hexa.type == 1){
                        sum += slot.getDPS(withEffects);
                    }
                });

                return Math.floor(sum);
            }

            this.getSlot = function(id) {
                return this.slots.filter(function(slot) {
                    return slot.id == id;
                })[0];
            }

            this.getSlotByPos = function(position) {
                return this.getSlot(this.positionMap[position.q][position.r]);
            }

            this.emptySlotCount = function(tier) {
                var empty = this.slots.filter(function(slot){
                    return slot.hexaEntity == undefined && slot.tier <= tier;
                }).length;
                //exclude clicker
                return empty - 1;
            }

            this.getAffectedSlots = function(slot) {
                var slots = [];
                if(slot.hexaEntity != undefined && slot.hexaEntity.hexa.getAffectedPositions) {
                    var affected = slot.getAffectedPositions();
                    affected.forEach(function(position) {
                        var affectedSlot = me.getSlotByPos(position);
                        if(affectedSlot != undefined) {
                            slots.push(affectedSlot);
                        }
                    });
                }

                return slots;
            }

            this.maxUpgrades = function() {
                switch (this.tier) {
                    case 1:
                        return 1;
                    case 2:
                        return 3;
                    case 3:
                        return 6;
                }
            }
        }
    }]);