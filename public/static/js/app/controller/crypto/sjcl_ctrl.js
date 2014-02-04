/**
 * Created with IntelliJ IDEA.
 * User: reimerei
 * Date: 1/16/14
 * Time: 2:39 PM
 * To change this template use File | Settings | File Templates.
 */

'use strict';
define(['app','_v/sjcl/main','_s/cryptoService', '_s/benchmarkService','_s/utilService'], function (app) {
    app.register.controller('CryptoSjclCtrl', ['$scope', 'Crypto', 'Benchmark', 'Util', function ($scope, Crypto, Benchmark, Util) {
        $scope.Util = Util;
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
            var parameters = { ks: 256 };

            $scope.formData.encrypt = "";
            Crypto.benchmarkStart();
            $scope.formData.encrypt = sjcl.json.encrypt(String($scope.formData.key), String($scope.formData.plainText), parameters)
            $scope.time.encrypt = Crypto.benchmarkEnd();
        };

        $scope.decrypt = function(){
            $scope.formData.decrypt = "";
            Crypto.benchmarkStart();
            $scope.formData.decrypt = sjcl.decrypt(String($scope.formData.key), String($scope.formData.encrypt))
            $scope.time.decrypt = Crypto.benchmarkEnd();
        };

        $scope.benchmark = function() {
            Benchmark.run($scope)
        }
    }]);
});
