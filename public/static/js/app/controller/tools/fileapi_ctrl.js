'use strict';
define(['app'
   ,'_s/utilService'
   ,'_s/apiService'
   ,'_s/cryptoService'
   ,'_v/filesaver/filesaver'
   ,'_v/sjcl/main'
   ,'directive/ngUpload'
], function (app) {
    // root controller for the whole template
    app.register.controller('ToolsFileapiCtrl', ['$scope', function($scope){}]);
    // crypto controller manage the key
    app.register.controller('CryptoCtrl',['$rootScope', '$scope', 'Crypto',
    function($rootScope, $scope, Crypto){
        $scope.key = "HSYEG-LIIPP-LNHOD-FGKMQ-NILHL-KHJIT-DFWSI-TIRKM-XWFND-DTYDG-BXNIP-MVXED";//Crypto.genKey();

        $scope.updateKey = function(){
            $rootScope.$broadcast("CryptoCtrl.keyChange",$scope.key);
        };
        $scope.genKey = function(){
            $scope.key = Crypto.genKey();
            $rootScope.$broadcast("CryptoCtrl.keyChange",$scope.key);
        };
        // event handler for key input
        $scope.$on("CryptoCtrl.getKey",function(e,callback){
            angular.isFunction(callback)?callback($scope.key):angular.noop()
        });
        $rootScope.$broadcast("CryptoCtrl.keyChange")
    }]);

    app.register.controller('SendFileCtrl', ['$rootScope', '$scope', 'Api', 'Util', 'Crypto',
    function($rootScope, $scope, Api, Util, Crypto){
        $scope.Util = Util;

        $scope.$on("CryptoCtrl.keyChange",function(e,key){
            $scope.key = key;
        });
        $rootScope.$broadcast("CryptoCtrl.getKey",function(key){
            $scope.key = key;
        });

        $scope.time = 0;
        $scope.file = {};
        $scope.fileSize = 0;
        $scope.placeholder = {file:"chooseFile"};
        $scope.chunks = {
            percent: 0
           ,processed: 0
           ,size: 256
           ,total: 0
           ,queue: 0
        };
        $scope.assetId = 0;
        $scope.apiError = {};
        $scope.sliceType = "";
        $scope.uploadState = "";

        $scope.checkEmpty = function(default_val){
            if($scope.chunks.size == "")
                $scope.chunks.size = default_val
        };
        $scope.calcChunkSize = function(event){
            $scope.fileSize = event.target.files[0].size;
            $scope.chunks.total = Math.ceil($scope.fileSize / ($scope.chunks.size*1024));
            $scope.chunks.percent = 0;
            $scope.chunks.processed = 0;
        };

        $scope.sendFile = function(){
            Crypto.benchmarkStart();
            $scope.uploadState = "start send file";
            // calculate the number of slices
            $scope.assetId = 0;
            $scope.apiError = {};
            $scope.chunks.total = Math.ceil($scope.fileSize / ($scope.chunks.size*1024));
            $scope.chunks.queue = $scope.chunks.total;
            // start sending
            sendChunks(0);
        };
        // step 1 calc start & end byte
        function sendChunks(index){
            var startByte = index > 0 ?index*($scope.chunks.size*1024):0;
            var endByte = startByte + ($scope.chunks.size*1024);

            if(endByte > $scope.fileSize)
                endByte = $scope.fileSize;

            if(startByte < $scope.fileSize)
                sliceChunk(index, startByte, endByte);
            else
                $scope.time = Crypto.benchmarkEnd();
        }
        // step 2 slice chunk from blob
        function sliceChunk(index, start, end) {
            $scope.uploadState = "slice chunk "+index;
            try{
                var file = $scope.file, chunk;

                $scope.sliceType = "default???";

                if (file.webkitSlice) {
                    $scope.sliceType = "webkit s:"+start+" e:"+end;
                    chunk = file.webkitSlice(start, end);
                } else if (file.mozSlice) {
                    $scope.sliceType = "moz s:"+start+" e:"+end;
                    chunk = file.mozSlice(start, end);
                } else {
                    $scope.sliceType = "default s:"+start+" e:"+end;
                    chunk = file.slice(start, end);
                }

                if (file.webkitSlice) { // android default browser in version 4.0.4 has webkitSlice instead of slice()
                    $scope.uploadState = "webkitSlice exception "+index;
                    str2ab_blobreader(chunk, function(buf) { // we cannot send a blob, because body payload will be empty
                        chunkReadyForUpload(index,buf);
                    });
                } else {
                    chunkReadyForUpload(index,chunk);
                }
            } catch(error){
                $scope.uploadState = "slice error at:"+index+" "+error;
            }
        }
        function str2ab_blobreader(str, callback) {
            $scope.uploadState = "str2ab_blobreader";
            var blob;
            var BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;
            if (typeof(BlobBuilder) !== 'undefined') {
                $scope.uploadState = "blobbuilder exists";
                var bb = new BlobBuilder();
                bb.append(str);
                blob = bb.getBlob();
            } else {
                $scope.uploadState = "default blob";
                blob = new Blob([str]);
            }
            var f = new FileReader();
            f.onload = function(e) {
                $scope.uploadState = "filereader loaded";
                callback(e.target.result)
            };
            f.readAsArrayBuffer(blob);
        }
        // step 3 read chunk from blob and send to api
        function chunkReadyForUpload(index,chunk){
            $scope.uploadState = "send chunk "+index;
            var reader = new FileReader();
            reader.onload = function(event){
                $scope.uploadState = "chunk "+index+" readed base64:"+(event.target.result != ""?"true":"false");
                var chunk = event.target.result;
                    // encrypt
                    chunk = sjcl.encrypt(String($scope.key), String(event.target.result), { ks: 256 });
                $scope.uploadState = "chunk "+index+" encryptet";
                Api.sendFile({
                    file: $scope.file
                   ,index: index
                   ,chunk: chunk
                   ,chunksTotal: $scope.chunks.total
                   ,assetId: $scope.assetId
                }).
                success(function(json){
                    $scope.uploadState = "chunk success "+index;

                    if(angular.isDefined(json) && json != "" && "assetId" in json){
                        $scope.assetId = json.assetId;
                        $rootScope.$broadcast("SendFileCtrl.assetIdChanged",json.assetId);
                    }
                    chunkUploaded(index+1);
                }).
                error(function(res, state){

                    $scope.uploadState = "chunk error "+index+" "+arguments;
                    $scope.apiError = state;
                });
            };
            reader.readAsDataURL(chunk);
        }
        // step 4 chunk1 uploaded and upload chunk2
        function chunkUploaded(index){
            $scope.uploadState = "chunk "+index+" uploaded";
            $scope.chunks.queue--;
            $scope.chunks.processed = index;
            $scope.chunks.percent = Math.round($scope.chunks.processed/$scope.chunks.total * 100);
            sendChunks(index);
        }
    }]);

    app.register.controller('GetFileCtrl', ['$rootScope', '$scope', 'Api', 'Util', 'Crypto',
    function($rootScope, $scope, Api, Util, Crypto){
        $scope.Util = Util;
        $scope.time = 0;
        $scope.progress = 0;
        $scope.file = {};
        $scope.chunks = {
            percent: 0
           ,processed: 0
           ,size: 256
           ,total: 0
           ,queue: 0
        };
        $scope.assetId = 996056;//247182=jpg 430035=avi 996056=mp4 146641=mov;

        $scope.$on("CryptoCtrl.keyChange",function(e,key){
            $scope.key = key;
        });
        $rootScope.$broadcast("CryptoCtrl.getKey",function(key){
            $scope.key = key;
        });

        $scope.$on("SendFileCtrl.assetIdChanged",function(event, assetId){
            $scope.assetId = assetId;
        });

        var file = "";

        $scope.getFile = function(){
            file = "";
            Api.getFile($scope.assetId).success(function(json){
                Crypto.benchmarkStart();
                $scope.file = json;
                $scope.chunks.total = Object.keys($scope.file.chunks).length;
                $scope.chunks.processed = 0;
                $scope.chunks.queue = $scope.chunks.total;
                $scope.chunks.percent = 0;
                // pull first chunk
                getChunk(0);
            });
        };

        function b64toBlob(byteCharacters, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

        return new Blob(byteArrays, {type: contentType});
        }

        function getChunk(index){
            // progress bar
            $scope.chunks.queue--;
            $scope.chunks.processed = index+1;
            $scope.chunks.percent = Math.round($scope.chunks.processed/$scope.chunks.total * 100);

            Api.getFile($scope.assetId, index).success(function(json){
                // multithread decoding
                var chunk = json.chunk;
                // decrypt with json
                chunk = sjcl.decrypt(String($scope.key), String(chunk));
                file += atob(chunk.replace(new RegExp('^(data:(.*);base64,)','i'),''));
                // loop and get next chunk
                if(index+1 < $scope.chunks.total)
                    getChunk(index+1);
                else
                    saveFile();
            });
        }

        function saveFile(){
            if(file != ""){
                $scope.time = "before save then comes the benchmark time";
                saveAs(
                    b64toBlob(file, $scope.file.fileType)
                   ,$scope.file.fileName
                );
                file = "";
                $scope.time = Crypto.benchmarkEnd();
            } else {
                $scope.time = "file is empty no decryption possible";
            }
        }

    }]);
});


