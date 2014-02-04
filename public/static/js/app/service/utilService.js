'use strict';

define(['app'], function (app) {
    app.factory('Util',
    function(){
        return {
            prettify: function(json){
                return JSON.stringify(json, undefined, 2);
            }
           ,objLen: function(obj){
                return Object.keys(obj).length;
            }
           ,millisecondsToStr: function(milliseconds) {
                // TIP: to find current time in milliseconds, use:
                // var  current_time_milliseconds = new Date().getTime();

                // This function does not deal with leap years, however,
                // it should not be an issue because the output is aproximated.
                function numberEnding (number) {
                    return ""//(number > 1) ? '\'s' : '';
                }

                var temp = milliseconds / 1000;
                var years = Math.floor(temp / 31536000);
                if (years) {
                    return years + 'y' + numberEnding(years);
                }
                var days = Math.floor((temp %= 31536000) / 86400);
                if (days) {
                    return days + 'd' + numberEnding(days);
                }
                var hours = Math.floor((temp %= 86400) / 3600);
                if (hours) {
                    return hours + 'h' + numberEnding(hours);
                }
                var minutes = Math.floor((temp %= 3600) / 60);
                if (minutes) {
                    return minutes + 'm' + numberEnding(minutes);
                }
                var seconds = temp % 60;
                if (seconds) {
                    return seconds + 's' + numberEnding(seconds);
                }
                return '< s'; //'just now' //or other string you like;
            }
           ,getRandomInt: function (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
           ,bytesToString: function(bytes) {
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                if (bytes == 0) return 'n/a';
                var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
                return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
            }
           ,loadCss: function(url) {
                var link = document.createElement("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = url;
                document.getElementsByTagName("head")[0].appendChild(link);
            }
           ,ucFirst: function(string){
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
    });
});