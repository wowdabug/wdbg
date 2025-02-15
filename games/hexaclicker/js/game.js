angular.module('HexaClicker', [])
    .controller('GameCtrl', ['$scope', '$interval', '$window', 'Progress', 'Grid', 'Data', 'Status', function($scope, $interval, $window, Progress, Grid, Data, Status) {

        $scope.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

        $scope.Grid = Grid;

        $scope.Grid.setGrid(0);

        $scope.Progress = Progress.getProgress();

        $scope.Progress.setLevel(1);

        $scope.Status = Status.getStatus();

        $scope.Data = Data;

        $scope.selectedHexaForPurchase = undefined;

        $scope.selectedSlot = undefined;

        $scope.selectSlot = function(slot) {
            $scope.selectedSlot = slot;
        }

        var pushEffect = function(slot, affectingSlot) {
            var alreadyAffecting = false;
            slot.effects.forEach(function(as) {
                if(as.id == affectingSlot.id) {
                    alreadyAffecting = true;
                }
            });

            if(!alreadyAffecting) {
                slot.effects.push(affectingSlot);
            }
        }

        $scope.buyHexa = function(slot) {
            if($scope.selectedHexaForPurchase.type == Hexa.TYPE.DPS) {
                if($scope.selectedHexaForPurchase.price <= $scope.Status.credit) {
                    slot.setHexaEntity(new HexaEntity($scope.selectedHexaForPurchase));
                    $scope.Status.credit -= $scope.selectedHexaForPurchase.price;
                    $scope.canContinuePurchase();
                }
            } else if($scope.selectedHexaForPurchase.type == Hexa.TYPE.UTILITY) {
                if($scope.Status.utility > 0) {

                    slot.setHexaEntity(new HexaEntity($scope.selectedHexaForPurchase));
                    $scope.Status.utility -= 1;

                    //Activate passive effect
                    if($scope.selectedHexaForPurchase.type == 2 && !$scope.selectedHexaForPurchase.active) {
                        $scope.Grid.getGrid().getAffectedSlots(slot).forEach(function(affectedSlot) {
                            pushEffect(affectedSlot, slot);
                        });
                    }

                    $scope.canContinuePurchase();
                }
            }
        }

        $scope.sellSlot = function(slot) {
            if(slot.hexaEntity.hexa.type == Hexa.TYPE.DPS) {
                $scope.Status.addCredit(slot.hexaEntity.sellPrice());
            } else if(slot.hexaEntity.hexa.type == Hexa.TYPE.UTILITY) {
                $scope.Status.utility += 1;
            }

            removeEffectOfSlot(slot);

            slot.hexaEntity = undefined;
        }

        var removeEffectOfSlot = function(slot, grid) {
            if(grid == null) {
                grid = $scope.Grid.getGrid();
            }
            grid.getAffectedSlots(slot).forEach(function(affectedSlot) {
                affectedSlot.effects.forEach(function(affectingSlot, index){
                    if(affectingSlot.id == slot.id) {
                        affectedSlot.effects.splice(index, 1);
                    }
                });
            });
        }

        $scope.highlight = function(slot) {
            $scope.Grid.getGrid().getAffectedSlots(slot).forEach(function(highlightedSlot) {
                $scope.highlighted.push(highlightedSlot.id);
            });
        }

        $scope.activateSlot = function(activatedSlot) {
            if(activatedSlot.hexaEntity.hexa.active && activatedSlot.hexaEntity.cooldown == 0) {
                var affected = activatedSlot.getAffectedPositions();
                affected.forEach(function(position) {
                    var slot = $scope.Grid.getGrid().getSlotByPos(position);
                    if(slot != undefined) {
                        pushEffect(slot, activatedSlot);
                    }
                });

                activatedSlot.hexaEntity.activateTimers();
            }
        }

        $scope.upgradeSlot = function(slot) {
            if($scope.Status.credit >= slot.hexaEntity.calcUpgrade()) {
                $scope.Status.credit -= slot.hexaEntity.calcUpgrade();
                slot.hexaEntity.upgrade();
            }
        }

        $scope.clearHighlight = function() {
            $scope.highlighted = [];
        }

        $scope.highlighted = [];

        $scope.selectedPurchaseList = 1;

        $scope.click = function() {
            $scope.Progress.currentLevel.dealDamage(5 + $scope.Grid.getGrid().getDPS() * 0.1);
        }

        $scope.toggleProgress = function() {
            $scope.Progress.progressMode = !$scope.Progress.progressMode;
        }

        $scope.canContinuePurchase = function() {
            if($scope.Grid.getGrid().emptySlotCount($scope.Status.tier) == 0
                || ($scope.selectedHexaForPurchase.type == Hexa.TYPE.DPS && $scope.Status.credit < $scope.selectedHexaForPurchase.price)
                || ($scope.selectedHexaForPurchase.type == Hexa.TYPE.UTILITY && $scope.Status.utility < 1)) {
                $scope.selectedHexaForPurchase = undefined;
            }
        }

        $scope.checkAchievedHexas = function() {
            var hexas = $scope.Data.getHexas(Hexa.TYPE.DPS);
            hexas.forEach(function(hexa, index) {
                if(index + 1 != hexas.length && hexa.price <= $scope.Status.credit && $scope.Status.achievedHexas.indexOf(hexas[index + 1].id) == -1) {
                    console.log("Achieved hexa: ", hexa.id);
                    $scope.Status.achievedHexas.push(hexas[index + 1].id);
                }
            });
        }

        $scope.checkUtility = function() {
            if($scope.Progress.maxLevel == $scope.Progress.currentLevel.level
                && $scope.Progress.currentLevel.level % 10 == 0) {
                $scope.Status.utility += $scope.Grid.grids.length;
            }
        }

        $scope.$on('kill', function(event) {
            console.log('onKill');
            $scope.Status.addCredit($scope.Progress.currentLevel.credit);
            $scope.checkAchievedHexas();
            $scope.checkUtility();
        });

        $scope.$on('purchase', function(event, hexa) {
            console.log('onPurchase', hexa);
            $scope.selectedHexaForPurchase = hexa;
        });

        $scope.$on('changelevel', function(event, level) {
            switch(level) {
                case 30:
                    $scope.Status.tier = 2;
                    break;
                case 60:
                    $scope.Status.tier = 3;
                    break;
            }
        });

        $scope.$on('gridchange', function(event) {
            $scope.selectedHexaForPurchase = undefined;
            $scope.selectedSlot = undefined;
        });

        //DPS
        var dpsTimestamp = Date.now();
        var dpsInterval = $interval(function(){
            $scope.Progress.currentLevel.dealDamage($scope.Grid.getDPS(true) * ((Date.now() - dpsTimestamp) / 1000));
            dpsTimestamp = Date.now();
        },100);

        var timerInterval = $interval(function(){
            $scope.Grid.grids.forEach(function(grid) {
                grid.slots.forEach(function(slot){
                    if(slot.hexaEntity) {
                        if(slot.hexaEntity.cooldown > 0) {
                            slot.hexaEntity.cooldown--;
                        }
                        if(slot.hexaEntity.duration > 0) {
                            slot.hexaEntity.duration--;
                            if(slot.hexaEntity.duration == 0) {
                                removeEffectOfSlot(slot, grid);
                            }
                        }
                    }
                });
            });

        },1000);

        $scope.saveGame = function(){
            var saveObj = {};

            //------
            saveObj.credit = $scope.Status.credit;
            saveObj.utility = $scope.Status.utility;
            saveObj.currentLevel = $scope.Progress.currentLevel.level;
            saveObj.maxLevel = $scope.Progress.maxLevel;
            saveObj.kills = $scope.Progress.currentLevel.kills;
            saveObj.currentHp = $scope.Progress.currentLevel.currentHp;
            saveObj.progressMode = $scope.Progress.progressMode;
            saveObj.achievedHexas = $scope.Status.achievedHexas;
            if($scope.Progress.currentLevel.bossTimer) {
                saveObj.bossTimer = $scope.Progress.currentLevel.bossTimer.time;
            }
            saveObj.tier = $scope.Status.tier;

            var grids = [];
            $scope.Grid.grids.forEach(function(grid) {
                var gridsave = { slots: []};

                grid.slots.forEach(function(slot) {
                    var slotsave = { effects: [] };

                    if(slot.hexaEntity) {
                        slotsave.hexaEntity = {hexaId: slot.hexaEntity.hexa.id, level: slot.hexaEntity.level,
                            cooldown: slot.hexaEntity.cooldown, duration: slot.hexaEntity.duration};
                    }

                    slot.effects.forEach(function(effectslot) {
                        slotsave.effects.push(effectslot.id);
                    })

                    gridsave.slots.push(slotsave);
                });

                grids.push(gridsave);
            })

            saveObj.grids = grids;

            //------
            //console.log("Save: ", saveObj);
            window.localStorage.setItem("hexaclickersave", JSON.stringify(saveObj));
            window.localStorage.setItem("hexaclickersaveversion", $scope.SAVE_VERSION);
        }

        $scope.loadGame = function(){
            var saveVersion = window.localStorage.getItem("hexaclickersaveversion");

            //REWARD
            $scope.rewardOldPlayers(saveVersion);

            var saveObj = JSON.parse(window.localStorage.getItem("hexaclickersave"));
            if(saveObj != undefined && saveVersion != undefined && saveVersion >= $scope.SAVE_VERSION) {
                console.log("LOAD: ", saveObj);

                $scope.Status.credit = saveObj.credit;
                $scope.Status.utility = saveObj.utility;
                $scope.Progress.setLevel(saveObj.currentLevel);
                $scope.Progress.maxLevel = saveObj.maxLevel;
                $scope.Progress.currentLevel.kills = saveObj.kills;
                $scope.Progress.currentLevel.currentHp = saveObj.currentHp;
                $scope.Progress.progressMode = saveObj.progressMode;
                $scope.Status.achievedHexas = saveObj.achievedHexas;
                if(saveObj.bossTimer) {
                    $scope.Progress.currentLevel.startBossTimer(saveObj.bossTimer);
                }
                $scope.Status.tier = saveObj.tier;

                if(saveObj.grids.length > 1) {
                    for(var i = 0; i < saveObj.grids.length - 1; i++) {
                        $scope.Grid.createGrid();
                    }
                }

                saveObj.grids.forEach(function(gridsave, gindex){
                    gridsave.slots.forEach(function(slotsave, sindex) {
                        var slot = $scope.Grid.grids[gindex].slots[sindex];

                        if(slotsave.hexaEntity) {
                            slot.hexaEntity = new HexaEntity($scope.Data.getHexa(slotsave.hexaEntity.hexaId));
                            slot.hexaEntity.level = slotsave.hexaEntity.level;
                            slot.hexaEntity.cooldown = slotsave.hexaEntity.cooldown;
                            slot.hexaEntity.duration = slotsave.hexaEntity.duration;
                        }

                        slotsave.effects.forEach(function(id) {
                            pushEffect(slot, $scope.Grid.grids[gindex].slots[id]);
                        });
                    });
                });
            } else {
                console.log('NO SAVE FOUND');
            }
        }

        $scope.SAVE_VERSION = 3;

        $scope.prettify = function(number) {
            return prettify(number);
        }

         var saveInterval = $interval(function(){
            $scope.saveGame();
         }, 1000);

        $scope.calcOfflineCredit = function() {
            var timestamp = window.localStorage.getItem('hexaclickertimestamp');
            if(timestamp != undefined){
                var hp = $scope.Progress.currentLevel.hp;
                var credit = $scope.Progress.currentLevel.credit;
                var elapsedTime = (Date.now() - timestamp) / 1000;
                var dps = $scope.Grid.getDPS(false);

                var dCredit = Math.floor(elapsedTime * dps / hp) * credit;
                console.log("Offline credit: ", dCredit);
                $scope.Status.credit += dCredit;
            }


            $interval(function() {
                window.localStorage.setItem('hexaclickertimestamp', Date.now());
            }, 1000);
        }

        $scope.resetGame = function() {
            if(confirm("Are you sure? You'll lose all your progress.")) {
                window.localStorage.removeItem("hexaclickersave");
                window.location.reload();
            }
        }

        $scope.createGrid = function() {
            if($scope.Progress.currentLevel.level > 80) {
                if(confirm("Are you sure? Your hexas and credit will disappear.")) {
                    $scope.softReset();
                    $scope.Grid.createGrid();
                }
            }
        }

        $scope.softReset = function() {
            $scope.Status.credit = 0;
            $scope.Status.utility = 0;
            $scope.Status.achievedHexas = [0, 25, 26, 27];
            $scope.Grid.currentGrid = 0;

            $scope.Progress.maxLevel = 1;
            if($scope.Progress.currentLevel.bossTimer) {
                $scope.Progress.currentLevel.bossTimer.cancel();
                $scope.Progress.currentLevel.bossTimer = undefined;
            }

            $scope.Progress.setLevel(1);
            $scope.Progress.currentLevel.kills = 0;

            $scope.Grid.grids.forEach(function(grid) {
                grid.slots.forEach(function(slot) {
                    slot.hexaEntity = undefined;
                    slot.cooldown = 0;
                    slot.duration = 0;
                    slot.effects = [];
                });
            });
        }

        $scope.rewardOldPlayers = function(saveVersion) {
            if(saveVersion && saveVersion < 3) {
                console.log("Save version: ", saveVersion);
                alert('Unfortunately your save version is incompatible with the new version of the game. You\'ve got a free grid as a reward for testing. Thank you :)');
                $scope.Grid.createGrid();
            }
        }

        $scope.exportSave = function() {
            var exportString = window.localStorage.getItem("hexaclickersave");
            window.prompt('Save string', Base64.encode(exportString));
        }

        $scope.importSave = function() {
            var importString = $window.prompt('Save string');
            var importDecoded = Base64.decode(importString);
            window.localStorage.setItem("hexaclickersave", importDecoded);
            window.location.reload();
        }

        $scope.loadGame();
        $scope.checkAchievedHexas();
        $scope.calcOfflineCredit();

    }])

    .filter('prettify', function(){
        return function(input) {
            return prettify(input);
        }
    })

    ;