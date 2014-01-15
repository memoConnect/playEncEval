'use strict';
var cameo = {
    restApi: "http://localhost:9000/api"
   ,token: null
};
define(['angularAMD', 'angular-route'], function (angularAMD) {
    var app = angular.module('cameoApp', ['ngRoute']);
    app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider){
        //$locationProvider.html5Mode(true);
        $routeProvider.
            when('/home', angularAMD.route({
                templateUrl: 'static/tpl/home.html',
                controller: 'HomeCtrl'
            })).
            when('/fileApi', angularAMD.route({
                templateUrl: 'static/tpl/fileApi.html',
                controller: 'FileApiCtrl'
            })).
            when('/javascrypt', angularAMD.route({
                templateUrl: 'static/tpl/javascrypt.html',
                controller: 'JavascryptCtrl'
            })).
            when('/movable', angularAMD.route({
                templateUrl: 'static/tpl/movable.html',
                controller: 'MovableCtrl'
            })).
            when('/cryptojs', angularAMD.route({
                templateUrl: 'static/tpl/cryptojs.html',
                controller: 'CryptoJsCtrl'
            })).
            when('/openpgpjs', angularAMD.route({
                templateUrl: 'static/tpl/openpgpjs.html',
                controller: 'OpenPgpJsCtrl'
            })).
            otherwise({
                redirectTo: '/home'
            });
        }]);

    // Bootstrap Angular when DOM is ready
    angularAMD.bootstrap(app);

    return app;
});
