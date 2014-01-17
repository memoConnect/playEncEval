'use strict';
define(['app','_v/openpgpjs/openpgpjs.min','_s/localStorageService','_s/cryptoService'], function (app, openpgp) {
    app.register.controller('OpenPgpJsCtrl', ['$scope', 'LocalStorage', 'Crypto', function ($scope, LocalStorage, Crypto) {
        $scope.message = "";

        $scope.email = "";
        $scope.passphrase = "";

        $scope.keyType = 1;
        $scope.numBits = 2048;

        $scope.privKey = "";
        $scope.pubKey = "";

        $scope.generateKeyPair = function(){
            var data;

            clearKeys();

            if(html5_local_storage() !== true){
                $scope.message = "LocalStorage not available!";
                return false;
            }

            if(checkBrowserRandomValues() !== true){
                $scope.message = "\"window.crypto.getRandomValues\" not available!";
                return false;
            }

            $scope.message = "Working in Progress.... ";

            try {
                Crypto.benchmarkStart();

                data = openpgp.generateKeyPair($scope.keyType,$scope.numBits,$scope.email,$scope.passphrase);

                if(data.privateKeyArmored != undefined ){
                    $scope.privKey = data.privateKeyArmored;
                }

                if(data.publicKeyArmored != undefined){
                    $scope.pubKey = data.publicKeyArmored;
                }

                LocalStorage.save("privKey",data.privateKeyArmored);
                LocalStorage.save("pubKey",data.publicKeyArmored);

                $scope.timer = Crypto.benchmarkEnd();
                $scope.message = "Finished in " + $scope.timer;

            } catch (e){
                $scope.message = e;
            }
            return true;
        };

        $scope.load = function(){
            if(html5_local_storage() !== true){
                $scope.message = "LocalStorage not available!";
                return false;
            }

//        $scope.privKey = (LocalStorage.get("privKey") == undefined ||  LocalStorage.get("privKey") == 'undefined') ? LocalStorage.get("privKey") : "";
            $scope.privKey = LocalStorage.get("privKey");
            $scope.pubKey = LocalStorage.get("pubKey");
            return true;
        };

        $scope.clearStorage = function(){
            clearKeys();
            LocalStorage.clearAll();
        };

        function html5_local_storage(){
            try {
                return 'localStorage' in window && window['localStorage'] !== null;
            } catch(e){
                return false;
            }
        }

        function checkBrowserRandomValues(){
            return (window.crypto.getRandomValues) ? true : false;
        }

        function clearKeys (){
            $scope.privKey = "";
            $scope.pubKey = "";
        }
    }]);
});