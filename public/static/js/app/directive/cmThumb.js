'use strict';
define(['app'], function (app) {
    app.register.directive('cmThumb',[function () {
        return {
            scope: {
                cmThumb: '='
            },
            link: function (scope, element){
                element.bind('load', function(){
                    scope.$apply(function(){
                        scope.cmThumb.width = element[0].width
                        scope.cmThumb.height = element[0].height
                    });
                });
            }
        }
    }])
});