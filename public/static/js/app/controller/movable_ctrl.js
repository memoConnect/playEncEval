define(['app','../vendor/movable/aes'], function (app) {
    app.register.controller('MovableCtrl', ['$scope', function ($scope) {
        $scope.aesSize = 256;
        $scope.formData = {
            key: "safer security"
            ,plainText: "this is what nsa shouldn't see"
        };
        $scope.placeholder = {
            key: "key for crypto"
           ,plainText: "your message for crypto"
        };

        $scope.encrypt = function(){
            $scope.formData.encrypt = Aes.Ctr.encrypt(String($scope.formData.plainText), String($scope.formData.key), $scope.aesSize);
        };

        $scope.decrypt = function(){
            $scope.formData.decrypt = Aes.Ctr.decrypt(String($scope.formData.encrypt), String($scope.formData.key), $scope.aesSize);
        };
    }]);
});