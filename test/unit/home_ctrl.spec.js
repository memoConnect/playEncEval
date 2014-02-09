define(['home_ctrl', 'angularAMD'], function (app, angularAMD) {
    'use strict';
    console.log('home ctrl spec')
    describe('Home Controller', function () {
        var $scope, ctrl;

        angularAMD.inject(function ($rootScope, $controller) {
            $scope = $rootScope.$new();
            ctrl = $controller('HomeCtrl', { $scope: $scope });
        });

        it("scope.title shuold welcomes you", function () {
            expect($scope.title).toMatch('Welcome');
        });

    });
});