'use strict';
var cameo = {
    restApi: "http://"+location.host+"/api"
   ,token: null
};
define(['angularAMD', 'angular-route'], function (angularAMD) {
    var app = angular.module('cameoApp', ['ngRoute']);
    app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider){
        // route without # Hashbang
        //$locationProvider.html5Mode(true);

        // string defines shortner
        var d = {limiter: '/'};

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
         * controller: {Type}{name}Ctrl
         * controllerUrl: controller/{type}/{name}_ctrl
         */
        function addRouteToProviderViaAMD(name, type){
            // create controller object for AMD route
            var ctrl = {
                templateUrl:    'static/tpl' + d.limiter + (typeof type != 'undefined' ? type + d.limiter : '') + name + '.html'
               ,controller:     (typeof type != 'undefined' ? ucfirst(type) : '') + ucfirst(name) + 'Ctrl'
               ,controllerUrl:  'controller' + d.limiter + (typeof type != 'undefined' ? type + d.limiter: '') + name + '_ctrl'
               ,naviIndex: {name:name,type:type}
            };

            $routeProvider.when(d.limiter + (typeof type != 'undefined' ? type + d.limiter: '') + name, angularAMD.route(ctrl));
        }

        // main route with otherwise
        addRouteToProviderViaAMD('home');
        $routeProvider.otherwise({
            redirectTo: '/home'
        });
        // crypto routes
        d.cr = 'crypto';
        addRouteToProviderViaAMD('javascrypt', d.cr);
        addRouteToProviderViaAMD('movable', d.cr);
        addRouteToProviderViaAMD('cryptojs', d.cr);
        addRouteToProviderViaAMD('sjcl', d.cr);
        addRouteToProviderViaAMD('openpgpjs', d.cr);
        // tool routes
        d.t = 'tools';
        addRouteToProviderViaAMD('localstorage', d.t);
        addRouteToProviderViaAMD('fileapi', d.t);
        // captcha routes
        d.ca = 'captcha';
        addRouteToProviderViaAMD('captchajs', d.ca);
        addRouteToProviderViaAMD('canvas', d.ca);
        addRouteToProviderViaAMD('motion', d.ca);
        addRouteToProviderViaAMD('captchagen', d.ca);
    }]);

    // add directives
    require(['_d/navMenu'], function(){
        // Bootstrap Angular when DOM is ready
        angularAMD.bootstrap(app);
    });

    return app;
});