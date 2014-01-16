'use strict';

define(['app'], function (app) {
    app.register.factory('Util',
    function(){
        return {
            prettify: function(json){
                return JSON.stringify(json, undefined, 2);
            }
           ,objLen: function(obj){
                return Object.keys(obj).length;
            }
        };
    });
});