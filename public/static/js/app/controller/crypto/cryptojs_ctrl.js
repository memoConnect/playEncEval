'use strict';
define(['app','_v/cryptojs/aes','_s/cryptoService', '_s/benchmarkService'], function (app) {
    app.register.controller('CryptCryptoJsCtrl', ['$scope', 'Crypto', 'Benchmark', function ($scope, Crypto, Benchmark) {

        $scope.time = {encrypt:0,decrypt:0};

        $scope.formData = {
            key: Crypto.genKey()
           ,plainText: Crypto.getLoremIpsum(1)
        };
        $scope.placeholder = {
            key: "PrivateKey"
           ,plainText: "uncrypted message"
        };

        $scope.genKey = function(){
            $scope.formData.key = Crypto.genKey();
        };

        $scope.encrypt = function(){
            $scope.formData.encrypt = "";
            Crypto.benchmarkStart();
            $scope.formData.encrypt = String(CryptoJS.AES.encrypt(String($scope.formData.plainText), String($scope.formData.key)));
            $scope.time.encrypt = Crypto.benchmarkEnd();
        };

        $scope.decrypt = function(){
            $scope.formData.decrypt = "";
            Crypto.benchmarkStart();
            var decrypt = CryptoJS.AES.decrypt(String($scope.formData.encrypt), String($scope.formData.key));
            $scope.formData.decrypt = decrypt.toString(CryptoJS.enc.Utf8);
            $scope.time.decrypt = Crypto.benchmarkEnd();
        };

        $scope.benchmark = function() {
            Benchmark.run($scope)
        }
    }]);
});