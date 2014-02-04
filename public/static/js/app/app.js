'use strict';
var cameo = {
    restApi: "http://"+location.host+"/api"
   ,token: null
   ,navigation: {
        'home':     'default'
       ,'crypto':   ['javascrypt','movable','cryptojs','sjcl','openpgpjs']
       ,'tools':    ['localstorage','fileapi']
       ,'captcha':  ['captchajs','canvas','motion','captchagen']
    }
};
define(['angularAMD', 'angular-route'], function (angularAMD) {
    var app = angular.module('cameoApp', ['ngRoute']);
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
        angular.forEach(cameo.navigation, function(subRoutes, baseRoute){
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
    require(['_d/navMenu'], function(){
        // Bootstrap Angular when DOM is ready
        angularAMD.bootstrap(app);
    });

    return app;
});