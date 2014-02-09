define(['crypto_sjcl_ctrl', 'angularAMD'], function (app, angularAMD) {
    'use strict';
    console.log('crypto sjcl spec')
    describe('Crypto Stanford Controller', function () {
        var $scope, ctrl;

        angularAMD.inject(function ($rootScope, $controller) {
            $scope = $rootScope.$new();
            ctrl = $controller('CryptoSjclCtrl', { $scope: $scope });
        });

        it("scope.time should be default time object", function () {
            expect($scope.time).toEqual({encrypt:0,decrypt:0});
        });

        it("scope.formData.key should have 71 chars", function () {
            expect($scope.formData.key.length).toEqual(71);
        });

        it("scope.formData.plainText should have 10000 chars", function () {
            expect($scope.formData.plainText.length).toEqual(10000);
        });

    });
});