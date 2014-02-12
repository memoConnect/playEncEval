'use strict';
define(['app','_v/cryptico/cryptico.min','_s/localStorageService','_s/cryptoService'], function (app, openpgp) {
    app.register.controller('CryptoCrypticoCtrl', ['$scope', '$timeout', 'LocalStorage', 'Crypto', function ($scope, $timeout, LocalStorage, Crypto) {
        $scope.message = "";
        $scope.genBtn = "generate";
        $scope.stateBusy = false;

        $scope.email = "";
        $scope.passphrase = "";

        $scope.keyType = 1;
        $scope.numBits = 2048;

        $scope.privKey = "";
        $scope.pubKey = "";

        $scope.generateKeyPair = function(){

            $scope.genBtn = "please wait...";
            $scope.stateBusy = true;

            $timeout(function(){
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

                Crypto.benchmarkStart();

                //data = openpgp.generateKeyPair($scope.keyType,$scope.numBits,$scope.email,$scope.passphrase);
                //data = openpgp.generateKeyPair($scope.keyType,$scope.numBits,$scope.email,$scope.passphrase);
                var data =  cryptico.generateRSAKey($scope.passphrase, $scope.numBits);

                //var MattsPublicKeyString = cryptico.publicKeyString(MattsRSAkey);
                //var MattsPrivateKeyString = cryptico.privateKeyString(MattsRSAkey);

                /*if(data.privateKeyArmored != undefined ){
                    $scope.privKey = data.privateKeyArmored;
                }
                */
                $scope.privKey= data

                if(cryptico.publicKeyString(data) != undefined){
                    $scope.pubKey = cryptico.publicKeyString(data);
                }

                LocalStorage.save("privKey", $scope.privKey);
                LocalStorage.save("pubKey",$scope.pubKey);

                $scope.timer = Crypto.benchmarkEnd();
                $scope.message = "Finished in " + $scope.timer;
                $scope.genBtn = "generate";
                $scope.stateBusy = false;
            },1000);

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