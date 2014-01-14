'use strict';
define(['app','service/apiService'], function (app, Crypt) {
    app.register.controller('FileApiCtrl', ['$scope', '$location', 'Crypt',
        function($scope, $location, Crypt){
            $scope.percent = "Waiting...";
            $scope.placeholder = {file:"chooseFile"};
            $scope.slicesTotal = 0;
            $scope.uploadme = {}
            $scope.chunkSize = 1024;

            var slices; // slices, value that gets decremented

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
                }
                f.readAsArrayBuffer(blob);
            }

            function uploadFile(blob, index, start, end) {
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
                        chunkReady(blob,index,buf);
                    });
                } else {
                    chunkReady(blob,index,chunk);
                }
            }

            function chunkReady(blob,index,chunk){
                var reader = new FileReader();
                reader.onload = function(loadEvent){
                    Crypt.sendFile({
                        blob: blob
                       ,index: index
                       ,chunk: loadEvent.target.result
                       ,maxChunks: $scope.slicesTotal
                    }).
                    success(function(res,state){
                        slices--;

                        $scope.progress = index;
                        $scope.percent = Math.round(index/$scope.slicesTotal * 100) + "%";

                        // if we have finished all slices
                        if(slices == 0) {
                            //mergeFile(blob);
                        }
                    }).
                    error(function(res, state){

                    })/*.
                     progress(function(evt){
                     if (evt.lengthComputable){
                     $scope.progress.$attrs.max = $scope.slicesTotal;
                     $scope.progress = index;
                     $scope.percent = Math.round(index/$scope.slicesTotal * 100) + "%";
                     }
                     });*/
                };
                reader.readAsDataURL(chunk);
            }

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
                console.log(event)
                $scope.slicesTotal = Math.ceil(event.target.files[0].size / ($scope.chunkSize*1024));;
            };

            $scope.sendFile = function(){
                var blob = $scope.uploadme;

                var start = 0;
                var end;
                var index = 0;

                // calculate the number of slices
                slices = Math.ceil(blob.size / ($scope.chunkSize*1024));
                $scope.slicesTotal = slices;

                while(start < blob.size) {
                    end = start + ($scope.chunkSize*1024);
                    if(end > blob.size) {
                        end = blob.size;
                    }

                    uploadFile(blob, index, start, end);

                    start = end;
                    index++;
                }
            };
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


