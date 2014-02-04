'use strict';
define(['app', '_s/utilService', '_s/cryptoService', '_v/captcha/html5canvas/html5canvas', '_v/canvasToBlob/canvasToBlob'],
function (app) {
    app.register.controller('CaptchaCanvasCtrl', ['$scope', 'Util', 'Crypto',
    function ($scope, Util, Crypto) {
        // bootstrap
        Util.loadCss('static/js/vendor/captcha/html5canvas/html5canvas.css');

        $scope.pass = "";
        $scope.blob = "";

        var canvas = document.getElementById('canvas');
        if (canvas && canvas.getContext) {
            var ctx = canvas.getContext("2d");
        }

        $scope.create = function(string){
            if(angular.isUndefined(string))
                $scope.pass = Math.random().toString(36).substr(2, 5).toUpperCase().split('').join(' ');

            ctx.clear();

            ctx.font = 'bold 18px Tahoma';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#FF3300';
            ctx.fillText($scope.pass, canvas.width / 2, canvas.height / 2 + 7 );

            canvas.toBlob(function(blob){
                var reader = new FileReader();
                reader.onload = function(event){
                    $scope.$apply(function(){
                        $scope.blob = String(event.target.result);
                    });
                };
                reader.readAsDataURL(blob);
            });
        };

        $scope.update = function(){
            $scope.create($scope.pass);
        };

        $scope.refresh = function(){
            $scope.create();
        };
    }]);
});