define(['app'], function (app) {
    app.register.controller('HomeCtrl', ['$scope', function ($scope) {
        $scope.title = "Welcome to First Angular Cameo Test Environment";
    }]);
});