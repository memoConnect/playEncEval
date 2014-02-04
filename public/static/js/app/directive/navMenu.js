define(['app','_s/utilService'], function (app) {
    'use strict';
    app.directive('navMenu', function () {
        return {
            restrict: 'A',
            controller: ['$scope', '$route', '$window', '$location', 'Util',
                function ($scope, $route, $window, $location, Util) {

                    $scope.Util = Util;
                    $scope.navigation = cameo.navigation;


                    $scope.isDefault = function(route){
                        return typeof route == "string" && route == "default";
                    };

                    $scope.hasSubRoutes = function(subRoutes){
                        return typeof subRoutes == 'object' && subRoutes.length > 0;
                    };

                    $scope.inCollapse = false;
                    $scope.isTabActive = function(tab) {
                        if($route.current.$$route.naviIndex == tab ||
                           $route.current.$$route.originalPath.search(tab) > 0){
                            return "active";
                        }
                        return null;
                    };

                    $scope.hideNav = function(){
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