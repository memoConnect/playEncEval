'use strict';
define(['app', 'jquery', '_s/utilService', '_v/captcha/motion/motion', '_v/canvasToBlob/canvasToBlob'],
function (app, $) {
    app.register.controller('CaptchaMotionCtrl', ['$scope', 'Util',
    function ($scope, Util) {
        // bootstrap
        Util.loadCss('static/js/vendor/captcha/motion/motion.css');

        // scope handler
        $scope.captureState = false;

        $('#mc-form').motionCaptcha({
            shapes: ['triangle', 'x', 'rectangle', 'circle', 'check', 'zigzag', 'arrow', 'delete', 'pigtail', 'star']
           ,onSuccess: function($form, $canvas, ctx){

                $canvas[0].toBlob(function(blob){
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
           ,onError: function(){
                $scope.$apply(function(){
                    $scope.captureState = false;
                    $scope.blob = "";
                });
            }
        });

    }]);
});