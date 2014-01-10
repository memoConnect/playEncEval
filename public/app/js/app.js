'use strict';
var cameo = {
    restApi: "http://192.168.178.40:9000"
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
        $locationProvider.html5Mode(true);
        $routeProvider.
            when('/sendText', {
                templateUrl: 'tpl/sendText.html',
                controller: 'SendTextCtrl'
            }).
            otherwise({
                redirectTo: '/sendText'
            });
        }]);
