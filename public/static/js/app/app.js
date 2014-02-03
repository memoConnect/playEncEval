'use strict';
var cameo = {
    restApi: "http://"+location.host+"/api"
   ,token: null
};
define(['angularAMD', 'angular-route'], function (angularAMD) {
    var app = angular.module('cameoApp', ['ngRoute']);
    app.config(['$routeProvider', '$locationProvider',
    function($rP, $locationProvider){
        // route without # Hashbang
        //$locationProvider.html5Mode(true);

        // main route
        $rP.when('/home', angularAMD.route({
            templateUrl: 'static/tpl/home.html',
            controller: 'HomeCtrl'
        })).otherwise({
            redirectTo: '/home'
        });
        // crypto routes
        $rP.when('/crypto/javascrypt', angularAMD.route({
            templateUrl: 'static/tpl/crypto/javascrypt.html',
            controller: 'CryptJavascryptCtrl'
        })).when('/crypto/movable', angularAMD.route({
            templateUrl: 'static/tpl/crypto/movable.html',
            controller: 'CryptMovableCtrl'
        })).when('/crypto/cryptojs', angularAMD.route({
            templateUrl: 'static/tpl/crypto/cryptojs.html',
            controller: 'CryptCryptoJsCtrl'
        })).when('/crypto/sjcl', angularAMD.route({
            templateUrl: 'static/tpl/crypto/sjcl.html',
            controller: 'CryptSJCLCtrl'
        }));
        $rP.when('/crypto/openpgpjs', angularAMD.route({
            templateUrl: 'static/tpl/crypto/openpgpjs.html',
            controller: 'CryptOpenPgpJsCtrl'
        }));
        // tool routes
        $rP.when('/tools/localstorage', angularAMD.route({
            templateUrl: "static/tpl/tools/localstorage.html",
            controller: "ToolLocalStorageCtrl"
        })).when('/tools/fileapi', angularAMD.route({
            templateUrl: 'static/tpl/tools/fileapi.html',
            controller: 'ToolFileApiCtrl'
        }));
        // captcha routes
        $rP.when('/captcha/captchajs', angularAMD.route({
            templateUrl: "static/tpl/captcha/captchajs.html",
            controller: "CapCaptchajsCtrl"
        })).when('/captcha/canvas', angularAMD.route({
            templateUrl: "static/tpl/captcha/canvas.html",
            controller: "CapCanvasCtrl"
        })).when('/captcha/motion', angularAMD.route({
            templateUrl: "static/tpl/captcha/motion.html",
            controller: "CapMotionCtrl"
        })).when('/captcha/captchagen', angularAMD.route({
            templateUrl: "static/tpl/captcha/captchagen.html",
            controller: "CapCaptchagenCtrl"
        }));

    }]);

    // add directives
    require(['_d/navMenu'], function(){
        // Bootstrap Angular when DOM is ready
        angularAMD.bootstrap(app);
    });

    return app;
});