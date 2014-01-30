'use strict';
define(['app', 'jquery',
    '_s/utilService', '_s/cryptoService', '_s/apiService',
    '_v/captcha/captchajs/captchajs', '_v/canvasToBlob/canvasToBlob', '_v/sjcl/main'],
function (app) {
    app.register.controller('CapCaptchajsCtrl', ['$scope',
    function ($scope) {

    }]);

    app.register.controller('SendTextCtrl', ['$rootScope', '$scope', 'Util', 'Crypto', 'Api',
    function ($rootScope, $scope, Util, Crypto, Api) {
        $scope.Util = Util;

        $scope.message = Crypto.getLoremIpsum(1);
        $scope.pass = "Moinmoin";

        function getBlob(canvas){
            canvas.toBlob(function(blob){
                $scope.blobData = blob;
                $scope.blobData.name = 'captcha.png';
                var reader = new FileReader();
                reader.onload = function(event){
                    $scope.$apply(function(){
                        $scope.blob = String(event.target.result);
                    });
                };
                reader.readAsDataURL(blob);
            });
        }

        $scope.create = function(){
            var string = null;
            if($scope.pass != '')
                string = $scope.pass;

            new CAPTCHA({
                text: angular.isUndefined(string) ? null : string,
                randomText: angular.isUndefined(string) ? true : false,
                selector: '#canvas',
                withoutValidate: true,
                afterBuild: function(canvas, text){
                    $scope.pass = text;
                    getBlob(canvas)
                }
            }).generate();
        };

        $scope.send = function(){

            Api.sendText(sjcl.encrypt(String($scope.pass),String($scope.message),{ ks: 256 })).
            success(function(res,state){
                $rootScope.$broadcast("textSended",res.id);
            });

            Api.sendFile({
                file: $scope.blobData
               ,index: 0
               ,chunk: $scope.blob
               ,chunksTotal: 1
            }).
            success(function(res,state){
                $rootScope.$broadcast("fileSended",res.assetId);
            });
        };
    }]);

    app.register.controller('GetTextCtrl', ['$scope', 'Util', 'Crypto', 'Api',
    function ($scope, Util, Crypto, Api) {

        $scope.$on("textSended", function(e,id){
            $scope.textId = id;
        });
        $scope.$on("fileSended", function(e,id){
            $scope.assetId = id;
        });

        $scope.captcha = "";
        $scope.textId = 0;
        $scope.assetId = 0;
        $scope.crypto = {};

        $scope.get = function(){
            Api.getText($scope.textId).
            success(function(res,state){
                $scope.crypto = res.text;
                $scope.message = res.text;
            });

            Api.getFile($scope.assetId,0).
            success(function(res,state){
                $scope.captcha = res.chunk;
            });
        };

        $scope.decrypt = function(){
            console.log(String($scope.pass))
            console.log(String($scope.crypto))

            console.log(sjcl.decrypt(String($scope.pass),String($scope.crypto)))

            try{
                $scope.message = sjcl.decrypt(String($scope.pass),String($scope.crypto));
            } catch(e){
                $scope.message = e;
            }

        };
    }]);
});