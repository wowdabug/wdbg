angular.module('HexaClicker')
    .service('Progress', ['$rootScope', '$interval', function($rootScope, $interval){
        Level.DIRECTION = {
            "FORWARD": 1,
            "BACKWARD": -1
        }

        Level.KILL = {
            "NORMAL": 10,
            "BOSS": 1
        }

        this.getProgress = function() {
            return new Progress();
        }

        function Progress() {
            this.currentLevel = undefined;
            this.maxLevel = 1;

            this.progressMode = true;

            this.setLevel = function(level) {
                this.currentLevel = this.getLevel(level);
                this.currentLevel.onKill = this.onKill;
                this.currentLevel.onBossFailed = this.onBossFailed;
            }

            this.changeLevel = function(direction) {
                var newLevel = this.currentLevel.level + direction;
                console.log("Change Level: ", newLevel);

                if(newLevel > 0 && newLevel <= this.maxLevel) {
                    if(this.currentLevel.bossTimer) {
                        this.currentLevel.bossTimer.cancel();
                        this.currentLevel.bossTimer = undefined;
                    }
                    this.setLevel(this.currentLevel.level + direction);
                    $rootScope.$broadcast('changelevel', this.currentLevel.level);
                    console.log('MaxLevel: ', this.maxLevel, " NewLevel: ", newLevel);
                    var kills = this.maxLevel > newLevel ? 10 : 0;
                    this.currentLevel.kills = this.maxLevel > newLevel ? 10 : 0;
                }
            }

            this.enoughToProgress = function(kills) {
                return (this.currentLevel.boss && kills >= Level.KILL.BOSS)
                    || (!this.currentLevel.boss && kills >= Level.KILL.NORMAL);
            }

            var me = this;

            this.onKill = function(kills) {
                console.log("Kill. ", kills);
                $rootScope.$broadcast('kill');

                if(me.enoughToProgress(kills)) {
                    if(me.maxLevel == me.currentLevel.level) {
                        me.maxLevel += 1;
                    }
                    if(me.progressMode) {
                        if(me.currentLevel.boss) {
                            me.currentLevel.bossTimer.cancel();
                        }
                        me.changeLevel(Level.DIRECTION.FORWARD);
                    } else {
                        if(me.currentLevel.boss) {
                            me.currentLevel.startBossTimer(30);
                        }
                    }
                }
            }

            this.onBossFailed = function() {
                console.log("Boss Failed!");
                me.changeLevel(Level.DIRECTION.BACKWARD);
                me.progressMode = false;
            }

            this.getLevel = function(level) {
                return new Level(level);
            }
        }

        function Level(level) {
            var me = this;

            this.level = level;

            this.currentHp = 0;

            this.onKill = undefined;
            this.onBossFailed = undefined;

            this.kills = 0;

            this.hp = (level % 5 == 0
                ? 10 * Math.pow( 1.6, level - 1) * 10
                : 10 * Math.pow( 1.6, level - 1)
                );

            this.credit = (level % 5 == 0
                ? (10 * Math.pow( 1.6, level - 1) * 10) / 15 * 2
                : 10 * Math.pow( 1.6, level - 1) / 15 * 2
                );

            this.boss = level % 5 == 0;

            this.startBossTimer = function(time) {
                if(this.bossTimer) {
                    this.bossTimer.cancel();
                    this.bossTimer = undefined;
                }
                var onFail = function() {
                    me.currentHp = 0;
                    me.onBossFailed();
                }
                this.bossTimer = new BossTimer(time, onFail);
            }

            if(this.boss) {
                this.startBossTimer(30);
            }

            this.dealDamage = function(damage) {
                //console.log("Deal dmg: ", damage);
                var newHp = this.currentHp + damage;

                if(newHp >= this.hp) {
                    this.currentHp = 0;
                    if(this.kills < 10) {
                        this.kills++;
                    }
                    this.onKill(this.kills);
                } else {
                    this.currentHp = newHp;
                }
            }
        }

        function BossTimer(time, onFail){
            this.time = time;

            var me = this;
            this.timer = $interval(function(){
                me.time -= 1;
                console.log("BossTimer tick", me.time);
                if(me.time == 0) {
                    me.time = time;
                    me.cancel();
                    onFail();
                }
            }, 1000);

            this.cancel = function(){
                $interval.cancel(this.timer);
            }
        }
    }]);