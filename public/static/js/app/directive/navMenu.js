define(['app'], function (app) {
    'use strict';
    app.directive('navMenu', function () {
        return {
            restrict: 'A',
            controller: ['$scope', '$route', '$window', '$location',
                function ($scope, $route, $window, $location) {
                    console.log("navMenu Controller");
                    $scope.isTabActive = function(tab) {
                        if($route.current.$$route.originalPath.search(tab)>0)
                            return "active";
                        return null;
                    };
                }],
            templateUrl: 'static/js/app/directive/tpl/navMenu.html'
        };
    });
});