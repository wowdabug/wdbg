angular.module('HexaClicker')
    .service('Data', function(){
        this.hexas = [
            //DPS HEXAS
            //         ID   Color       Price      BaseUpgr   BaseDPS
            new DpsHexa(0,  "#ea8a00",  50,          50,         5),
            new DpsHexa(1,  "#bae272",  250,         250,        22),
            new DpsHexa(2,  "#541a30",  1e+3,        1e+3,       74),
            new DpsHexa(3,  "#d9afd7",  4e+3,        4e+3,       245),
            new DpsHexa(4,  "#f1d888",  20e+3,       20e+3,      976),
            new DpsHexa(5,  "#586fa1",  100e+3,      100e+3,     3725),
            new DpsHexa(6,  "#efeae2",  400e+3,      400e+3,     10.859e+3),
            new DpsHexa(7,  "#00b0ff",  2.5e+6,      2.5e+6,     47.143e+3),
            new DpsHexa(8,  "#84b096",  15e+6,       15e+6,      186e+3),
            new DpsHexa(9,  "#FFF79A",  100e+6,      100e+6,     782e+3),
            new DpsHexa(10, "#8882BE",  800e+6,      800e+6,     3721e+3),
            new DpsHexa(11, "#6ECFF6",  6.5e+9,      6.5e+9,     17010e+3),
            new DpsHexa(12, "#F6989D",  50e+9,       50e+9,      69480e+3),
            new DpsHexa(13, "#FDC68A",  450e+9,      450e+9,     460e+6),
            new DpsHexa(14, "#C4DF9B",  4e+12,       4e+12,      3e+9),
            new DpsHexa(15, "#7EA7D8",  36e+12,      36e+12,     20e+9),
            new DpsHexa(16, "#F49AC2",  320e+12,     320e+12,    131e+9),
            new DpsHexa(17, "#F7977A",  2.7e+15,     2.7e+15,    698e+9),
            new DpsHexa(18, "#8493CA",  24e+15,      24e+15,     5330e+9),
            new DpsHexa(19, "#82CA9D",  300e+15,     300e+15,    490e+12),
            new DpsHexa(20, "#C69C6E",  9e+18,       9e+18,      1086e+12),
            new DpsHexa(21, "#7A0026",  350e+18,     350e+18,    31e+15),
            new DpsHexa(22, "#8DC73F",  14e+21,      14e+21,     917e+15),
            new DpsHexa(23, "#FFF467",  4199e+21,    4199e+21,   1013e+18),
            new DpsHexa(24, "#00AEEF",  2100e+24,    2100e+24,   74e+21),

            //UTILITY HEXAS
            new ActiveUtilityHexa(25, "#586fa1", 1, 1000, "[Active] +50% DPS Horizontally", UtilityHexa.TARGET.HORIZONTAL, {DPS: 1.5}, 10, 30),
            new ActiveUtilityHexa(26, "#ea8a00", 2, 1000, "[Active] +50% Area DPS", UtilityHexa.TARGET.AREA, {DPS: 1.5}, 10, 30),
            new PassiveUtilityHexa(27, "#82CA9D", 2, 1000, "[Passive] +10% Area DPS", UtilityHexa.TARGET.AREA, {DPS: 1.10})
        ];

        this.getHexa = function(id) {
            return this.hexas.filter(function(hexa) {
                return hexa.id == id;
            })[0];
        }

        this.getHexas = function(type) {
            return this.hexas.filter(function(hexa) {
                switch(type) {
                    case Hexa.TYPE.DPS:
                        return hexa instanceof DpsHexa;
                        break;
                    case Hexa.TYPE.UTILITY:
                        return hexa instanceof ActiveUtilityHexa || hexa instanceof PassiveUtilityHexa;
                        break;
                    default:
                        return false;
                }
            });
        }
    });