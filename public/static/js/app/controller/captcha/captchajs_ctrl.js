'use strict';
define(['app', 'jquery', '_s/utilService', '_s/cryptoService', '_v/captcha/captchajs/captchajs', '_v/canvasToBlob/canvasToBlob'],
function (app) {
    app.register.controller('CapCaptchajsCtrl', ['$scope', 'Util', 'Crypto',
    function ($scope, Util, Crypto) {

        // scope handler
        $scope.captureState = false;
        $scope.pass = "";

        $scope.create = function(string){

            $("#canvas").html('');

            var captcha = new CAPTCHA({
                text: angular.isUndefined(string) ? null : string,
                randomText: angular.isUndefined(string) ? true : false,
                selector: '#canvas',
                width: 400,
                height: 200,
                onSuccess: function (canvas) {

                    canvas.toBlob(function(blob){
                        var reader = new FileReader();
                        reader.onload = function(event){
                            $scope.$apply(function(){
                                $scope.blob = String(event.target.result);
                            });
                        };
                        reader.readAsDataURL(blob);
                    });

                    $scope.$apply(function(){
                        $scope.captureState = true;
                    });
                }
            });
            captcha.generate();
        };

        $scope.update = function(){
            $scope.create($scope.pass);
        };

        $scope.refresh = function(){
            $scope.create();
        };

    }]);
});