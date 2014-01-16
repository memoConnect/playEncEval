'use strict';
define(['app','service/apiService'], function (app) {
    app.register.controller('FileApiCtrl', ['$scope', '$location', 'Api',
    function($scope, $location, Api){
        $scope.percent = 0;
        $scope.progress = 0;
        $scope.placeholder = {file:"chooseFile"};
        $scope.chunkSize = 128;
        $scope.maxChunks = 0;
        $scope.chunksQueue = 0;
        $scope.uploadme = {};
        $scope.assetId = "";

        $scope.bytesToSize = function(bytes) {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) return 'n/a';
            var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        };

        $scope.checkEmpty = function(default_val){
            if($scope.chunkSize == "")
                $scope.chunkSize = default_val
        };

        $scope.calcChunkSize = function(event){
            $scope.maxChunks = Math.ceil(event.target.files[0].size / ($scope.chunkSize*1024));
        };

        $scope.sendFile = function(){
            var file = $scope.uploadme;
            // calculate the number of slices
            $scope.maxChunks = Math.ceil(file.size / ($scope.chunkSize*1024));
            $scope.chunksQueue = $scope.maxChunks;
            // start sending
            sendChunks(0);
        };
        // step 1 calc start & end byte
        function sendChunks(index){
            var file = $scope.uploadme, startByte, endByte;

            startByte = index > 0 ?index*($scope.chunkSize*1024):0;
            endByte = startByte + ($scope.chunkSize*1024);

            if(endByte > file.size)
                endByte = file.size;

            if(startByte < file.size){
                sliceChunk(file, index, startByte, endByte);
            }
        }
        // step 2 slice chunk from blob
        function sliceChunk(blob, index, start, end) {
            var chunk;

            if (blob.webkitSlice) {
                chunk = blob.webkitSlice(start, end);
            } else if (blob.mozSlice) {
                chunk = blob.mozSlice(start, end);
            } else {
                chunk = blob.slice(start, end);
            }

            if (blob.webkitSlice) { // android default browser in version 4.0.4 has webkitSlice instead of slice()
                var buffer = str2ab_blobreader(chunk, function(buf) { // we cannot send a blob, because body payload will be empty
                    chunkReadyForUpload(blob,index,buf);
                });
            } else {
                chunkReadyForUpload(blob,index,chunk);
            }
        }
        function str2ab_blobreader(str, callback) {
            var blob;
            var BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;
            if (typeof(BlobBuilder) !== 'undefined') {
                var bb = new BlobBuilder();
                bb.append(str);
                blob = bb.getBlob();
            } else {
                blob = new Blob([str]);
            }
            var f = new FileReader();
            f.onload = function(e) {
                callback(e.target.result)
            };
            f.readAsArrayBuffer(blob);
        }
        // step 3 read chunk from blob and send to api
        function chunkReadyForUpload(blob,index,chunk){
            var reader = new FileReader();
            reader.onload = function(event){
                Api.sendFile({
                    blob: blob
                   ,index: index
                   ,chunk: event.target.result
                   ,maxChunks: $scope.maxChunks
                   ,assetId: $scope.assetId
                }).
                success(function(res){
                    if(angular.isDefined(res) && res != "" && "assetId" in res){
                        $scope.assetId = res.assetId;
                    }
                    chunkUploaded(index+1);
                }).
                error(function(res,state){

                });
            };
            reader.readAsDataURL(chunk);
        }
        // step 4 chunk1 uploaded and upload chunk2
        function chunkUploaded(index){
            $scope.chunksQueue--;
            $scope.progress = index;
            $scope.percent = Math.round(index/$scope.maxChunks * 100);
            sendChunks(index);
        }

    }]);
    app.register.directive("fileread", [function () {
        return {
            scope: {
                fileread: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    scope.$apply(function () {
                        scope.fileread = changeEvent.target.files[0];
                        // or all selected files:
                        // scope.fileread = changeEvent.target.files;
                    });
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileread.base = loadEvent.target.result;
                        });
                    };
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        }
    }]);
});


