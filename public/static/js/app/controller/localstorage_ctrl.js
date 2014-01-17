'use strict';

define(['app','_s/localStorageService'], function (app) {

    app.register.controller('LocalStorageCtrl',['$scope','LocalStorageService',function($scope,LocalStorageService){
        $scope.checkLocalStorageMessage = 'LocalStorage nicht verfügbar!';

        $scope.refreshKeys = function(){
            $scope.storageKeys = LocalStorageService.getAllKeys();
        }

        $scope.checkStorage = function(){
            if(LocalStorageService.check() !== false){
                $scope.checkLocalStorageMessage = 'LocalStorage ist verfügbar!';
                $scope.$broadcast('refreshKeys');
            }
        };

        $scope.isLocalStorage = function(){
            if(LocalStorageService.check() !== false){
                return true;
            }

            return false;
        }

        $scope.clearStorage = function(){
            LocalStorageService.clearAll();
        }

        $scope.$on('refreshKeys', $scope.refreshKeys);
    }]);

    app.register.controller('addFormKeyCtrl',['$rootScope','$scope','LocalStorageService',function($rootScope,$scope,LocalStorageService){
        $scope.addStorageKey = function(){
            if(LocalStorageService.save($scope.key, $scope.value)){
                $scope.resetForm();
                $rootScope.$broadcast('refreshKeys');
            }
        };

        $scope.resetForm = function(){
            $scope.key = "";
            $scope.value = "";
        };
    }]);

    app.register.controller('handleKeyCtrl',['$rootScope','$scope','LocalStorageService', function($rootScope,$scope,LocalStorageService){
        $scope.currentValue = "";

        $scope.deleteKey = function(key){
            if($scope.currentValue == LocalStorageService.get(key)){
                $scope.clearValue();
            };

            if(LocalStorageService.remove(key)){
                $rootScope.$broadcast('refreshKeys');
            }
        };
        $scope.showValue = function(key){
            $scope.currentValue = LocalStorageService.get(key);
        };

        $scope.clearValue = function (){
            $scope.currentValue = "";
        };
    }]);

});