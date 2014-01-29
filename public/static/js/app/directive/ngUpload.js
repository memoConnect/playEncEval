'use strict';
define(['app'], function (app) {
    app.register.directive('ngUpload', [function () {
        return {
            scope: {
                ngUpload: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    scope.$apply(function () {
                        scope.ngUpload = changeEvent.target.files[0];
                    });
                });
            }
        }
    }]);
});