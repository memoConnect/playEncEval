'use strict';

cameo.api = angular.module('cameoApi', ['ngResource']);

cameo.api.factory('Crypt',
    function($http){
        return {
            sendText: function(text){
                return $http.post(cameo.restApi+"/sendText",{text:text})
            }
           ,getText: function(id){
                return $http.get(cameo.restApi+"/getText/"+id)
            }
        };
    });