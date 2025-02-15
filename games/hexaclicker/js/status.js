angular.module('HexaClicker')
    .service('Status', function(){

        var status = new Status();

        function Status() {
            this.allCredit = 0;
            this.credit = 0;
            this.utility = 0;
            this.tier = 1;

            this.achievedHexas = [0, 25, 26, 27];

            this.addCredit = function(credit) {
                this.credit += credit;
                this.allCredit += credit;
            }
        }

        this.getStatus = function() {
            return status;
        }
    });