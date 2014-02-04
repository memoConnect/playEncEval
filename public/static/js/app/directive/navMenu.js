define(['app'], function (app) {
    'use strict';
    app.directive('navMenu', function () {
        return {
            restrict: 'A',
            controller: ['$scope', '$route', '$window', '$location',
                function ($scope, $route, $window, $location) {
                    $scope.inCollapse = false;

                    $scope.isTabActive = function(tab) {
                        if($route.current.$$route.naviIndex == tab ||
                           $route.current.$$route.originalPath.search(tab) > 0){
                            return "active";
                        }
                        return null;
                    };

                    $scope.hideNav = function(){
                        console.log("hide nav")
                        $scope.inCollapse = false;
                    };
                    $scope.toggleNavi = function(){
                        if($scope.inCollapse === false)
                            $scope.inCollapse = true;
                        else
                            $scope.inCollapse = false;
                    };
                }],
            templateUrl: 'static/js/app/directive/tpl/navMenu.html'
        };
    });
});