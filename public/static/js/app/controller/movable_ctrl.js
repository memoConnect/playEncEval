'use strict';
define(['app','_v/movable/aes','service/cryptoService'], function (app) {
    app.register.controller('MovableCtrl', ['$scope','Crypto', function ($scope, Crypto) {
        $scope.time = {encrypt:0,decrypt:0};
        $scope.aesSize = 256;
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
            $scope.formData.encrypt = Aes.Ctr.encrypt(String($scope.formData.plainText), String($scope.formData.key), $scope.aesSize);
            $scope.time.encrypt = Crypto.benchmarkEnd();
        };

        $scope.decrypt = function(){
            $scope.formData.decrypt = "";
            Crypto.benchmarkStart();
            $scope.formData.decrypt = Aes.Ctr.decrypt(String($scope.formData.encrypt), String($scope.formData.key), $scope.aesSize);
            $scope.time.decrypt = Crypto.benchmarkEnd();
        };
    }]);
});