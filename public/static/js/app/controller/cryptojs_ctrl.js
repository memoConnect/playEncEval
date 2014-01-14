define(['app','../vendor/cryptojs/aes'], function (app) {
    app.register.controller('CryptoJsCtrl', ['$scope', function ($scope) {
        $scope.formData = {
            key: "safer security"
           ,plainText: "this is what nsa shouldn't see"
        };
        $scope.placeholder = {
            key: "key for crypto"
           ,plainText: "your message for crypto"
        };

        $scope.encrypt = function(){
            $scope.formData.encrypt = String(CryptoJS.AES.encrypt(String($scope.formData.plainText), String($scope.formData.key)));
        };

        $scope.decrypt = function(){
            var decrypt = CryptoJS.AES.decrypt(String($scope.formData.encrypt), String($scope.formData.key));
            $scope.formData.decrypt = decrypt.toString(CryptoJS.enc.Utf8);
        };
    }]);
});