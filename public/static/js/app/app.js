define(['angularAMD', 'angular-route'], function (angularAMD) {
    'use strict';
    var app = angular.module('cameoApp', ['ngRoute']);

    app.cameo = {
        restApi: "http://"+location.host+"/api"
       ,token: null
       ,navigation: {
            'home':     'default'
            ,'cmkey':    ['export']
            ,'crypto':   ['javascrypt','movable','cryptojs','sjcl','openpgpjs', 'cryptico']
            ,'tools':    ['localstorage','fileapi']
            ,'captcha':  ['captchajs','canvas','motion','captchagen']
            ,'image':    ['resize','upload']
        }
    };

    app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider){
        // route without # Hashbang
        //$locationProvider.html5Mode(true);

        // string defines shortner
        function ucfirst (str) {
            str += '';
            var f = str.charAt(0).toUpperCase();
            return f + str.substr(1);
        }

        /**
         * examples:
         * create Object {templateUrl: "static/tpl/home.html", controller: "HomeCtrl", controllerUrl: "controller/home_ctrl"}
         * create Object {templateUrl: "static/tpl/crypto/scjl.html", controller: "CryptoScjlCtrl", controllerUrl: "controller/crypto/scjl_ctrl"}
         *
         * nameconventions:
         * templateUrl: static/tpl/{type}/{name}.html
         * controller: {Type}{Name}Ctrl
         * controllerUrl: controller/{type}/{name}_ctrl
         */
        function addRouteToProviderViaAMD(name, type){
            // create controller object for AMD route
            var ctrl = {
                templateUrl:    'static/tpl/' + (typeof type != 'undefined' ? type + '/' : '') + name + '.html'
               ,controller:     (typeof type != 'undefined' ? ucfirst(type) : '') + ucfirst(name) + 'Ctrl'
               ,controllerUrl:  'controller/' + (typeof type != 'undefined' ? type + '/' : '') + name + '_ctrl'
               ,naviIndex: {
                    name: name
                   ,type: type
                }
            };
            $routeProvider.when('/' + (typeof type != 'undefined' ? type + '/': '') + name, angularAMD.route(ctrl));
        }

        // go through cameo.navigation json
        angular.forEach(app.cameo.navigation, function(subRoutes, baseRoute){
            // main route with otherwise
            if(typeof subRoutes == "string" && subRoutes == "default"){
                addRouteToProviderViaAMD(baseRoute);
                $routeProvider.otherwise({
                    redirectTo: '/'+baseRoute
                });
            // base with subroutes eq.: 'captcha/canvas'
            } else if(typeof subRoutes == "object" && subRoutes.length > 0){
                angular.forEach(subRoutes,function(subRoute){
                    addRouteToProviderViaAMD(subRoute,baseRoute);
                });
            }
        });
    }]);

    // add global directives
//    require(['_d/navMenu'], function(){
//        // Bootstrap Angular when directive is ready
//
//    });
    app.directive('navMenu', function () {
        return {
            restrict: 'A',
            controller: ['$scope', '$route', '$window', '$location',
                function ($scope, $route, $window, $location) {

                    $scope.Util = {
                        ucFirst: function(string){
                            string += '';
                            var f = string.charAt(0).toUpperCase();
                            return f + string.substr(1);
                        }
                        ,notSorted: function(obj){
                            if (!obj) {
                                return [];
                            }
                            return Object.keys(obj);
                        }
                    };
                    $scope.navigation = app.cameo.navigation;

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

    angularAMD.bootstrap(app);

    return app;
});