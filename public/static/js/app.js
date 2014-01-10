'use strict';
var cameo = {
    restApi: "http://localhost:9000/api"
   ,token: null
};

cameo.app = angular.module('cameoApp', [
  'ngRoute'
 ,'ngCookies'
 ,'cameoControllers'
 ,'cameoApi'
]);

cameo.app.
    config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider){
        //$locationProvider.html5Mode(true);
        $routeProvider.
            when('/sendText', {
                templateUrl: 'static/tpl/sendText.html',
                controller: 'SendTextCtrl'
            }).
            when('/fileApi', {
                templateUrl: 'static/tpl/sendFile.html',
                controller: 'SendFileCtrl'
            }).
            otherwise({
                redirectTo: '/sendText'
            });
        }]);
