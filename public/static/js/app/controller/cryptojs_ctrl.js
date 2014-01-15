'use strict';
define(['app','_v/cryptojs/aes','service/cryptoService'], function (app) {
    app.register.controller('CryptoJsCtrl', ['$scope', 'Crypto', function ($scope, Crypto) {
        $scope.time = {encrypt:0,decrypt:0};

        $scope.formData = {
            key: Crypto.genKey()
           ,plainText: Crypto.getLoremIpsum()
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
    }]);
});