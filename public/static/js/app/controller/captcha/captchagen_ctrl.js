'use strict';
define(['app'
   , '_s/utilService', '_s/cryptoService'
   ,'_v/captcha/captchagen/captchagen'],
    function (app) {
        app.register.controller('CaptchaCaptchagenCtrl', ['$scope', 'Util', 'Crypto',
        function ($scope, Util, Crypto) {
            var captcha;

            $scope.dim = "400x200";
            $scope.font = "sans";

            $scope.create = function(){
                var dim = $scope.dim.split("x");
                captcha = new Captchagen({
                    width: dim[0]
                    ,height: dim[1]
                    ,text: $scope.pass
                    ,font: $scope.font
                });
                captcha.generate();

                $scope.pass = captcha.text();
            };

            $scope.refresh = function(){
                captcha.refresh($scope.pass);
            };

            $scope.genKey = function(){
                captcha.refresh();
                $scope.pass = captcha.text();
            };

            $scope.create();
        }]);
    });