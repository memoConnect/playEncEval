define(['app'], function (app) {
    'use strict';

    app.register.controller('HomeCtrl', ['$scope', function ($scope) {
        $scope.title = "Welcome to First Angular Cameo Test Environment";
    }]);

    return app;
});